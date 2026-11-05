"""Tutor reference; not learner-authored evidence."""


def indexed_totals(customers, orders):
    totals = {}
    for row in orders:
        if row["status"] == "paid":
            key = row["customer_id"]
            totals[key] = totals.get(key, 0) + row["amount_cents"]
    return {customer: totals.get(customer, 0) for customer in customers}
