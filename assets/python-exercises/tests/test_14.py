def test_public_allowlist(m):
    raw = {
        "customer_id": 1,
        "name": "Mina",
        "api_key": "synthetic-secret",
        "internal_note": "private",
    }
    assert m.public_customer(raw) == {"customer_id": 1, "name": "Mina"}
    assert raw["api_key"] == "synthetic-secret"


# Add your own changed case below. Keep this file when switching targets.
