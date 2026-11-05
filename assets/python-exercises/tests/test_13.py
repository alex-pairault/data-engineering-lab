from pydantic import ValidationError
import pytest


def test_strict_boundary(m):
    assert m.parse_order({"order_id": 1, "amount_cents": 0}).amount_cents == 0
    for bad in [
        {"order_id": 1, "amount_cents": "4"},
        {"order_id": True, "amount_cents": 4},
        {"order_id": 1, "amount_cents": -1},
        {"order_id": 1, "amount_cents": 4, "owner": 2},
    ]:
        with pytest.raises(ValidationError):
            m.parse_order(bad)


# Add your own changed case below. Keep this file when switching targets.
