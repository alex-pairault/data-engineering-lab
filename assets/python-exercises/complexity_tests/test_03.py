from complexity_support import CountedSequence


def test_binary_results_and_probes(m):
    assert m.binary_index([], 5) == -1
    for size in (1, 8, 16, 65):
        for target in (-1, 0, size // 2, size - 1, size + 1):
            values = CountedSequence(range(size))
            index = m.binary_index(values, target)
            assert index == (target if 0 <= target < size else -1)
            assert values.copied == 0
            assert values.reads <= size.bit_length()


# Add your own changed case below.
