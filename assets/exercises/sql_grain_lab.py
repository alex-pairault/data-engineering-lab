"""Download with grain-data.json into the same folder. Run: python sql_grain_lab.py

Executes the three queries and constraint failures in disposable SQLite only.
"""
import argparse
import json
from pathlib import Path
import sqlite3


def run(fixture):
    with sqlite3.connect(":memory:") as db:
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA foreign_keys = ON")  # SQLite needs this per connection
        db.executescript("""
          CREATE TABLE orders (id INTEGER PRIMARY KEY);
          CREATE TABLE lines (id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders(id),
                              amount INTEGER NOT NULL CHECK(amount >= 0));
          CREATE TABLE payments (id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders(id),
                                 amount INTEGER NOT NULL CHECK(amount >= 0));
        """)
        db.executemany("INSERT INTO orders VALUES (:id)", fixture["orders"])
        db.executemany("INSERT INTO lines VALUES (:id, :order_id, :amount)", fixture["lines"])
        db.executemany("INSERT INTO payments VALUES (:id, :order_id, :amount)", fixture["payments"])
        queries = {name: [dict(row) for row in db.execute(query)] for name, query in fixture["queries"].items()}
        failures = {}
        for label, statement in {
            "duplicate_primary_key": "INSERT INTO lines VALUES (1, 901, 50)",
            "orphan_reference": "INSERT INTO lines VALUES (4, 999, 50)",
            "negative_amount": "INSERT INTO lines VALUES (5, 901, -1)",
        }.items():
            try:
                db.execute(statement)
            except sqlite3.IntegrityError:
                failures[label] = "rejected"
            else:
                raise AssertionError(f"Expected {label} to be rejected")
        return {"queries": queries, "constraints": failures}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, default=Path(__file__).with_name("grain-data.json"))
    args = parser.parse_args()
    print(json.dumps(run(json.loads(args.data.read_text())), indent=2))
