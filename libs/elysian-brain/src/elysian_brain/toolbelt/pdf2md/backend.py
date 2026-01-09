from __future__ import annotations

import os
from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class BackendSelection:
    engine: str
    providers: List[str]


def _env_truthy(name: str) -> bool:
    value = os.getenv(name, "").strip().lower()
    return value in {"1", "true", "yes", "on"}


def select_runtime_backend() -> BackendSelection:
    """
    Seleciona backend em runtime. Nesta OS a selecao e declarativa e auditavel,
    sem exigir OCR real.
    """
    providers: List[str] = []

    prefer_openvino = _env_truthy("AURORA_PDF2MD_PREFER_OPENVINO")
    prefer_cuda = _env_truthy("AURORA_PDF2MD_PREFER_CUDA")
    prefer_coreml = _env_truthy("AURORA_PDF2MD_PREFER_COREML")

    if prefer_openvino:
        providers.append("OpenVINOExecutionProvider")
    if prefer_cuda:
        providers.append("CUDAExecutionProvider")
    if prefer_coreml:
        providers.append("CoreMLExecutionProvider")

    providers.append("CPUExecutionProvider")

    if "OpenVINOExecutionProvider" in providers:
        engine = "onnxruntime-openvino"
    elif "CUDAExecutionProvider" in providers:
        engine = "onnxruntime-cuda"
    elif "CoreMLExecutionProvider" in providers:
        engine = "onnxruntime-coreml"
    else:
        engine = "onnxruntime-cpu"

    return BackendSelection(engine=engine, providers=providers)
