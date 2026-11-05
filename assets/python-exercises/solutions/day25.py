"""Reference implementation. Read only after an attempt; not learner evidence."""

from concurrent.futures import ThreadPoolExecutor


def fetch_all(ids, fetch):
    with ThreadPoolExecutor(max_workers=2) as pool:
        return list(pool.map(fetch, ids))
