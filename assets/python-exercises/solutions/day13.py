"""Reference implementation. Read only after an attempt; not learner evidence."""

from pydantic import BaseModel, ConfigDict, Field


class Order(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    order_id: int = Field(gt=0)
    amount_cents: int = Field(ge=0)


def parse_order(payload):
    return Order.model_validate(payload)
