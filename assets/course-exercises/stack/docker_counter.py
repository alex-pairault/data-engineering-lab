"""Single-process local teaching service; not a production web server.

GET reads a synthetic counter; POST increments it. No personal data.
Docker lesson stores it at /data/count.txt. Run in a disposable exercise container.
"""

from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
from pathlib import Path

DATA = Path(os.environ.get("FIELDNOTES_DATA", "/data"))


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.respond(False)

    def do_POST(self):
        self.respond(True)

    def respond(self, increment):
        if self.path != "/":
            self.send_error(404)
            return
        DATA.mkdir(parents=True, exist_ok=True)
        path = DATA / "count.txt"
        count = int(path.read_text()) if path.exists() else 0
        if increment:
            count += 1
            path.write_text(str(count))
        body = json.dumps({"count": count}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    HTTPServer(("0.0.0.0", 8000), Handler).serve_forever()
