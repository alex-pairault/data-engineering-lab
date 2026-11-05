def test_supported_versions(m):
    assert m.supports((3, 12, 0))
    assert m.supports((3, 15, 2))
    assert not m.supports((3, 11, 9))
    assert not m.supports((4, 0, 0))


# Add your own changed case below. Keep this file when switching targets.
