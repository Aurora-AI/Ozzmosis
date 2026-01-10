from .core.registry import ToolRegistry
from .core.runner import ToolRunner
from .tools import calculator


def build_registry() -> ToolRegistry:
    reg = ToolRegistry()
    reg.register(calculator.spec(), calculator.run)
    return reg


def build_runner() -> ToolRunner:
    return ToolRunner(build_registry())
