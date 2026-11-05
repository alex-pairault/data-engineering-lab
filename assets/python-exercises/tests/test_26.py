import asyncio
import pytest


def test_async_bound_and_failure(m):
    async def scenario():
        active = peak = 0

        async def fetch(value):
            nonlocal active, peak
            active += 1
            peak = max(peak, active)
            try:
                await asyncio.sleep(0)
                if value < 0:
                    raise ValueError("injected")
                return value * 2
            finally:
                active -= 1

        assert await m.bounded_fetch([3, 1, 2], fetch) == [6, 2, 4]
        assert peak <= 2 and active == 0
        with pytest.raises(ExceptionGroup):
            await m.bounded_fetch([1, -1, 2, 3], fetch)
        assert active == 0
        with pytest.raises(ValueError):
            await m.bounded_fetch(range(21), fetch)

    asyncio.run(scenario())


# Add your own changed case below. Keep this file when switching targets.
