"""Reference implementation. Read only after an attempt; not learner evidence."""

from typing import Protocol


class Orders(Protocol):
    def for_customer(self, customer_id: int) -> list[dict]: ...


def customer_total(repository: Orders, customer_id: int) -> int:
    return sum(
        row["amount_cents"]
        for row in repository.for_customer(customer_id)
        if row["status"] == "paid"
    )
