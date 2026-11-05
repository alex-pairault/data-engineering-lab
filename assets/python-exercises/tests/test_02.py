def test_none_and_zero(m):
    assert m.display_count(None) == "unknown"
    assert m.display_count(0) == "0"
    assert m.display_count(12) == "12"


# Add your own changed case below. Keep this file when switching targets.
