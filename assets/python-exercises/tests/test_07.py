def test_one_pass_totals(m):
    assert m.total_squares(iter([1, 2, 3])) == 14
    assert m.total_squares(iter([])) == 0
    assert m.total_squares(range(100)) == sum(n * n for n in range(100))


# Add your own changed case below. Keep this file when switching targets.
