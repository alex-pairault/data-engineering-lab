"""Reference implementation. Read only after an attempt; not learner evidence."""


def with_tag(record, tag):
    return {**record, "tags": [*record["tags"], tag]}
