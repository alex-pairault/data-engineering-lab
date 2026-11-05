def test_lazy_filter(m):
    seen = []

    def source():
        seen.append(1)
        yield {"status": "paid", "id": 1}
        raise RuntimeError("read too far")

    stream = m.paid_rows(source())
    assert seen == []
    assert next(stream)["id"] == 1
    assert seen == [1]
    assert list(m.paid_rows([{"status": "pending"}])) == []


# Add your own changed case below. Keep this file when switching targets.
