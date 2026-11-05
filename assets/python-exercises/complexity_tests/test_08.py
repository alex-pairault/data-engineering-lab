from complexity_support import HashingValue


def test_duplicate_behaviour(m):
    assert not m.has_duplicate([])
    assert not m.has_duplicate([0, 1, 2])
    assert m.has_duplicate([0, 1, 0])


def test_ordinary_hash_work(m):
    for size in (16, 64):
        counter = {"hashes": 0, "comparisons": 0}
        values = [HashingValue(i, counter) for i in range(size)]
        assert not m.has_duplicate(values)
        assert counter["hashes"] + counter["comparisons"] <= 3 * size


# Add your own changed case below.
