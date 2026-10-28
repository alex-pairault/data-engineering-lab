"""Execute the downloadable lessons; do not assert machine-specific performance."""
import json
import math
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT=Path(__file__).resolve().parent.parent


class DownloadableExercises(unittest.TestCase):
    def test_sql_queries_execute_with_missing_and_excluded_customers(self):
        # Reproduce the learner's download layout, not an implicit repository-only path.
        with tempfile.TemporaryDirectory() as directory:
            folder=Path(directory)
            for source in [ROOT/'assets/exercises/sql_join_lab.py',ROOT/'assets/fixtures/join-data.json']:
                shutil.copy(source,folder/source.name)
            result=subprocess.run([sys.executable,str(folder/'sql_join_lab.py')],capture_output=True,text=True,check=True)
        queries=json.loads(result.stdout)
        self.assertEqual([row['customer_id'] for row in queries['where']],[1,4])
        self.assertEqual([row['paid_total'] for row in queries['raw']],[20,None,None,0])
        expected=[{'customer_id':index,'name':name,'paid_total':total} for index,name,total in [(1,'Ada',20),(2,'Ben',0),(3,'Cy',0),(4,'Dee',0)]]
        self.assertEqual(queries['on'],expected)
        self.assertEqual(queries['case'],expected)

    def test_resource_script_returns_equal_results_for_two_sizes_and_modes(self):
        result=subprocess.run([sys.executable,str(ROOT/'assets/exercises/profile_records.py'),'--rows','1000'],capture_output=True,text=True,check=True)
        report=json.loads(result.stdout)
        self.assertEqual(report['kind'],'fieldnotes-resource-report')
        self.assertEqual(len(report['cases']),4)
        self.assertEqual({(run['mode'],run['rows']) for run in report['cases']},{('eager',1000),('stream',1000),('eager',2000),('stream',2000)})
        for run in report['cases']:
            self.assertEqual(run['count'],run['rows'])
            self.assertEqual(run['checksum'],sum(index%97 for index in range(run['rows'])))
            for key in ['elapsed_s','cpu_s','traced_peak_bytes']:
                self.assertTrue(math.isfinite(run[key]) and run[key]>=0)
            self.assertTrue(run['rss_peak_bytes'] is None or run['rss_peak_bytes']>0)

    def test_resource_script_rejects_unbounded_input(self):
        result=subprocess.run([sys.executable,str(ROOT/'assets/exercises/profile_records.py'),'--rows','20001'],capture_output=True,text=True)
        self.assertNotEqual(result.returncode,0)
        self.assertIn('between 1000 and 20000',result.stderr)


if __name__=='__main__':
    unittest.main()
