"""Reference implementation. Read only after an attempt; not learner evidence."""


def has_type_alias_syntax(version):
    return version[0] == 3 and version[1] >= 12
