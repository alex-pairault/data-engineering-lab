def test_actual_body_counts(m):
    for n, width in [(0, 5), (5, 0), (3, 7), (8, 8), (16, 16)]:
        assert m.pair_visits(n, width) == n * width
    assert m.separate_visits(0) == 0
    assert m.separate_visits(8) == 16
    assert m.separate_visits(16) == 32


# Add your own changed case below.
