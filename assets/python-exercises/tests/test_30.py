from fastapi.testclient import TestClient


def test_quote_contract(m):
    with TestClient(m.build_app()) as client:
        assert client.post("/quote", json={"subtotal_cents": 0}).json() == {"total_cents": 500}
        response = client.post("/quote", json={"subtotal_cents": 1200})
        assert response.status_code == 200 and response.json() == {"total_cents": 1700}
        for bad in [
            {"subtotal_cents": -1},
            {"subtotal_cents": "3"},
            {"subtotal_cents": 3, "secret": "x"},
        ]:
            assert client.post("/quote", json=bad).status_code == 422


# Add your own changed case below. Keep this file when switching targets.
