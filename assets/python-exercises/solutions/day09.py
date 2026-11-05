"""Reference implementation. Read only after an attempt; not learner evidence."""

import json


def read_jsonl(path):
    with open(path, encoding="utf-8") as handle:
        for line in handle:
            if line.strip():
                row = json.loads(line)
                if not isinstance(row, dict):
                    raise ValueError("each row must be an object")
                yield row
