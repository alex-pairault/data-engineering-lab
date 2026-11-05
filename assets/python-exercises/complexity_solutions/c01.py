"""Tutor reference; not learner-authored evidence."""


def first_or_none(values):
    return values[0] if len(values) else None


def scan_total(values):
    total = 0
    for value in values:
        total += value
    return total
