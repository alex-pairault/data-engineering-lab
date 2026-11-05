import pytest


def test_utf8_and_bad_rows(m, tmp_path):
    path = tmp_path / "rows.jsonl"
    path.write_text('{"name":"Zoë"}\n\n{"id":2}\n', encoding="utf-8")
    assert list(m.read_jsonl(path)) == [{"name": "Zoë"}, {"id": 2}]
    path.write_text('{"id":1}\n{broken\n', encoding="utf-8")
    assert next(m.read_jsonl(path)) == {"id": 1}
    with pytest.raises(ValueError):
        list(m.read_jsonl(path))
    path.write_text("[]\n", encoding="utf-8")
    with pytest.raises(ValueError):
        list(m.read_jsonl(path))


def test_explicit_early_generator_close(m, tmp_path):
    from contextlib import closing

    path = tmp_path / "rows.jsonl"
    path.write_text('{"id":1}\n{"id":2}\n', encoding="utf-8")
    with closing(m.read_jsonl(path)) as rows:
        assert next(rows) == {"id": 1}
        assert rows.gi_frame is not None
    assert rows.gi_frame is None


# Add your own changed case below. Keep this file when switching targets.
