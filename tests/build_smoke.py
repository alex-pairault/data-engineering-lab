"""Check the public build boundary and internal HTML links using the standard library."""
from html.parser import HTMLParser
import json
import hashlib
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent / "dist"


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.targets = []

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in {"href", "src"} and value:
                self.targets.append(value)


assert (ROOT / "index.html").is_file(), "Build the app first"
files = [path for path in ROOT.rglob("*") if path.is_file()]
for path in files:
    relative = path.relative_to(ROOT)
    assert relative.parts[0] in {"index.html", "assets", "lessons", "reference"}, relative
    assert not any(part.startswith(".") for part in relative.parts), relative
    assert "__pycache__" not in relative.parts and path.suffix not in {".pyc", ".pyo"}, relative
    if path.suffix != ".html":
        continue
    parser = Links()
    page_text = path.read_text()
    style_revision = hashlib.sha256((ROOT / "assets/styles.css").read_bytes()).hexdigest()[:12]
    assert f"assets/styles.css?v={style_revision}" in page_text, relative
    parser.feed(page_text)
    for target in parser.targets:
        url = urlsplit(target)
        if url.scheme or url.netloc or not url.path:
            continue
        linked = (path.parent / unquote(url.path)).resolve()
        assert linked.is_relative_to(ROOT.resolve()), (relative, target)
        assert linked.is_file(), (relative, target)

assert len(list((ROOT / "lessons").glob("*.html"))) == 37
assert (ROOT / "reference/0001-request-identity-state.html").is_file()
assert (ROOT / "reference/0002-contracts-resources-data.html").is_file()
assert (ROOT / "assets/exercises/profile_records.py").is_file()
assert (ROOT / "assets/exercises/sql_join_lab.py").is_file()
assert (ROOT / "assets/fixtures/join-data.json").is_file()
for name in ["service_probe.py", "quote_boundaries.py", "git_conflict_lab.py", "docker_counter.py", "Dockerfile", "docker-lesson.txt", "sql_grain_lab.py"]:
    assert (ROOT / "assets/exercises" / name).is_file(), name
assert (ROOT / "assets/fixtures/grain-data.json").is_file()
assert (ROOT / "reference/0003-runtime-code-data.html").is_file()
from zipfile import ZipFile
for project in ["dbt-lab", "airflow-lab", "stack"]:
    with ZipFile(ROOT / f"assets/course-exercises/{project}.zip") as archive:
        assert "SETUP.txt" in archive.namelist()
        assert all(not Path(name).is_absolute() and ".." not in Path(name).parts for name in archive.namelist())
        assert not any(name.endswith((".db", ".duckdb", ".pyc")) or "profiles.yml" in name for name in archive.namelist())
for reference in ["0004-web-reliability.html", "0005-data-delivery.html"]:
    assert (ROOT / "reference" / reference).is_file()
fixture = json.loads((ROOT / "assets/fixtures/product.json").read_text())
assert fixture["product_id"] == "P-41" and fixture["price"] == 25
print(f"Public build passed: {len(files)} files; internal HTML links resolve; private paths excluded.")
