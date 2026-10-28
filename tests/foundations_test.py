"""Execute real processes, domain rules, Git conflicts and SQL with synthetic inputs."""
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
ROOT=Path(__file__).resolve().parent.parent
EXERCISES=ROOT/'assets/exercises'


def load(name):
    spec=importlib.util.spec_from_file_location(name,EXERCISES/f'{name}.py')
    module=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class Foundations(unittest.TestCase):
    def test_real_service_reports_process_endpoint_and_unchanged_startup_label(self):
        result=subprocess.run([sys.executable,str(EXERCISES/'service_probe.py')],capture_output=True,text=True,check=True,timeout=15)
        report=json.loads(result.stdout)
        self.assertGreater(report['service']['pid'],0)
        self.assertGreater(report['service']['port'],0)
        self.assertEqual([r['status'] for r in report['responses']],[200,404])
        self.assertEqual(report['responses'][0]['body']['label'],'startup-value')
        self.assertEqual(report['parent_configuration_now'],'changed-later')

    def test_python_rule_is_shared_and_rejects_invalid_calls_without_writes(self):
        module=load('quote_boundaries')
        self.assertEqual(module.run_demo()['saved'],[9000,9000])
        self.assertEqual(module.quote_total(101),91)
        repo=module.MemoryQuotes()
        for invalid in [-1,1.5,True,'10000',None,1000001]:
            with self.assertRaises(ValueError):module.create_quote(invalid,repo)
        for body in ['broken','[]','null','{"amount_cents": true}']:
            self.assertEqual(module.http_adapter(body,repo)['status'],400)
        self.assertEqual(repo.saved,[])

    def test_actual_git_conflict_requires_both_business_changes(self):
        module=load('git_conflict_lab')
        with tempfile.TemporaryDirectory() as directory:
            folder=module.create(Path(directory)/'merge-practice')
            self.assertIn('<<<<<<<',(folder/'discount.py').read_text())
            for threshold,divisor,success in [(10000,20,False),(5000,10,False),(10000,10,True)]:
                (folder/'discount.py').write_text(module.rule(threshold,divisor))
                result=subprocess.run([sys.executable,str(folder/'check_discount.py')],capture_output=True,text=True)
                self.assertEqual(result.returncode==0,success)
            module.git(folder,'add','discount.py');module.git(folder,'commit','-m','Preserve both changes')
            self.assertFalse(module.git(folder,'status','--porcelain').stdout.strip())
            self.assertEqual(module.git(folder,'remote').stdout,'')
            with self.assertRaises(FileExistsError):module.create(folder)

    def test_downloaded_grain_fixture_queries_and_constraints_execute(self):
        with tempfile.TemporaryDirectory() as directory:
            folder=Path(directory)
            for source in [EXERCISES/'sql_grain_lab.py',ROOT/'assets/fixtures/grain-data.json']:
                shutil.copy(source,folder/source.name)
            result=subprocess.run([sys.executable,str(folder/'sql_grain_lab.py')],capture_output=True,text=True,check=True)
            report=json.loads(result.stdout)
        self.assertEqual(report['queries']['fanout'][0],{'order_id':901,'line_total':300,'payment_total':200})
        self.assertEqual(report['queries']['distinct'][0]['line_total'],50)
        self.assertEqual(report['queries']['aggregate'][0],{'order_id':901,'line_total':100,'payment_total':100})
        self.assertEqual(set(report['constraints'].values()),{'rejected'})
        module=load('sql_grain_lab');fixture=json.loads((ROOT/'assets/fixtures/grain-data.json').read_text());fixture['orders'].append({'id':903})
        self.assertEqual(module.run(fixture)['queries']['aggregate'][-1],{'order_id':903,'line_total':0,'payment_total':0})


if __name__=='__main__': unittest.main()
