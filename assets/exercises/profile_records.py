"""Bounded CPU/memory lesson. Python 3.10+, standard library only.

Run: python profile_records.py > resource-report.json
Optional: --rows 10000 (between 1000 and 20000; also measures twice that size).
Files live in a temporary directory. No network or machine identifiers are used.
"""
import argparse
import json
from pathlib import Path
import platform
import subprocess
import sys
import tempfile
import time
import tracemalloc


def consume(path, mode):
    def records():
        with path.open(encoding="utf-8") as source:
            for line in source:
                identifier, amount, payload = line.rstrip("\n").split("|", 2)
                yield (int(identifier), int(amount), payload)
    rows = list(records()) if mode == "eager" else records()
    count = checksum = 0
    for _, amount, _ in rows:
        count += 1
        checksum += amount
    return count, checksum


def peak_rss():
    # ru_maxrss is a process lifetime high-water mark, not current RAM or Python allocations.
    try:
        import resource
        value = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        system = platform.system()
        return int(value * 1024) if system == "Linux" else int(value) if system == "Darwin" else None
    except ImportError:
        return None


def worker(path, mode, trace):
    if trace:
        tracemalloc.start()
        count, checksum = consume(path, mode)
        _, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()
        return {"count": count, "checksum": checksum, "traced_peak_bytes": peak}
    wall_start, cpu_start = time.perf_counter(), time.process_time()
    count, checksum = consume(path, mode)
    cpu, elapsed = time.process_time() - cpu_start, time.perf_counter() - wall_start
    return {"count": count, "checksum": checksum, "elapsed_s": elapsed,
            "cpu_s": cpu, "rss_peak_bytes": peak_rss()}


def measure(path, rows, mode):
    # Fresh processes avoid a previous case's RSS high-water mark affecting this case.
    command = [sys.executable, str(Path(__file__).resolve()), "--worker", str(path), "--mode", mode]
    timed = json.loads(subprocess.run(command, capture_output=True, text=True, check=True).stdout)
    traced = json.loads(subprocess.run(command + ["--trace"], capture_output=True, text=True, check=True).stdout)
    if (timed["count"], timed["checksum"]) != (traced["count"], traced["checksum"]):
        raise RuntimeError("Timed and traced runs produced different results.")
    return {"mode": mode, "rows": rows, **timed, "traced_peak_bytes": traced["traced_peak_bytes"]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rows", type=int, default=12000)
    parser.add_argument("--worker", type=Path, help=argparse.SUPPRESS)
    parser.add_argument("--mode", choices=["eager", "stream"], default="stream", help=argparse.SUPPRESS)
    parser.add_argument("--trace", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args()
    if args.worker:
        print(json.dumps(worker(args.worker, args.mode, args.trace)))
        return
    if not 1000 <= args.rows <= 20000:
        parser.error("--rows must be between 1000 and 20000; the second fixture is twice that size.")
    cases = []
    with tempfile.TemporaryDirectory(prefix="fieldnotes-resources-") as directory:
        for rows in [args.rows, args.rows * 2]:
            path = Path(directory) / f"records-{rows}.txt"
            # Fixed short records; fixture creation and interpreter startup are outside timings.
            with path.open("w", encoding="utf-8") as output:
                for index in range(rows):
                    output.write(f"{index}|{index % 97}|{'x' * 512}\n")
            for mode in ["eager", "stream"]:
                cases.append(measure(path, rows, mode))
    print(json.dumps({"kind": "fieldnotes-resource-report", "schema": 1,
                      "python_version": platform.python_version(), "cases": cases}, indent=2))


if __name__ == "__main__":
    main()
