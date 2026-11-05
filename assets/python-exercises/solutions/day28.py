"""Reference implementation. Read only after an attempt; not learner evidence."""

import json


def read_limits(text):
    payload = json.loads(text)
    if not isinstance(payload, dict) or set(payload) != {"batch"}:
        raise ValueError("only batch is allowed")
    batch = payload["batch"]
    if type(batch) is not int or not 1 <= batch <= 1000:
        raise ValueError("batch must be an integer from 1 to 1000")
    return batch
