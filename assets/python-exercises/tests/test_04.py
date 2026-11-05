def test_independent_calls(m):
    assert m.append_tag("a") == ["a"]
    assert m.append_tag("b") == ["b"]
    original = ["seed"]
    first = m.append_tag("a", original)
    second = m.append_tag("b", original)
    assert original == ["seed"]
    assert first == ["seed", "a"] and second == ["seed", "b"]


# Add your own changed case below. Keep this file when switching targets.
