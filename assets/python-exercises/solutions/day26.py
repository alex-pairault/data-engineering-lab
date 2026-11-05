"""Reference implementation. Read only after an attempt; not learner evidence."""

import asyncio
from itertools import islice


async def bounded_fetch(ids, fetch):
    items = list(islice(ids, 21))
    if len(items) > 20:
        raise ValueError("at most 20 IDs in this exercise")
    semaphore = asyncio.Semaphore(2)

    async def guarded(item):
        async with semaphore:
            return await fetch(item)

    async with asyncio.TaskGroup() as group:
        tasks = [group.create_task(guarded(item)) for item in items]
    return [task.result() for task in tasks]
