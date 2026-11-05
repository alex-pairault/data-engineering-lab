"""Compile syntax strings without putting newer syntax in this baseline module."""

import json
import sys

FEATURES = {
    "3.10 pattern matching": "match 1:\n    case 1: pass",
    "3.12 type statement": "type Row = dict[str, int]",
    "3.15 lazy import": "lazy import json",
}


def main():
    probes = {}
    for feature, source in FEATURES.items():
        try:
            compile(source, "<feature-probe>", "exec")
        except SyntaxError:
            probes[feature] = False
        else:
            probes[feature] = True
    gil_probe = getattr(sys, "_is_gil_enabled", None)
    print(
        json.dumps(
            {
                "version": sys.version,
                "executable": sys.executable,
                "implementation": sys.implementation.name,
                "gil_enabled": gil_probe()
                if gil_probe
                else "probe unavailable; do not infer from version",
                "syntax_compiles": probes,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
