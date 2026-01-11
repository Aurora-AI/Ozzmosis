from .core.registry import ToolRegistry
from .core.runner import ToolRunner
from .tools import calculator, reference, search_local


def build_registry() -> ToolRegistry:
    reg = ToolRegistry()
    reg.register(calculator.spec(), calculator.run)
    reg.register(reference.spec(), reference.run)
    reg.register(search_local.spec(), search_local.run)
    return reg


def build_runner() -> ToolRunner:
    return ToolRunner(build_registry())
