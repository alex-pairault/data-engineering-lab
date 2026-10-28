"""Fieldnotes local data mechanisms, Python 3.10+, standard library only.

Run: python data_lab.py --case transactions|imports|security|plans|recovery|events|capstone
All databases are disposable. No network, credentials or employer data are used.
"""

import argparse
from contextlib import closing
import json
import sqlite3


def transactions():
    with closing(sqlite3.connect(":memory:")) as db:
        db.executescript(
            "CREATE TABLE stock(quantity INTEGER NOT NULL CHECK(quantity>=0)); INSERT INTO stock VALUES(1); CREATE TABLE sales(caller TEXT);"
        )
        # These reads occur before either caller's protecting write transaction.
        observed = [
            db.execute("SELECT quantity FROM stock").fetchone()[0] for _ in range(2)
        ]
        for caller, old in zip(["A", "B"], observed):
            with db:
                db.execute("UPDATE stock SET quantity=?", (old - 1,))
                db.execute("INSERT INTO sales VALUES(?)", (caller,))
        stale = {
            "stock": db.execute("SELECT quantity FROM stock").fetchone()[0],
            "sales": db.execute("SELECT COUNT(*) FROM sales").fetchone()[0],
        }
        db.execute("UPDATE stock SET quantity=1")
        db.execute("DELETE FROM sales")
        db.commit()
        affected = []
        for caller in ["A", "B"]:
            with db:
                changed = db.execute(
                    "UPDATE stock SET quantity=quantity-1 WHERE quantity>0"
                ).rowcount
                affected.append(changed)
                if changed:
                    db.execute("INSERT INTO sales VALUES(?)", (caller,))
        guarded = {
            "stock": db.execute("SELECT quantity FROM stock").fetchone()[0],
            "sales": db.execute("SELECT COUNT(*) FROM sales").fetchone()[0],
            "affected": affected,
        }
        db.execute("UPDATE stock SET quantity=1")
        db.commit()
        try:
            with db:
                db.execute("UPDATE stock SET quantity=0")
                raise RuntimeError("Synthetic failure before commit")
        except RuntimeError:
            pass
        rollback = db.execute("SELECT quantity FROM stock").fetchone()[0]
        assert (
            stale == {"stock": 0, "sales": 2}
            and guarded["sales"] == 1
            and rollback == 1
        )
        return {
            "stale_reads_then_writes": stale,
            "guarded_atomic_update": guarded,
            "after_rollback": rollback,
        }


def imports():
    records = [("A", 10), ("B", 20), ("C", 30)]
    with closing(sqlite3.connect(":memory:")) as db:
        db.executescript(
            "CREATE TABLE appended(external_id TEXT, amount INTEGER NOT NULL); CREATE TABLE snapshot(external_id TEXT PRIMARY KEY,amount INTEGER NOT NULL CHECK(amount>=0));"
        )
        for batch in [
            records[:2],
            records,
        ]:  # interruption after two commits, then replay
            for identity, amount in batch:
                with db:
                    db.execute("INSERT INTO appended VALUES(?,?)", (identity, amount))
                    db.execute(
                        "INSERT INTO snapshot VALUES(?,?) ON CONFLICT(external_id) DO UPDATE SET amount=excluded.amount",
                        (identity, amount),
                    )
        count, total = db.execute(
            "SELECT COUNT(*),SUM(amount) FROM snapshot"
        ).fetchone()
        assert (count, total) == (3, 60)
        with db:
            db.execute(
                "INSERT INTO snapshot VALUES('B',25) ON CONFLICT(external_id) DO UPDATE SET amount=excluded.amount"
            )
        changed = db.execute("SELECT SUM(amount) FROM snapshot").fetchone()[0]
        return {
            "append_rows": db.execute("SELECT COUNT(*) FROM appended").fetchone()[0],
            "upsert_rows": count,
            "upsert_total": total,
            "update_on_change_total": changed,
        }


