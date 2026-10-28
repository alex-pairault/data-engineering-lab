"""Check the public build boundary and internal HTML links using the standard library."""
from html.parser import HTMLParser
import json
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
    parser.feed(path.read_text())
    for target in parser.targets:
        url = urlsplit(target)
        if url.scheme or url.netloc or not url.path:
            continue
        linked = (path.parent / unquote(url.path)).resolve()
        assert linked.is_relative_to(ROOT.resolve()), (relative, target)
        assert linked.is_file(), (relative, target)

assert len(list((ROOT / "lessons").glob("*.html"))) == 15
assert (ROOT / "reference/0001-request-identity-state.html").is_file()
assert (ROOT / "reference/0002-contracts-resources-data.html").is_file()
assert (ROOT / "assets/exercises/profile_records.py").is_file()
assert (ROOT / "assets/exercises/sql_join_lab.py").is_file()
assert (ROOT / "assets/fixtures/join-data.json").is_file()
for name in ["service_probe.py", "quote_boundaries.py", "git_conflict_lab.py", "docker_counter.py", "Dockerfile", "docker-lesson.txt", "sql_grain_lab.py"]:
    assert (ROOT / "assets/exercises" / name).is_file(), name
assert (ROOT / "assets/fixtures/grain-data.json").is_file()
assert (ROOT / "reference/0003-runtime-code-data.html").is_file()
fixture = json.loads((ROOT / "assets/fixtures/product.json").read_text())
assert fixture["product_id"] == "P-41" and fixture["price"] == 25
print(f"Public build passed: {len(files)} files; internal HTML links resolve; private paths excluded.")
