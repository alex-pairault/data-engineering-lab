"""Reference implementation. Read only after an attempt; not learner evidence."""

from typing import Literal
from pydantic import BaseModel, ConfigDict, Field


class Order(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    order_id: int = Field(gt=0)
    amount_cents: int = Field(ge=0)
    status: Literal["paid", "pending"]


def ingest_total(rows):
    seen = {}
    for raw in rows:
        row = Order.model_validate(raw)
        value = row.model_dump()
        if row.order_id in seen and seen[row.order_id] != value:
            raise ValueError("conflicting replay")
        seen[row.order_id] = value
    return sum(row["amount_cents"] for row in seen.values() if row["status"] == "paid")
