import pytest


def test_cli_boundaries(m):
    args = m.parse_args(["--input", "rows.jsonl"])
    assert args.input == "rows.jsonl" and args.batch == 100
    assert m.parse_args(["--input", "x", "--batch", "1"]).batch == 1
    for argv in [
        [],
        ["--input", "x", "--batch", "0"],
        ["--input", "x", "--batch", "1001"],
        ["--input", "x", "--batch", "oops"],
    ]:
        with pytest.raises(SystemExit):
            m.parse_args(argv)


# Add your own changed case below. Keep this file when switching targets.
