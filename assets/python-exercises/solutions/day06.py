"""Reference implementation. Read only after an attempt; not learner evidence."""


def parse_cents(text):
    if not isinstance(text, str) or not text or any(c not in "0123456789" for c in text):
        raise ValueError("amount must contain ASCII digits")
    return int(text)
