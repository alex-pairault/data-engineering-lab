import pytest
from pydantic import ValidationError


def test_replays_and_invalid_pending(m):
    row = {"order_id": 1, "amount_cents": 7, "status": "paid"}
    assert (
        m.ingest_total([row, dict(row), {"order_id": 2, "amount_cents": 8, "status": "pending"}])
        == 7
    )
    assert m.ingest_total([]) == 0
    with pytest.raises(ValueError, match="conflicting"):
        m.ingest_total([row, {**row, "amount_cents": 9}])
    with pytest.raises(ValidationError):
        m.ingest_total([{"order_id": 2, "amount_cents": -1, "status": "pending"}])


# Add your own changed case below. Keep this file when switching targets.
