"""Fieldnotes boundary checks. Python 3.10+, standard library, synthetic data.

Run: python reliability_lab.py --case boundaries|api|logs
The API transport is injected and deterministic; it sends no network requests.
"""

import argparse
from contextlib import closing
import json
import sqlite3
from urllib.error import HTTPError, URLError


def total(quantity):
    if type(quantity) is not int or quantity < 1:
        raise ValueError("positive integer required")
    return quantity * 10


def boundaries():
    unit = total(2) == 20
    with closing(sqlite3.connect(":memory:")) as db:
        db.execute("CREATE TABLE orders(total INTEGER NOT NULL)")
        try:
            db.execute("INSERT INTO orders(subtotal) VALUES(?)", (total(2),))
        except sqlite3.OperationalError:
            bad_schema = "detected by integration"
        db.execute("INSERT INTO orders(total) VALUES(?)", (total(2),))
        before = db.execute("SELECT COUNT(*) FROM orders").fetchone()[0]
        try:
            db.execute("INSERT INTO orders(total) VALUES(?)", (total(0),))
        except ValueError:
            pass
        after = db.execute("SELECT COUNT(*) FROM orders").fetchone()[0]
        assert before == after == 1
        return {
            "pure_rule_unit_pass": unit,
            "incorrect_storage_column": bad_schema,
            "valid_saved_total": db.execute("SELECT total FROM orders").fetchone()[0],
            "invalid_input_added_rows": after - before,
        }


def fetch_orders(transport):
    for attempt in range(1, 3):
        try:
            raw = transport(method="GET", timeout=3)
        except HTTPError as error:
            if error.code == 503 and attempt < 2:
                continue
            return {"error": "http", "status": error.code, "attempts": attempt}
        except (URLError, TimeoutError):
            return {"error": "transport", "attempts": attempt}
        try:
            payload = json.loads(raw)
        except (ValueError, TypeError):
            return {"error": "invalid_json", "attempts": attempt}
        valid = isinstance(payload, list) and all(
            isinstance(row, dict)
            and isinstance(row.get("id"), str)
            and type(row.get("amount")) is int
            and row["amount"] >= 0
            for row in payload
        )
        if not valid:
            return {"error": "invalid_schema", "attempts": attempt}
        return {"orders": payload, "attempts": attempt}
    raise AssertionError("unreachable")


def api():
    def transport_for(responses):
        iterator = iter(responses)

        def call(method, timeout):
            assert method == "GET" and timeout == 3
            response = next(iterator)
            if isinstance(response, Exception):
                raise response
            return response

        return call

    reports = {
        "valid": fetch_orders(transport_for(['[{"id":"A","amount":10}]'])),
        "retry_503": fetch_orders(
            transport_for(
                [HTTPError("https://example.test", 503, "Synthetic", None, None), "[]"]
            )
        ),
        "invalid_json": fetch_orders(transport_for(["broken"])),
        "wrong_schema": fetch_orders(transport_for(['{"orders": []}'])),
        "timeout": fetch_orders(transport_for([TimeoutError("Synthetic timeout")])),
    }
    assert (
        reports["retry_503"]["attempts"] == 2
        and reports["wrong_schema"]["error"] == "invalid_schema"
    )
    return reports


def logs():
    record = {
        "request": "r-18",
        "release": "demo-b",
        "stage": "upstream_connect",
        "status": "refused",
        "session_token": "SYNTHETIC_DO_NOT_LOG",
    }
    allowed = {key: record[key] for key in ["request", "release", "stage", "status"]}
    serialized = json.dumps(allowed)
    assert (
        "SYNTHETIC_DO_NOT_LOG" not in serialized and "session_token" not in serialized
    )
    return {
        "serialized_context": allowed,
        "planted_token_excluded": True,
        "network_events_sent": 0,
        "limit": "Values as well as field names need validation in a real logging schema.",
    }


CASES = {"boundaries": boundaries, "api": api, "logs": logs}
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--case", choices=CASES, required=True)
    print(json.dumps(CASES[parser.parse_args().case](), indent=2))
