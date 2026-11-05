import httpx
import pytest


def test_retry_budget(m):
    request = httpx.Request("GET", "https://exercise.invalid/total")
    statuses = iter([503, 200])
    calls = []

    def get():
        calls.append(1)
        return httpx.Response(next(statuses), request=request)

    assert m.retry_get(get).status_code == 200 and len(calls) == 2
    calls.clear()

    def failed():
        calls.append(1)
        return httpx.Response(503, request=request)

    with pytest.raises(httpx.HTTPStatusError):
        m.retry_get(failed)
    assert len(calls) == 2
    calls.clear()

    def timeout():
        calls.append(1)
        raise httpx.ReadTimeout("injected", request=request)

    with pytest.raises(httpx.ReadTimeout):
        m.retry_get(timeout)
    assert len(calls) == 1


# Add your own changed case below. Keep this file when switching targets.
