import pytest


def test_money_rounding(m):
    assert m.to_cents("0.10") == 10
    assert m.to_cents("1.005") == 101
    assert m.to_cents("0") == 0
    for bad in ["-1", "NaN", "Infinity", "not-money"]:
        with pytest.raises(ValueError):
            m.to_cents(bad)


# Add your own changed case below. Keep this file when switching targets.
