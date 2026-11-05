"""Reference implementation. Read only after an attempt; not learner evidence."""


def retry_get(get):
    for attempt in range(2):
        response = get()
        if response.status_code == 503 and attempt == 0:
            continue
        response.raise_for_status()
        return response
