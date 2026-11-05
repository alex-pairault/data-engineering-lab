"""Reference implementation. Read only after an attempt; not learner evidence."""

import argparse


def parse_args(argv):
    parser = argparse.ArgumentParser(description="Process synthetic orders")
    parser.add_argument("--input", required=True)
    parser.add_argument("--batch", type=int, default=100)
    args = parser.parse_args(argv)
    if not 1 <= args.batch <= 1000:
        parser.error("--batch must be between 1 and 1000")
    return args
