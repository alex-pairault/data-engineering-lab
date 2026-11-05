def test_bounded_cache(m):
    m.normalize_name.cache_clear()
    assert m.normalize_name(" Mina ") == "mina"
    assert m.normalize_name(" Mina ") == "mina"
    assert m.normalize_name.cache_info().hits == 1
    m.normalize_name("Owen")
    m.normalize_name("Zoë")
    assert m.normalize_name.cache_info().currsize == 2
    m.normalize_name.cache_clear()
    assert m.normalize_name.cache_info().currsize == 0


# Add your own changed case below. Keep this file when switching targets.
