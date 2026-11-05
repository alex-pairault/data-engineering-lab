"""Reference implementation. Read only after an attempt; not learner evidence."""


def total_paid(rows):
    return sum(row["amount_cents"] for row in rows if row["status"] == "paid")
