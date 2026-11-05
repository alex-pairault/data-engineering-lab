"""Reference implementation. Read only after an attempt; not learner evidence."""

from concurrent.futures import ProcessPoolExecutor
import multiprocessing


def square(value):
    return value * value


def parallel_squares(values):
    with ProcessPoolExecutor(
        max_workers=2, mp_context=multiprocessing.get_context("spawn")
    ) as pool:
        return list(pool.map(square, values, chunksize=4))
