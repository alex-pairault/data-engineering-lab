from complexity_support import CountedSequence


def test_first_and_total_reads(m):
    assert m.first_or_none([]) is None
    assert m.scan_total([]) == 0
    for size in (8, 32):
        first = CountedSequence(range(size))
        assert m.first_or_none(first) == 0
        assert first.reads == 1
        full = CountedSequence(range(size))
        assert m.scan_total(full) == sum(range(size))
        assert full.reads == size


# Add your own changed case below.
