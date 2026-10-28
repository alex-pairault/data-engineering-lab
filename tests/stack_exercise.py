"""Optional real Compose/Nginx QA: python tests/stack_exercise.py.

Only unique disposable resources created by this test are stopped or removed.
"""

from pathlib import Path
import json
import argparse
import ipaddress
import shutil
import subprocess
import tempfile
import time
from urllib.error import HTTPError
from urllib.request import build_opener, ProxyHandler, Request
import uuid

ROOT = Path(__file__).resolve().parent.parent


def run(subnet=None):
    if subnet:
        candidate = ipaddress.ip_network(subnet, strict=True)
        if (
            candidate.version != 4
            or not candidate.is_private
            or candidate.prefixlen != 28
        ):
            raise ValueError("Use an unused private IPv4 /28 for this bounded test.")
        ids = subprocess.check_output(
            ["docker", "network", "ls", "-q"], text=True
        ).split()
        networks = json.loads(
            subprocess.check_output(["docker", "network", "inspect", *ids], text=True)
        )
        occupied = [
            c["Subnet"]
            for n in networks
            for c in (n.get("IPAM", {}).get("Config") or [])
            if c.get("Subnet")
        ]
        routes = json.loads(
            subprocess.check_output(["ip", "-j", "-4", "route"], text=True)
        )
        occupied += [r["dst"] for r in routes if r.get("dst") and r["dst"] != "default"]
        if any(
            candidate.overlaps(ipaddress.ip_network(value))
            for value in occupied
            if ":" not in value
        ):
            raise ValueError(
                "Requested QA subnet overlaps an existing network or host route."
            )
    project = "fieldnotes-final-qa-" + uuid.uuid4().hex[:8]
    opener = build_opener(ProxyHandler({}))
    with tempfile.TemporaryDirectory() as directory:
        folder = Path(directory)
        shutil.copytree(
            ROOT / "assets/course-exercises/stack", folder, dirs_exist_ok=True
        )
        compose = folder / "compose.yaml"
        compose.write_text(
            compose.read_text().replace("127.0.0.1:18080:8080", "127.0.0.1::8080")
        )
        if subnet:
            with compose.open("a") as output:
                output.write(
                    "\nnetworks:\n  default:\n    ipam:\n      config:\n        - subnet: "
                    + str(candidate)
                    + "\n"
                )

        def command(*args):
            result = subprocess.run(
                ["docker", "compose", "-f", str(compose), "-p", project, *args],
                capture_output=True,
                text=True,
            )
            if result.returncode:
                raise RuntimeError(result.stderr)
            return result.stdout.strip()

        def request(url, method="GET"):
            deadline = time.monotonic() + 12
            while True:
                try:
                    with opener.open(
                        Request(url, method=method), timeout=3
                    ) as response:
                        return response.status, json.loads(response.read())
                except HTTPError as error:
                    return error.code, None
                except OSError:
                    if time.monotonic() >= deadline:
                        raise
                    time.sleep(0.1)

        try:
            command("up", "-d", "--build", "--wait")
            endpoint = command("port", "proxy", "8080")
            url = "http://" + endpoint + "/"
            assert request(url, "POST") == (200, {"count": 1})
            peer = json.loads(
                command("exec", "-T", "proxy", "wget", "-qO-", "http://app:8000/")
            )
            assert peer["count"] == 1
            command("stop", "app")
            failure = request(url)
            print("Stopped upstream response:", failure, flush=True)
            assert failure[0] in {502, 504}, failure
            command("up", "-d", "--wait", "app")
            command("restart", "proxy")
            url = "http://" + command("port", "proxy", "8080") + "/"
            assert request(url) == (200, {"count": 1})
            command("up", "-d", "--wait", "--force-recreate", "app")
            command("restart", "proxy")
            url = "http://" + command("port", "proxy", "8080") + "/"
            assert request(url) == (200, {"count": 1})
            print(
                f"PASS: proxy success; peer service DNS; upstream gateway failure {failure[0]}; recovery; volume retention after recreation."
            )
        finally:
            subprocess.run(
                [
                    "docker",
                    "compose",
                    "-f",
                    str(compose),
                    "-p",
                    project,
                    "down",
                    "--volumes",
                ],
                capture_output=True,
            )
            subprocess.run(
                ["docker", "image", "rm", project + "-app"], capture_output=True
            )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--subnet",
        help="Optional unused private /28 when default Docker pools are exhausted (Linux route validation).",
    )
    run(parser.parse_args().subnet)
