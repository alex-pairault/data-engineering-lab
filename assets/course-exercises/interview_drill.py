"""Lesson 36 starter: repair paid_total and explain the change.

Run: python interview_drill.py
The starting implementation deliberately fails the multi-paid case. Modify your
own copy, run again, and add one changed case. No packages or network needed.
"""


def paid_total(orders):
    total = 0
    for order in orders:
        if order["status"] == "paid":
            total = order["amount"]  # Investigate the accumulator's behaviour.
    return total


def checks():
    cases = [
        (
            "multiple paid",
            [
                {"status": "paid", "amount": 10},
                {"status": "refunded", "amount": 99},
                {"status": "paid", "amount": 20},
            ],
            30,
        ),
        ("empty", [], 0),
        ("paid zero", [{"status": "paid", "amount": 0}], 0),
    ]
    failures = []
    for name, orders, expected in cases:
        actual = paid_total(orders)
        print(f"{name}: expected {expected}, observed {actual}")
        if actual != expected:
            failures.append(name)
    assert not failures, f"Repair and rerun: {failures}"


if __name__ == "__main__":
    checks()
