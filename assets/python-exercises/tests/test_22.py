def test_repository_boundary(m):
    class Fake:
        def __init__(self):
            self.calls = []

        def for_customer(self, customer_id):
            self.calls.append(customer_id)
            return [
                {"status": "paid", "amount_cents": 3},
                {"status": "pending", "amount_cents": 10},
            ]

    fake = Fake()
    assert m.customer_total(fake, 17) == 3
    assert fake.calls == [17]


# Add your own changed case below. Keep this file when switching targets.
