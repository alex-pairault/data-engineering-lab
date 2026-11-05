def test_explicit_version_family(m):
    assert not m.has_type_alias_syntax((3, 11))
    assert m.has_type_alias_syntax((3, 12))
    assert m.has_type_alias_syntax((3, 15))
    assert not m.has_type_alias_syntax((4, 0))


# Add your own changed case below. Keep this file when switching targets.
