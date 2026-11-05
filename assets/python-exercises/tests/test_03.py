def test_aggregation_and_empty(m):
    rows = [
        {"customer": "A", "status": "paid", "amount_cents": 3},
        {"customer": "A", "status": "paid", "amount_cents": 7},
        {"customer": "B", "status": "pending", "amount_cents": 8},
    ]
    assert m.paid_totals(rows) == {"A": 10}
    assert m.paid_totals([]) == {}
    assert rows[0]["amount_cents"] == 3


# Add your own changed case below. Keep this file when switching targets.
