"""Reference implementation. Read only after an attempt; not learner evidence."""

from decimal import Decimal, InvalidOperation, ROUND_HALF_UP


def to_cents(text):
    try:
        amount = Decimal(text)
        if not amount.is_finite() or amount < 0:
            raise ValueError("finite nonnegative amount required")
        return int(amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP) * 100)
    except InvalidOperation as error:
        raise ValueError("invalid decimal amount") from error
