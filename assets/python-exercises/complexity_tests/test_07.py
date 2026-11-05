from complexity_support import ComparisonValue


def test_merge_preserves_values_and_comparison_bound(m):
    assert m.merge_sorted([], []) == []
    assert m.merge_sorted([], [1, 2]) == [1, 2]
    for size in (8, 32):
        counter = {"comparisons": 0}
        left = [ComparisonValue(i, counter) for i in range(0, size, 2)]
        right = [ComparisonValue(i, counter) for i in range(1, size, 2)]
        result = m.merge_sorted(left, right)
        assert [v.value for v in result] == list(range(size))
        assert counter["comparisons"] <= size - 1
        assert [v.value for v in left] == list(range(0, size, 2))
        assert [v.value for v in right] == list(range(1, size, 2))


# Add your own changed case below.
