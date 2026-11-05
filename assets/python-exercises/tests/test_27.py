def test_spawn_process_results(m):
    assert m.parallel_squares([0, 2, -3, 4]) == [0, 4, 9, 16]
    assert m.parallel_squares([]) == []


# Add your own changed case below. Keep this file when switching targets.
