"""Intentionally faulty starter: ignores validation and conflicts."""


def ingest_total(rows):
    seen = {}
    for row in rows:
        if row["status"] == "paid":
            seen[row["order_id"]] = row
    return sum(row["amount_cents"] for row in seen.values())
