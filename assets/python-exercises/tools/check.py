"""Run one session's real Python tests. No network or progress upload."""

import argparse
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("session", type=int, choices=range(1, 31), metavar="01..30")
    parser.add_argument("--complexity", action="store_true", help="Use complexity sessions 01..08")
    parser.add_argument(
        "--reference", action="store_true", help="Run reference code after your own attempt"
    )
    args = parser.parse_args()
    if args.complexity and args.session > 8:
        parser.error("complexity sessions are 01..08")
    folder = "complexity_tests" if args.complexity else "tests"
    target = "solutions" if args.reference else "exercises"
    if args.complexity:
        target = f"complexity_{target}"
    command = [
        sys.executable,
        "-m",
        "pytest",
        f"{folder}/test_{args.session:02d}.py",
        "-q",
        "--target",
        target,
    ]
    print(f"Python {sys.version.split()[0]} · {sys.executable}", flush=True)
    print(
        "Reference code is tutor scaffolding, not evidence of independent practice."
        if args.reference
        else "Testing your exercise file. Add your own changed case too.",
        flush=True,
    )
    return subprocess.run(command, cwd=ROOT, check=False).returncode


if __name__ == "__main__":
    raise SystemExit(main())
