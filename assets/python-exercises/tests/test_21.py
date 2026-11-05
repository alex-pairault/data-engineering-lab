import pandas as pd
import pytest


def test_customer_grain(m):
    customers = pd.DataFrame({"customer_id": [3, 1, 2]})
    orders = pd.DataFrame(
        {
            "customer_id": [1, 1, 2],
            "status": ["paid", "paid", "pending"],
            "amount_cents": [3, 7, 99],
        }
    )
    result = m.paid_summary(customers, orders)
    assert result.to_dict("records") == [
        {"customer_id": 3, "paid_total": 0},
        {"customer_id": 1, "paid_total": 10},
        {"customer_id": 2, "paid_total": 0},
    ]
    with pytest.raises(pd.errors.MergeError):
        m.paid_summary(pd.DataFrame({"customer_id": [1, 1]}), orders)


def test_exact_large_cents(m):
    customers = pd.DataFrame({"customer_id": [1, 2]})
    orders = pd.DataFrame(
        {"customer_id": [1], "status": ["paid"], "amount_cents": [9007199254740993]}
    )
    assert m.paid_summary(customers, orders).to_dict("records") == [
        {"customer_id": 1, "paid_total": 9007199254740993},
        {"customer_id": 2, "paid_total": 0},
    ]


# Add your own changed case below. Keep this file when switching targets.
