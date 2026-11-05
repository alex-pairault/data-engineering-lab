"""Use identical checks against an attempt or its reference."""

import importlib
from pathlib import Path
import sys
import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def pytest_addoption(parser):
    parser.addoption(
        "--target",
        choices=["complexity_exercises", "complexity_solutions"],
        default="complexity_exercises",
    )


@pytest.fixture
def m(request):
    number = request.path.stem.removeprefix("test_")
    return importlib.import_module(f"{request.config.getoption('--target')}.c{number}")
