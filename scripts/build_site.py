"""Copy only the public app and lesson assets into the static hosting directory."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"

def build():
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    shutil.copy2(ROOT / "index.html", DIST / "index.html")
    for name in ("assets", "lessons", "reference"):
        shutil.copytree(ROOT / name, DIST / name,
                        ignore=shutil.ignore_patterns("__pycache__", "*.pyc", "*.pyo"))
    print(f"Static app built in {DIST}. Private notes and repository metadata excluded.")

if __name__ == "__main__":
    build()
