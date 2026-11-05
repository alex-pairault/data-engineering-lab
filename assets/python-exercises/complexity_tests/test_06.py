from complexity_support import CountedOrders


def test_output_and_single_order_pass(m):
    rows = [
        {"customer_id": 1, "status": "paid", "amount_cents": 3},
        {"customer_id": 1, "status": "paid", "amount_cents": 7},
        {"customer_id": 2, "status": "pending", "amount_cents": 99},
    ]
    orders = CountedOrders(rows)
    assert m.indexed_totals([1, 2, 3], orders) == {1: 10, 2: 0, 3: 0}
    assert orders.visits == len(rows)
    for size in (8, 32):
        orders = CountedOrders(
            [{"customer_id": i, "status": "paid", "amount_cents": 1} for i in range(size)]
        )
        assert m.indexed_totals(range(size), orders) == {i: 1 for i in range(size)}
        assert orders.visits == size
        assert orders.field_reads <= 4 * size
    assert m.indexed_totals([1], []) == {1: 0}


# Add your own changed case below.
