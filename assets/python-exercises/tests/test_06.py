import pytest


def test_amount_contract(m):
    assert m.parse_cents("0") == 0
    assert m.parse_cents("013") == 13
    for bad in ["", "-2", " 2", "2.1", "²", None, True]:
        with pytest.raises(ValueError):
            m.parse_cents(bad)


# Add your own changed case below. Keep this file when switching targets.
