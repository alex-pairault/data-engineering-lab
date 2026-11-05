"""Tutor reference; not learner-authored evidence."""


def prefix_copy(values, k):
    if not 0 <= k <= len(values):
        raise ValueError("prefix length out of bounds")
    return values[:k]
