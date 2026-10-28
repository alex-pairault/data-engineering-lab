"""Trace one real loopback service. Python 3.10+, standard library only.

Run: python service_probe.py
Uses an OS-selected port, no external network, and stops only its own child.
"""
import argparse
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
import subprocess
import sys
from urllib.error import HTTPError
from urllib.request import build_opener, ProxyHandler


def serve():
    label = os.environ.get("FIELDNOTES_LABEL", "unset")  # captured at startup

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            status = 200 if self.path == "/health" else 404
            payload = {"label": label} if status == 200 else {"error": "route_not_found"}
            body = json.dumps(payload).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *_args):
            pass

    server = HTTPServer(("127.0.0.1", 0), Handler)
    print(json.dumps({"pid": os.getpid(), "address": "127.0.0.1", "port": server.server_port}), flush=True)
    server.serve_forever()


def probe():
    environment = {**os.environ, "FIELDNOTES_LABEL": "startup-value"}
    child = subprocess.Popen([sys.executable, "-u", __file__, "--serve"], env=environment,
                             stdout=subprocess.PIPE, text=True)
    try:
        identity = json.loads(child.stdout.readline())
        # Editing the parent's dictionary does not reconfigure the running child.
        environment["FIELDNOTES_LABEL"] = "changed-later"
        opener = build_opener(ProxyHandler({}))
        observations = []
        for route in ["/health", "/missing"]:
            try:
                response = opener.open(f"http://127.0.0.1:{identity['port']}{route}", timeout=3)
            except HTTPError as error:
                response = error  # an HTTP error still proves an HTTP responder
            with response:
                observations.append({"route": route, "status": response.code,
                                     "body": json.loads(response.read())})
        return {"service": identity, "parent_configuration_now": environment["FIELDNOTES_LABEL"],
                "responses": observations}
    finally:
        child.terminate()
        child.wait(timeout=5)
        child.stdout.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--serve", action="store_true", help=argparse.SUPPRESS)
    if parser.parse_args().serve:
        serve()
    else:
        print(json.dumps(probe(), indent=2))
