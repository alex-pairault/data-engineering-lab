"""Reference implementation. Read only after an attempt; not learner evidence."""

from pydantic import BaseModel


class PublicCustomer(BaseModel):
    customer_id: int
    name: str


def public_customer(raw):
    return PublicCustomer(customer_id=raw["customer_id"], name=raw["name"]).model_dump()
