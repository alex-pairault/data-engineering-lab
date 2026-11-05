"""Reference implementation. Read only after an attempt; not learner evidence."""


def paid_rows(rows):
    for row in rows:
        if row["status"] == "paid":
            yield row
