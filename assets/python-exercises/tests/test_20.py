import pytest
from sqlalchemy import create_engine, text


def test_transfer_rollback(m):
    engine = create_engine("sqlite://", connect_args={"autocommit": False})
    try:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "CREATE TABLE accounts(id INTEGER PRIMARY KEY, balance INTEGER NOT NULL CHECK(balance>=0))"
                )
            )
            connection.execute(text("INSERT INTO accounts VALUES (1,100),(2,0)"))
        m.transfer(engine, 1, 2, 30)
        with engine.connect() as connection:
            assert connection.execute(
                text("SELECT balance FROM accounts ORDER BY id")
            ).scalars().all() == [70, 30]
        with pytest.raises(ValueError):
            m.transfer(engine, 1, 999, 20)
        with pytest.raises(ValueError):
            m.transfer(engine, 1, 2, 100)
        with engine.connect() as connection:
            assert connection.execute(
                text("SELECT balance FROM accounts ORDER BY id")
            ).scalars().all() == [70, 30]
    finally:
        engine.dispose()


# Add your own changed case below. Keep this file when switching targets.
