"""Fresh-process eager/stream comparison. Traced Python allocations are not RSS."""

import argparse
import json
from pathlib import Path
import subprocess
import sys
import time
import tracemalloc

ROOT = Path(__file__).resolve()


def calculate(mode, size):
    values = (n * n for n in range(size))
    if mode == "eager":
        values = list(values)
    return sum(values)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sizes", type=int, nargs=2, default=[10000, 100000])
    parser.add_argument("--worker", choices=["eager", "stream"])
    parser.add_argument("--size", type=int)
    parser.add_argument("--trace", action="store_true")
    args = parser.parse_args()
    if args.worker:
        if args.size is None or not 1 <= args.size <= 1000000:
            parser.error("worker size must be 1..1000000")
        if args.trace:
            tracemalloc.start()
        wall = time.perf_counter()
        cpu = time.process_time()
        result = calculate(args.worker, args.size)
        cpu = time.process_time() - cpu
        wall = time.perf_counter() - wall
        peak = tracemalloc.get_traced_memory()[1] if args.trace else None
        if args.trace:
            tracemalloc.stop()
        print(
            json.dumps(
                dict(result=result, elapsed_seconds=wall, cpu_seconds=cpu, traced_peak_bytes=peak)
            )
        )
        return
    if any(not 1 <= n <= 1000000 for n in args.sizes) or args.sizes[0] >= args.sizes[1]:
        parser.error("provide two increasing sizes within 1..1000000")
    report = []
    for size in args.sizes:
        results = []
        for mode in ["eager", "stream"]:
            base = [sys.executable, str(ROOT), "--worker", mode, "--size", str(size)]
            timing = json.loads(subprocess.check_output(base, text=True))
            traced = json.loads(subprocess.check_output([*base, "--trace"], text=True))
            assert timing["result"] == traced["result"]
            results.append(timing["result"])
            report.append(
                dict(
                    mode=mode,
                    size=size,
                    result=timing["result"],
                    elapsed_seconds=timing["elapsed_seconds"],
                    cpu_seconds=timing["cpu_seconds"],
                    traced_peak_bytes=traced["traced_peak_bytes"],
                )
            )
        assert len(set(results)) == 1
    print(
        json.dumps(
            dict(
                measurement="agent or learner command run, not automatic course evidence",
                python=sys.version,
                notes="Fresh process per mode/size. Timing separate from tracing. Traced peak is not RSS.",
                cases=report,
            ),
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
