"""Reference implementation. Read only after an attempt; not learner evidence."""


def supports(version):
    return version[0] == 3 and version[1] >= 12
