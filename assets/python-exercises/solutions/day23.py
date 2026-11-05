"""Reference implementation. Read only after an attempt; not learner evidence."""

from functools import lru_cache


@lru_cache(maxsize=2)
def normalize_name(name):
    return name.strip().lower()
