import importlib


def test_transcribe_module_imports():
    module = importlib.import_module("elysian_brain.toolbelt.transcribe.batch_subtitles")
    assert hasattr(module, "main")
