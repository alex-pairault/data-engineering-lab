"""Reference implementation. Read only after an attempt; not learner evidence."""


def fetch_total(client):
    response = client.get("/total", timeout=2.0)
    response.raise_for_status()
    payload = response.json()
    value = payload.get("total_cents") if isinstance(payload, dict) else None
    if type(value) is not int or value < 0:
        raise ValueError("nonnegative total_cents integer required")
    return value
