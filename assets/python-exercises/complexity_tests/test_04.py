import pytest
from complexity_support import CountedSequence


def test_slice_copies_selected_items(m):
    for size, k in [(8, 3), (32, 16)]:
        values = CountedSequence(range(size))
        assert m.prefix_copy(values, k) == list(range(k))
        assert values.copied == k
    assert m.prefix_copy([], 0) == []
    for k in (-1, 4):
        with pytest.raises(ValueError):
            m.prefix_copy([1, 2, 3], k)


# Add your own changed case below.