def security():
    with closing(sqlite3.connect(":memory:")) as db:
        db.execute("CREATE TABLE orders(id INTEGER PRIMARY KEY,owner TEXT,note TEXT)")
        db.executemany(
            "INSERT INTO orders VALUES(?,?,?)",
            [(901, "Mina", "paid"), (902, "Owen", "paid"), (903, "Mina", "O'Reilly")],
        )
        output = {}
        for label, text in [
            ("ordinary", "paid"),
            ("apostrophe", "O'Reilly"),
            ("injection", "' OR 1=1 --"),
        ]:
            # Deliberately unsafe read-only query over synthetic rows for comparison.
            query = (
                "SELECT id FROM orders WHERE owner='Mina' AND note='"
                + text
                + "' ORDER BY id"
            )
            try:
                unsafe = [row[0] for row in db.execute(query)]
            except sqlite3.Error:
                unsafe = "SQL syntax error"
            safe = [
                row[0]
                for row in db.execute(
                    "SELECT id FROM orders WHERE owner=? AND note=? ORDER BY id",
                    ("Mina", text),
                )
            ]
            output[label] = {"concatenated": unsafe, "bound": safe}
        assert (
            output["injection"]["concatenated"] == [901, 902, 903]
            and output["injection"]["bound"] == []
        )
        assert output["apostrophe"]["bound"] == [903]
        return output


def plans():
    with closing(sqlite3.connect(":memory:")) as db:
        db.executescript(
            "CREATE TABLE orders(id INTEGER PRIMARY KEY,customer_id INTEGER NOT NULL); CREATE TABLE lines(order_id INTEGER,amount INTEGER);"
        )
        db.executemany(
            "INSERT INTO orders VALUES(?,?)", [(i, i % 100) for i in range(1, 5001)]
        )
        db.executemany(
            "INSERT INTO lines VALUES(?,?)",
            [(i, amount) for i in range(1, 6) for amount in [10, 20]],
        )

        def plan():
            return [
                r[3]
                for r in db.execute(
                    "EXPLAIN QUERY PLAN SELECT id FROM orders WHERE customer_id=17"
                )
            ]

        before = plan()
        expected = list(db.execute("SELECT id FROM orders WHERE customer_id=17"))
        db.execute("CREATE INDEX orders_customer ON orders(customer_id)")
        after = plan()
        assert (
            list(db.execute("SELECT id FROM orders WHERE customer_id=17")) == expected
        )
        statements = []
        db.set_trace_callback(
            lambda sql: (
                statements.append(sql)
                if sql.lstrip().upper().startswith("SELECT")
                else None
            )
        )
        parents = [
            r[0] for r in db.execute("SELECT id FROM orders WHERE id<=5 ORDER BY id")
        ]
        separate = {
            identity: sum(
                r[0]
                for r in db.execute(
                    "SELECT amount FROM lines WHERE order_id=?", (identity,)
                )
            )
            for identity in parents
        }
        count_separate = len(statements)
        statements.clear()
        parents = [
            r[0] for r in db.execute("SELECT id FROM orders WHERE id<=5 ORDER BY id")
        ]
        # Bounded fixture: five IDs. Bind values instead of interpolating data.
        batched = {identity: 0 for identity in parents}
        for identity, amount in db.execute(
            "SELECT order_id,amount FROM lines WHERE order_id IN (?,?,?,?,?)", parents
        ):
            batched[identity] += amount
        count_batch = len(statements)
        db.set_trace_callback(None)
        assert separate == batched and (count_separate, count_batch) == (6, 2)
        return {
            "filter_plan_before": before,
            "filter_plan_after": after,
            "equal_results": True,
            "per_parent_selects": count_separate,
            "batched_selects": count_batch,
            "totals": batched,
        }


