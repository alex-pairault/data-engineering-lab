"""Local Airflow 3.3.2 retry lesson. Put this inside AIRFLOW_HOME/dags.

See SETUP.txt. Only small pure computations; no external business writes.
"""

from datetime import datetime, timedelta, timezone
from airflow.sdk import dag, task, get_current_context


@dag(schedule=None, start_date=datetime(2026, 1, 1, tzinfo=timezone.utc), catchup=False)
def fieldnotes_retry():
    @task
    def extract():
        return [2, 3]

    @task(retries=1, retry_delay=timedelta(seconds=1))
    def transform(values):
        attempt = get_current_context()["ti"].try_number
        if attempt == 1:
            raise ValueError("Synthetic first-attempt failure")
        return sum(value * 2 for value in values)

    @task
    def verify(total):
        assert total == 10
        print("Verified synthetic total:", total)

    verify(transform(extract()))


dag_object = fieldnotes_retry()
if __name__ == "__main__":
    result = dag_object.test()
    if result.state != "success":
        raise SystemExit("The local DAG run did not succeed; inspect task states.")
