"""Correct results, intentionally repeated list scans: expose the growing work."""


def has_duplicate(ids):
    seen = []
    for item in ids:
        if item in seen:
            return True
        seen.append(item)
    return False