def recovery():
    with (
        closing(sqlite3.connect(":memory:")) as source,
        closing(sqlite3.connect(":memory:")) as snapshot,
        closing(sqlite3.connect(":memory:")) as restored,
    ):
        source.execute(
            "CREATE TABLE orders(id INTEGER PRIMARY KEY,amount INTEGER NOT NULL)"
        )
        source.executemany("INSERT INTO orders VALUES(?,?)", [(1, 10), (2, 20)])
        source.commit()
        source.backup(snapshot)
        source.execute("INSERT INTO orders VALUES(3,10)")
        source.commit()
        before_loss = source.execute(
            "SELECT COUNT(*),SUM(amount) FROM orders"
        ).fetchone()
        source.execute("DELETE FROM orders")
        source.commit()
        # Changing application code would not recover these rows.
        assert source.execute("SELECT COUNT(*) FROM orders").fetchone()[0] == 0
        snapshot.backup(restored)
        rows = list(restored.execute("SELECT id,amount FROM orders ORDER BY id"))
        assert rows == [(1, 10), (2, 20)]
        return {
            "before_loss": before_loss,
            "source_after_loss": 0,
            "restored_rows": rows,
            "restored_total": 30,
            "post_snapshot_amount_not_restored": 10,
        }


def events():
    with closing(sqlite3.connect(":memory:")) as db:
        db.executescript(
            "CREATE TABLE seen(id TEXT PRIMARY KEY); CREATE TABLE effect(total INTEGER); INSERT INTO effect VALUES(0);"
        )
        for event in ["event-7", "event-7"]:
            with db:
                fresh = db.execute(
                    "INSERT INTO seen VALUES(?) ON CONFLICT(id) DO NOTHING", (event,)
                ).rowcount
                if fresh:
                    db.execute("UPDATE effect SET total=total+1")
        assert db.execute("SELECT total FROM effect").fetchone()[0] == 1
        try:
            with db:
                db.execute("INSERT INTO seen VALUES('event-8')")
                db.execute("UPDATE effect SET total=total+1")
                raise RuntimeError("Synthetic error before effect/identity commit")
        except RuntimeError:
            pass
        assert (
            db.execute("SELECT COUNT(*) FROM seen WHERE id='event-8'").fetchone()[0]
            == 0
        )
        return {
            "deliveries": 2,
            "committed_effects": 1,
            "failed_identity_and_effect_rolled_back": True,
        }


def capstone():
    with closing(sqlite3.connect(":memory:")) as db:
        db.execute(
            "CREATE TABLE orders(external_id TEXT PRIMARY KEY,owner TEXT NOT NULL,amount INTEGER NOT NULL CHECK(amount>=0))"
        )
        records = [("A", "Mina", 10), ("B", "Owen", 20), ("C", "Mina", 30)]
        for batch in [records[:2], records]:
            with db:
                db.executemany(
                    "INSERT INTO orders VALUES(?,?,?) ON CONFLICT(external_id) DO UPDATE SET owner=excluded.owner, amount=excluded.amount",
                    batch,
                )
        cache = {}

        def read(owner):
            if owner not in {"Mina", "Owen"}:
                return 401, []
            if owner not in cache:
                cache[owner] = list(
                    db.execute(
                        "SELECT external_id,owner,amount FROM orders WHERE owner=? ORDER BY external_id",
                        (owner,),
                    )
                )
            return 200, cache[owner]

        for owner in ["Mina", "Owen", "Owen", "Mina"]:
            status, rows = read(owner)
            assert status == 200 and rows and all(r[1] == owner for r in rows)
        assert read("anonymous") == (401, [])
        assert db.execute("SELECT COUNT(*) FROM orders").fetchone()[0] == 3
        return {
            "replayed_import_rows": 3,
            "both_user_orders_and_warm_reads_checked": True,
            "anonymous_status": 401,
            "next_task": "Add one changed edge case and explain its expected result yourself.",
        }


CASES = {
    "transactions": transactions,
    "imports": imports,
    "security": security,
    "plans": plans,
    "recovery": recovery,
    "events": events,
    "capstone": capstone,
}
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--case", choices=CASES, required=True)
    print(json.dumps(CASES[parser.parse_args().case](), indent=2))
