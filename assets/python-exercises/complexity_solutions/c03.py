"""Tutor reference; not learner-authored evidence."""


def binary_index(values, target):
    low, high = 0, len(values) - 1
    while low <= high:
        mid = (low + high) // 2
        value = values[mid]
        if value == target:
            return mid
        if value < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
