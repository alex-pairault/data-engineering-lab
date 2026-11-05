"""Reference implementation. Read only after an attempt; not learner evidence."""

import tomllib


def project_name(toml_text):
    config = tomllib.loads(toml_text)
    project = config.get("project", {})
    name = project.get("name") if isinstance(project, dict) else None
    if not isinstance(name, str) or not name.strip():
        raise ValueError("project.name required")
    return name
