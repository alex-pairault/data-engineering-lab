"""Reference implementation. Read only after an attempt; not learner evidence."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Customer:
    customer_id: int
    name: str


def make_customer(customer_id, name):
    if type(customer_id) is not int or customer_id <= 0:
        raise ValueError("positive integer ID required")
    if not isinstance(name, str) or not name.strip():
        raise ValueError("nonblank name required")
    return Customer(customer_id, name.strip())
