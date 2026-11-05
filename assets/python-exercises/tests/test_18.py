import httpx
import pytest


def test_http_boundaries(m):
    def run(response):
        def handler(request):
            assert request.method == "GET"
            assert request.url.path == "/total"
            assert request.extensions["timeout"]["read"] == 2.0
            return response

        with httpx.Client(
            base_url="https://exercise.invalid", transport=httpx.MockTransport(handler)
        ) as client:
            return m.fetch_total(client)

    assert run(httpx.Response(200, json={"total_cents": 0})) == 0
    with pytest.raises(httpx.HTTPStatusError):
        run(httpx.Response(500, json={"error": "failed"}))
    for value in ["3", True, -1]:
        with pytest.raises(ValueError):
            run(httpx.Response(200, json={"total_cents": value}))
    with pytest.raises(ValueError):
        run(httpx.Response(200, content=b"broken"))


# Add your own changed case below. Keep this file when switching targets.
