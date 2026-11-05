"""Intentionally faulty starter: add a regression test before repairing it."""


def total_paid(rows):
    total = 0
    for row in rows:
        if row["status"] == "paid":
            total = row["amount_cents"]
    return total
