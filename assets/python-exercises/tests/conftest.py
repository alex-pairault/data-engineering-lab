"""The same behavioural tests can target learner code or reference implementations."""

import importlib
from pathlib import Path
import sys
import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def pytest_addoption(parser):
    parser.addoption("--target", choices=["exercises", "solutions"], default="exercises")


@pytest.fixture
def m(request):
    day = request.path.stem.removeprefix("test_")
    return importlib.import_module(f"{request.config.getoption('--target')}.day{day}")
