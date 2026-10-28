"""Copy only the public app and lesson assets into the static hosting directory."""

from pathlib import Path
import shutil
from zipfile import ZipFile, ZIP_DEFLATED, ZipInfo
import hashlib

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"


def build():
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    shutil.copy2(ROOT / "index.html", DIST / "index.html")
    for name in ("assets", "lessons", "reference"):
        shutil.copytree(
            ROOT / name,
            DIST / name,
            ignore=shutil.ignore_patterns(
                "__pycache__",
                "*.pyc",
                "*.pyo",
                "*.duckdb*",
                "*.sqlite*",
                "*.db",
                "profiles.yml",
                ".venv",
                "logs",
                "target",
            ),
        )
    # New HTML must not silently reuse an older cached stylesheet.
    style_revision = hashlib.sha256(
        (DIST / "assets/styles.css").read_bytes()
    ).hexdigest()[:12]
    for page in DIST.rglob("*.html"):
        page.write_text(
            page.read_text().replace(
                'assets/styles.css"', f'assets/styles.css?v={style_revision}"'
            )
        )
    # Self-contained download bundles contain only the prepared public source.
    for project in ("dbt-lab", "airflow-lab", "stack"):
        folder = DIST / "assets/course-exercises" / project
        with ZipFile(
            folder.with_suffix(".zip"), "w", compression=ZIP_DEFLATED
        ) as archive:
            for path in sorted(folder.rglob("*")):
                if path.is_file():
                    entry = ZipInfo(
                        str(path.relative_to(folder)), date_time=(1980, 1, 1, 0, 0, 0)
                    )
                    entry.compress_type = ZIP_DEFLATED
                    entry.external_attr = 0o644 << 16
                    archive.writestr(entry, path.read_bytes())
    print(
        f"Static app built in {DIST}. Private notes and repository metadata excluded."
    )


if __name__ == "__main__":
    build()
