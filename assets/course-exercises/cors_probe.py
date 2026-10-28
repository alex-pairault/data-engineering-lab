"""Two real loopback origins for lesson 16. Run: python cors_probe.py

Open the printed page URL. Click both buttons and inspect page + terminal.
Ctrl+C stops only these servers. No files, cookies, credentials or outside calls.
"""

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import threading


def run():
    observations = {}
    page_origin = ""

    class API(BaseHTTPRequestHandler):
        def do_GET(self):
            observations[self.path] = observations.get(self.path, 0) + 1
            body = json.dumps({"requests_seen": observations}).encode()
            self.send_response(200)
            if self.path == "/allowed":
                self.send_header("Access-Control-Allow-Origin", page_origin)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            print("API received", self.path, flush=True)

        def log_message(self, *_):
            pass

    api = ThreadingHTTPServer(("127.0.0.1", 0), API)
    api_origin = f"http://127.0.0.1:{api.server_port}"

    class Page(BaseHTTPRequestHandler):
        def do_GET(self):
            html = """<!doctype html><html lang="en"><meta charset="utf-8"><title>Fieldnotes: two origins</title><style>body{font:18px system-ui;max-width:850px;margin:50px auto;padding:20px}button{font:inherit;padding:12px;margin:10px}pre{white-space:pre-wrap}</style><h1>One request, two different boundaries</h1><p>Predict whether the API receives the request and whether this page can read its response.</p><button id="blocked">GET without CORS permission</button><button id="allowed">GET with explicit CORS permission</button><pre id="result" role="status">No request yet.</pre><p>The terminal independently records requests reaching the API. Neither route authenticates a user.</p><script>for(const id of ['blocked','allowed'])document.getElementById(id).onclick=async()=>{try{const response=await fetch(__API_ORIGIN__+'/'+id);document.getElementById('result').textContent=id+': readable response '+JSON.stringify(await response.json());}catch(error){document.getElementById('result').textContent=id+': browser could not expose the response. Check the API terminal.';}};</script></html>""".replace(
                "__API_ORIGIN__", json.dumps(api_origin)
            )
            body = html.encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *_):
            pass

    page = ThreadingHTTPServer(("127.0.0.1", 0), Page)
    page_origin = f"http://127.0.0.1:{page.server_port}"
    for server in [api, page]:
        threading.Thread(target=server.serve_forever, daemon=True).start()
    print(json.dumps({"page": page_origin, "api": api_origin}), flush=True)
    try:
        threading.Event().wait()
    except KeyboardInterrupt:
        pass
    finally:
        for server in [api, page]:
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    run()
