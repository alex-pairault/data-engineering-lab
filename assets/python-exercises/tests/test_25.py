import pytest


def test_threads_order_and_failure(m):
    assert m.fetch_all([3, 1, 2], lambda value: value * 2) == [6, 2, 4]
    assert m.fetch_all([], lambda value: value) == []

    def broken(value):
        if value == 2:
            raise ValueError("worker failed")
        return value

    with pytest.raises(ValueError, match="worker failed"):
        m.fetch_all([1, 2, 3], broken)


# Add your own changed case below. Keep this file when switching targets.
