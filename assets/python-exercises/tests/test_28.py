import pytest


def test_untrusted_limits(m):
    assert m.read_limits('{"batch":25}') == 25
    for bad in ['{"batch":true}', '{"batch":0}', '{"batch":2,"extra":3}', "[2]", "sum([1,2])"]:
        with pytest.raises(ValueError):
            m.read_limits(bad)


# Add your own changed case below. Keep this file when switching targets.
