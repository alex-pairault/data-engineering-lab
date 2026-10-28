"""Execute prepared standard-library mechanisms, not external tools or learner data."""

import importlib.util
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parent.parent


def load(name):
    spec = importlib.util.spec_from_file_location(
        name, ROOT / "assets/course-exercises" / f"{name}.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class CourseExercises(unittest.TestCase):
    def test_stock_predicate_and_transaction_rollback(self):
        report = load("data_lab").transactions()
        self.assertEqual(report["stale_reads_then_writes"]["sales"], 2)
        self.assertEqual(report["guarded_atomic_update"]["affected"], [1, 0])
        self.assertEqual(report["after_rollback"], 1)

    def test_partial_import_replay_and_changed_snapshot_content(self):
        self.assertEqual(
            load("data_lab").imports(),
            {
                "append_rows": 5,
                "upsert_rows": 3,
                "upsert_total": 60,
                "update_on_change_total": 65,
            },
        )

    def test_parameter_binding_handles_apostrophes_and_injection_shaped_values(self):
        report = load("data_lab").security()
        self.assertEqual(report["injection"]["bound"], [])
        self.assertIn(902, report["injection"]["concatenated"])
        self.assertEqual(report["apostrophe"]["bound"], [903])

    def test_actual_query_counts_and_index_preserve_results(self):
        report = load("data_lab").plans()
        self.assertTrue(report["equal_results"])
        self.assertEqual(
            (report["per_parent_selects"], report["batched_selects"]), (6, 2)
        )
        self.assertTrue(
            any("orders_customer" in row for row in report["filter_plan_after"])
        )

    def test_real_backup_restores_checked_rows_but_not_later_write(self):
        report = load("data_lab").recovery()
        self.assertEqual(report["restored_rows"], [(1, 10), (2, 20)])
        self.assertEqual(report["post_snapshot_amount_not_restored"], 10)

    def test_event_identity_and_effect_rollback_together(self):
        report = load("data_lab").events()
        self.assertEqual(report["committed_effects"], 1)
        self.assertTrue(report["failed_identity_and_effect_rolled_back"])

    def test_capstone_preserves_replayed_ids_and_both_ownership_paths(self):
        report = load("data_lab").capstone()
        self.assertEqual(report["replayed_import_rows"], 3)
        self.assertTrue(report["both_user_orders_and_warm_reads_checked"])
        self.assertEqual(report["anonymous_status"], 401)

    def test_unit_calculation_does_not_hide_storage_schema_failure(self):
        report = load("reliability_lab").boundaries()
        self.assertTrue(report["pure_rule_unit_pass"])
        self.assertEqual(report["incorrect_storage_column"], "detected by integration")
        self.assertEqual(report["invalid_input_added_rows"], 0)

    def test_client_error_categories_bounded_retry_and_safe_log_context(self):
        module = load("reliability_lab")
        report = module.api()
        self.assertEqual(report["retry_503"]["attempts"], 2)
        for key, category in [
            ("invalid_json", "invalid_json"),
            ("wrong_schema", "invalid_schema"),
            ("timeout", "transport"),
        ]:
            self.assertEqual(report[key]["error"], category)
        self.assertTrue(module.logs()["planted_token_excluded"])

    def test_interview_starter_fails_and_an_accumulation_repair_passes_changed_cases(
        self,
    ):
        path = ROOT / "assets/course-exercises/interview_drill.py"
        result = subprocess.run(
            [sys.executable, str(path)], capture_output=True, text=True
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("multiple paid", result.stdout)
        source = path.read_text().replace(
            'total = order["amount"]', 'total += order["amount"]'
        )
        self.assertNotEqual(source, path.read_text())
        namespace = {"__name__": "verified_repair"}
        exec(compile(source, str(path), "exec"), namespace)
        namespace["checks"]()
        self.assertEqual(
            namespace["paid_total"](
                [
                    {"status": "paid", "amount": 3},
                    {"status": "pending", "amount": 10},
                    {"status": "paid", "amount": 4},
                ]
            ),
            7,
        )


if __name__ == "__main__":
    unittest.main()
