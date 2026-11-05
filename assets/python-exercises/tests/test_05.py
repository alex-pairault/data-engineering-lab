def test_nested_independence(m):
    original = {"id": 1, "tags": ["a"]}
    result = m.with_tag(original, "b")
    assert result == {"id": 1, "tags": ["a", "b"]}
    result["tags"].append("c")
    assert original == {"id": 1, "tags": ["a"]}
    assert result is not original


# Add your own changed case below. Keep this file when switching targets.
