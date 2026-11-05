def test_lazy_state_and_exhaustion(m):
    visited = []

    def source():
        for value in range(4):
            visited.append(value)
            yield value

    stream = m.iter_doubles(source())
    assert visited == []
    assert next(stream) == 0
    assert visited == [0]
    assert list(stream) == [2, 4, 6]
    assert list(stream) == []


# Add your own changed case below.
