"""Reference implementation. Read only after an attempt; not learner evidence."""


def append_tag(tag, tags=None):
    return [*(tags if tags is not None else []), tag]
