"""Create a disposable Git conflict for lesson 13. Requires Git and Python 3.10+.

Run: python git_conflict_lab.py --create merge-practice
Refuses an existing destination. No remotes, credentials, hooks, or global config.
"""
import argparse
from pathlib import Path
import subprocess

CHECK = '''import importlib.util
from pathlib import Path
spec = importlib.util.spec_from_file_location("discount", Path(__file__).with_name("discount.py"))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
for amount, expected in [(9999, 0), (10000, 1000), (20000, 2000)]:
    actual = module.discount(amount)
    print(f"{amount}: expected {expected}, got {actual}")
    assert actual == expected, "The resolution lost a business requirement"
print("Both business changes are preserved.")
'''


def rule(threshold, divisor):
    return f"def discount(amount):\n    return 0 if amount < {threshold} else amount // {divisor}\n"


def git(folder, *arguments, check=True):
    # Ignore system/global Git settings, signing, and external hooks for this sandbox.
    import os
    env = {**os.environ, "GIT_CONFIG_NOSYSTEM": "1", "GIT_CONFIG_GLOBAL": os.devnull,
           "GIT_TERMINAL_PROMPT": "0"}
    for key in list(env):
        if key.startswith("GIT_") and key not in {"GIT_CONFIG_NOSYSTEM", "GIT_CONFIG_GLOBAL", "GIT_TERMINAL_PROMPT"}:
            del env[key]
    return subprocess.run(["git", "-c", "core.hooksPath=" + os.devnull, "-c", "commit.gpgsign=false",
                           "-C", str(folder), *arguments], capture_output=True, text=True, env=env, check=check)


def create(folder):
    folder.mkdir(parents=False, exist_ok=False)
    git(folder, "init", "-b", "main")
    git(folder, "config", "user.name", "Fieldnotes exercise")
    git(folder, "config", "user.email", "exercise@example.invalid")
    (folder / ".gitignore").write_text("__pycache__/\n")
    target = folder / "discount.py"
    target.write_text(rule(5000, 20))
    (folder / "check_discount.py").write_text(CHECK)
    git(folder, "add", ".")
    git(folder, "commit", "-m", "Start synthetic discount rule")
    git(folder, "switch", "-c", "feature-rate")
    target.write_text(rule(5000, 10))
    git(folder, "commit", "-am", "Raise rate to ten percent")
    git(folder, "switch", "main")
    target.write_text(rule(10000, 20))
    git(folder, "commit", "-am", "Raise threshold to ten thousand cents")
    result = git(folder, "merge", "feature-rate", check=False)
    if result.returncode != 1 or "<<<<<<<" not in target.read_text():
        raise RuntimeError("Expected a source conflict; inspect the disposable repository.")
    return folder


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--create", type=Path, required=True)
    args = parser.parse_args()
    folder = create(args.create.resolve())
    print(f"Created conflict only in: {folder}\nEdit discount.py to keep threshold 10000 AND rate 10%.\n"
          "Run python check_discount.py; inspect git diff; git add discount.py; git diff --cached; git commit.\n"
          "No remote exists. This does not modify your course repository.")
