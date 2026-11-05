"""Reference implementation. Read only after an attempt; not learner evidence."""


def unique_ids(ids):
    seen = set()
    result = []
    for item in ids:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result
