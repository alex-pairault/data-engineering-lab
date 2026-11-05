"""Count selected operations in your real Python attempt. No timing or uploads."""

import argparse
import importlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from complexity_support import CountedSequence, CountedOrders, ComparisonValue, HashingValue


def observe(number, module, n):
    if number == 1:
        first = CountedSequence(range(n))
        total = CountedSequence(range(n))
        module.first_or_none(first)
        module.scan_total(total)
        return dict(first_item_reads=first.reads, scan_item_reads=total.reads)
    if number == 2:
        return dict(
            separate_body_visits=module.separate_visits(n),
            square_body_visits=module.pair_visits(n, n),
        )
    if number == 3:
        values = CountedSequence(range(n))
        index = module.binary_index(values, n)
        return dict(
            index=index,
            midpoint_item_reads=values.reads,
            copied_items=values.copied,
            probe_upper_bound=n.bit_length(),
        )
    if number == 4:
        values = CountedSequence(range(n))
        result = module.prefix_copy(values, n // 2)
        return dict(output_items=len(result), copied_items=values.copied)
    if number == 5:
        visited = []

        def source():
            for value in range(n):
                visited.append(value)
                yield value

        stream = module.iter_doubles(source())
        before = len(visited)
        next(stream)
        after = len(visited)
        close = getattr(stream, "close", None)
        if close:
            close()
        return dict(
            input_visits_before_request=before,
            input_visits_after_one_request=after,
            note="Laziness evidence, not a process-memory measurement",
        )
    if number == 6:
        orders = CountedOrders(
            [dict(customer_id=i, status="paid", amount_cents=1) for i in range(n)]
        )
        result = module.indexed_totals(range(n), orders)
        return dict(
            customer_outputs=len(result), order_visits=orders.visits, field_reads=orders.field_reads
        )
    if number == 7:
        counter = {"comparisons": 0}
        left = [ComparisonValue(i, counter) for i in range(0, n, 2)]
        right = [ComparisonValue(i, counter) for i in range(1, n, 2)]
        result = module.merge_sorted(left, right)
        return dict(output_items=len(result), head_comparisons=counter["comparisons"])
    counter = {"hashes": 0, "comparisons": 0}
    values = [HashingValue(i, counter) for i in range(n)]
    found = module.has_duplicate(values)
    return dict(duplicate_found=found, **counter)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("session", type=int, choices=range(1, 9))
    parser.add_argument("--sizes", type=int, nargs=2, default=[8, 32])
    parser.add_argument("--reference", action="store_true")
    args = parser.parse_args()
    if not (2 <= args.sizes[0] < args.sizes[1] <= 128):
        parser.error("provide two increasing sizes between 2 and 128")
    target = "complexity_solutions" if args.reference else "complexity_exercises"
    module = importlib.import_module(f"{target}.c{args.session:02d}")
    print(
        json.dumps(
            dict(
                python=sys.version.split()[0],
                target=target,
                unit="selected instrumented operations, not seconds",
                cases=[dict(n=n, **observe(args.session, module, n)) for n in args.sizes],
            ),
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
