def test_paid_baseline(m):
    assert m.total_paid([{"status": "paid", "amount_cents": 3}]) == 3
    assert m.total_paid([{"status": "pending", "amount_cents": 99}]) == 0
    assert m.total_paid([]) == 0


# Add your own changed case below. Keep this file when switching targets.
