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

assert len(list((ROOT / "lessons").glob("*.html"))) == 5
assert (ROOT / "reference/0001-request-identity-state.html").is_file()
fixture = json.loads((ROOT / "assets/fixtures/product.json").read_text())
assert fixture["product_id"] == "P-41" and fixture["price"] == 25
print(f"Public build passed: {len(files)} files; internal HTML links resolve; private paths excluded.")
