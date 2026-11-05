"""Tutor reference; not learner-authored evidence."""


def pair_visits(n, m):
    count = 0
    for _ in range(n):
        for _ in range(m):
            count += 1
    return count


def separate_visits(n):
    count = 0
    for _ in range(n):
        count += 1
    for _ in range(n):
        count += 1
    return count
