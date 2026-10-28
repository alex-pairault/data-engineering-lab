"""Execute the four lesson queries against a disposable, in-memory SQLite database.

Download this file and join-data.json into the same folder, then run:
    python sql_join_lab.py
Or use --data /path/to/join-data.json. No packages or persistent database needed.
"""
import argparse
import json
import sqlite3
from pathlib import Path


def run_queries(fixture):
    with sqlite3.connect(":memory:") as connection:
        connection.row_factory = sqlite3.Row
        connection.executescript("""
            CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
            CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL,
                                 status TEXT NOT NULL, amount INTEGER NOT NULL);
        """)
        connection.executemany("INSERT INTO customers VALUES (:id, :name)", fixture["customers"])
        connection.executemany("INSERT INTO orders VALUES (:id, :customer_id, :status, :amount)", fixture["orders"])
        return {name: [dict(row) for row in connection.execute(query)]
                for name, query in fixture["queries"].items()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, default=Path(__file__).with_name("join-data.json"))
    args = parser.parse_args()
    try:
        fixture = json.loads(args.data.read_text())
        print(json.dumps(run_queries(fixture), indent=2))
    except (OSError, ValueError, KeyError, sqlite3.Error) as error:
        parser.exit(1, f"Could not run the fixture: {error}\nKeep join-data.json beside this script or pass --data.\n")


if __name__ == "__main__":
    main()
