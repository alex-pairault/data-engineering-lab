"""Tutor reference; not learner-authored evidence."""


def has_duplicate(ids):
    seen = set()
    for item in ids:
        if item in seen:
            return True
        seen.add(item)
    return False
