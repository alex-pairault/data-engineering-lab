import pytest


def test_metadata(m):
    assert m.project_name('[project]\nname="fieldnotes-lab"') == "fieldnotes-lab"
    for text in ['[project]\nversion="1"', "[tool.other]\nvalue=2", '[project]\nname=" "']:
        with pytest.raises(ValueError):
            m.project_name(text)


# Add your own changed case below. Keep this file when switching targets.
