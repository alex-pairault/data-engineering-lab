from dataclasses import FrozenInstanceError
import pytest


def test_customer_contract(m):
    result = m.make_customer(2, " Mina ")
    assert (result.customer_id, result.name) == (2, "Mina")
    with pytest.raises(FrozenInstanceError):
        result.name = "Other"
    for bad in [True, 0, "2"]:
        with pytest.raises(ValueError):
            m.make_customer(bad, "Mina")
    with pytest.raises(ValueError):
        m.make_customer(2, " ")


# Add your own changed case below. Keep this file when switching targets.
