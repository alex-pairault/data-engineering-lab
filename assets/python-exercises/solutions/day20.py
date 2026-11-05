"""Reference implementation. Read only after an attempt; not learner evidence."""

from sqlalchemy import text


def transfer(engine, source, target, cents):
    if source == target or type(cents) is not int or cents <= 0:
        raise ValueError("distinct accounts and positive cents required")
    with engine.begin() as connection:
        debit = connection.execute(
            text("UPDATE accounts SET balance=balance-:cents WHERE id=:id AND balance>=:cents"),
            {"id": source, "cents": cents},
        )
        if debit.rowcount != 1:
            raise ValueError("source unavailable or insufficient funds")
        credit = connection.execute(
            text("UPDATE accounts SET balance=balance+:cents WHERE id=:id"),
            {"id": target, "cents": cents},
        )
        if credit.rowcount != 1:
            raise ValueError("target unavailable")
