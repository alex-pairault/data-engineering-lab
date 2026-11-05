def test_order_and_repeats(m):
    assert m.unique_ids([3, 1, 3, 2, 1]) == [3, 1, 2]
    assert m.unique_ids(iter([4, 4, 5])) == [4, 5]
    assert m.unique_ids([]) == []


# Add your own changed case below. Keep this file when switching targets.
