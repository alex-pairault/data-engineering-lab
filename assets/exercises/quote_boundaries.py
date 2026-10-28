"""Small request/domain/storage example. Run: python quote_boundaries.py

A synthetic 10% discount, rounded down to whole cents. No external services.
Change the rule in quote_total, then update the behavioural expectations.
"""
import json


def quote_total(amount_cents):
    """Domain invariant also applies to calls from jobs, not only HTTP."""
    if type(amount_cents) is not int or not 0 <= amount_cents <= 1000000:
        raise ValueError("amount_cents must be an integer from 0 to 1000000")
    return amount_cents - amount_cents // 10


class MemoryQuotes:
    def __init__(self):
        self.saved = []

    def save(self, total):
        self.saved.append(total)


def create_quote(amount, repository):
    """Application orchestration: apply rule, then persist the valid result."""
    total = quote_total(amount)
    repository.save(total)
    return total


def http_adapter(body, repository):
    try:
        request = json.loads(body)
        if not isinstance(request, dict):
            raise ValueError("JSON object required")
        return {"status": 200, "total": create_quote(request.get("amount_cents"), repository)}
    except (ValueError, TypeError):
        return {"status": 400, "error": "invalid_amount"}


def run_demo():
    repository = MemoryQuotes()
    http = http_adapter('{"amount_cents": 10000}', repository)
    job = create_quote(10000, repository)
    before = len(repository.saved)
    invalid_http = http_adapter('{"amount_cents": -1}', repository)
    try:
        create_quote(-1, repository)
    except ValueError:
        invalid_job = "rejected"
    assert http["total"] == job == 9000
    assert len(repository.saved) == before  # failed operations never reach storage
    return {"http": http, "job_total": job, "invalid_http": invalid_http,
            "invalid_job": invalid_job, "saved": repository.saved}


if __name__ == "__main__":
    print(json.dumps(run_demo(), indent=2))
