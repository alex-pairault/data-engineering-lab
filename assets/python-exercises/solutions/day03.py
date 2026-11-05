"""Reference implementation. Read only after an attempt; not learner evidence."""


def paid_totals(rows):
    totals = {}
    for row in rows:
        if row["status"] == "paid":
            key = row["customer"]
            totals[key] = totals.get(key, 0) + row["amount_cents"]
    return totals
