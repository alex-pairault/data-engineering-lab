"""Reference implementation. Read only after an attempt; not learner evidence."""

from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict, Field


class QuoteRequest(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    subtotal_cents: int = Field(ge=0)


class QuoteResponse(BaseModel):
    total_cents: int


def build_app():
    app = FastAPI()

    @app.post("/quote", response_model=QuoteResponse)
    def quote(request: QuoteRequest):
        return QuoteResponse(total_cents=request.subtotal_cents + 500)

    return app
