from __future__ import annotations

import argparse
import json
import logging
import math
import pathlib
import shutil
import subprocess
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Any, Dict, Iterable, List, Optional

import ffmpeg  # type: ignore
from faster_whisper import WhisperModel  # type: ignore

logger = logging.getLogger(__name__)

SUPPORTED_EXTS = {
    ".mp4",
    ".m4a",
    ".mp3",
    ".wav",
    ".aac",
    ".flac",
    ".ogg",
    ".webm",
    ".mkv",
    ".mov",
    ".avi",
    ".wmv",
    ".flv",
    ".m4v",
    ".3gp",
    ".opus",
    ".mpeg",
    ".mpg",
    ".ts",
}

def normalize_language(language: str) -> str | None:
    """
    Normalize language codes for faster-whisper.

    faster-whisper accepts short ISO-style codes (e.g. 'pt', 'en'). This helper:
    - returns None for 'auto' (enable autodetect)
    - maps 'pt-BR'/'pt_BR'/'pt-PT' to 'pt'
    - lowercases other values
    """
    value = (language or "").strip()
    if not value:
        return None

    value = value.replace("_", "-").strip()
    lowered = value.lower()
    if lowered == "auto":
        return None
    if lowered.startswith("pt-"):
        return "pt"
    return lowered


@dataclass
class SegmentOut:
    id: int
    start: float
    end: float
    text: str


def ensure_ffmpeg_available() -> None:
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        raise RuntimeError(
            "ffmpeg não encontrado no PATH. Instale o ffmpeg e garanta que o comando `ffmpeg` funciona no terminal."
        ) from e


def iter_media_files(root: pathlib.Path, recursive: bool) -> Iterable[pathlib.Path]:
    if root.is_file():
        if root.suffix.lower() in SUPPORTED_EXTS:
            yield root
        return

    pattern = "**/*" if recursive else "*"
    for p in root.glob(pattern):
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTS:
            yield p


def decode_to_wav_16k_mono(input_path: pathlib.Path, tmp_dir: pathlib.Path) -> pathlib.Path:
    tmp_dir.mkdir(parents=True, exist_ok=True)
    out_path = tmp_dir / (input_path.stem + "_" + input_path.suffix[1:] + ".__stt__.wav")

    if out_path.exists() and out_path.stat().st_size > 1024:
        return out_path

    try:
        (
            ffmpeg.input(str(input_path))
            .output(
                str(out_path),
                format="wav",
                acodec="pcm_s16le",
                ac=1,
                ar=16000,
                loglevel="error",
            )
            .overwrite_output()
            .run()
        )
    except ffmpeg.Error:
        try:
            subprocess.run(
                [
                    "ffmpeg",
                    "-i",
                    str(input_path),
                    "-ac",
                    "1",
                    "-ar",
                    "16000",
                    "-acodec",
                    "pcm_s16le",
                    "-y",
                    str(out_path),
                ],
                check=True,
                capture_output=True,
            )
        except subprocess.CalledProcessError as e:
            stderr = ""
            try:
                stderr = e.stderr.decode(errors="ignore")[:400]
            except Exception:
                stderr = str(e)
            raise RuntimeError(f"Falha ao converter áudio via ffmpeg: {stderr}") from e

    return out_path


def transcribe_file(
    model: WhisperModel,
    wav_path: pathlib.Path,
    language: str,
    beam_size: int,
    vad_filter: bool,
    vad_min_silence_ms: int,
    batch_size: int,
    initial_prompt: Optional[str] = None,
) -> List[SegmentOut]:
    normalized_language = normalize_language(language)
    kwargs: Dict[str, Any] = {
        "audio": str(wav_path),
        "language": normalized_language,
        "beam_size": beam_size,
        "vad_filter": vad_filter,
        "batch_size": batch_size,
    }

    if vad_filter:
        kwargs["vad_parameters"] = {"min_silence_duration_ms": vad_min_silence_ms}

    if initial_prompt:
        kwargs["initial_prompt"] = initial_prompt

    segments, _info = model.transcribe(**kwargs)

    out: List[SegmentOut] = []
    for idx, seg in enumerate(segments, start=1):
        text = (seg.text or "").strip()
        if not text:
            continue
        out.append(SegmentOut(id=idx, start=float(seg.start), end=float(seg.end), text=text))
    return out


def normalize_punctuation(text: str) -> str:
    import re

    text = re.sub(r"\s+([.,!?;:])", r"\1", text)
    text = re.sub(r"([.,!?;:])(?!\s|$|\")", r"\1 ", text)

    sentences = re.split(r"([.!?])\s+", text)
    rebuilt = ""
    for i in range(0, len(sentences), 2):
        if i < len(sentences):
            sentence = sentences[i].strip()
            if sentence:
                rebuilt += sentence[0].upper() + sentence[1:]
                if i + 1 < len(sentences):
                    rebuilt += sentences[i + 1] + " "
    return rebuilt.strip()


def merge_short_segments(segments: List[SegmentOut], max_chars: int = 100) -> List[SegmentOut]:
    if not segments:
        return []

    merged: List[SegmentOut] = []
    current = segments[0]

    for seg in segments[1:]:
        combined_text = current.text + " " + seg.text
        if len(combined_text) <= max_chars:
            current = SegmentOut(id=current.id, start=current.start, end=seg.end, text=combined_text)
        else:
            merged.append(current)
            current = seg

    merged.append(current)

    renum: List[SegmentOut] = []
    for idx, s in enumerate(merged, start=1):
        renum.append(SegmentOut(id=idx, start=s.start, end=s.end, text=s.text))
    return renum


def srt_timestamp(seconds: float) -> str:
    if seconds < 0:
        seconds = 0.0
    ms = int(round((seconds - math.floor(seconds)) * 1000.0))
    total = int(math.floor(seconds))
    s = total % 60
    m = (total // 60) % 60
    h = total // 3600
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def vtt_timestamp(seconds: float) -> str:
    if seconds < 0:
        seconds = 0.0
    ms = int(round((seconds - math.floor(seconds)) * 1000.0))
    total = int(math.floor(seconds))
    s = total % 60
    m = (total // 60) % 60
    h = total // 3600
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


def write_srt(segments: List[SegmentOut], out_path: pathlib.Path) -> None:
    lines: List[str] = []
    for seg in segments:
        lines.append(str(seg.id))
        lines.append(f"{srt_timestamp(seg.start)} --> {srt_timestamp(seg.end)}")
        lines.append(seg.text)
        lines.append("")
    out_path.write_text("\n".join(lines), encoding="utf-8")


def write_vtt(segments: List[SegmentOut], out_path: pathlib.Path) -> None:
    lines: List[str] = ["WEBVTT", ""]
    for seg in segments:
        lines.append(f"{vtt_timestamp(seg.start)} --> {vtt_timestamp(seg.end)}")
        lines.append(seg.text)
        lines.append("")
    out_path.write_text("\n".join(lines), encoding="utf-8")


def write_json(segments: List[SegmentOut], out_path: pathlib.Path, metadata: Dict[str, Any]) -> None:
    output = {
        "metadata": metadata,
        "segments": [asdict(seg) for seg in segments],
        "stats": {
            "total_segments": len(segments),
            "total_duration": segments[-1].end if segments else 0,
            "average_segment_duration": (
                sum(seg.end - seg.start for seg in segments) / len(segments) if segments else 0
            ),
        },
    }
    out_path.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")

def write_markdown_raw_text(segments: List[SegmentOut], out_path: pathlib.Path) -> None:
    text = "\n".join(s.text for s in segments if (s.text or "").strip()).strip()
    if text:
        text += "\n"
    out_path.write_text(text, encoding="utf-8")


def cleanup_temp_dir(tmp_dir: pathlib.Path, keep_temp: bool) -> None:
    if keep_temp:
        return
    if tmp_dir.exists():
        shutil.rmtree(tmp_dir, ignore_errors=True)


def transcrever_midias_em_lote(
    input_path: str,
    outdir: Optional[str] = None,
    recursive: bool = False,
    lang: str = "pt",
    model_name: str = "small",
    device: str = "cpu",
    compute_type: str = "int8",
    cpu_threads: int = 0,
    workers: int = 1,
    beam_size: int = 5,
    batch_size: int = 8,
    vad: bool = True,
    vad_min_silence_ms: int = 500,
    overwrite: bool = False,
    output_format: str = "all",
    merge_segments: bool = False,
    max_chars: int = 100,
    normalize: bool = False,
    max_duration: int = 0,
    initial_prompt: Optional[str] = None,
    keep_temp: bool = False,
    cache_dir: Optional[str] = None,
    emit_md: bool = True,
) -> dict:
    ensure_ffmpeg_available()

    root = pathlib.Path(input_path).expanduser().resolve()
    if not root.exists():
        raise FileNotFoundError(f"Caminho não existe: {root}")

    out_base = pathlib.Path(outdir).expanduser().resolve() if outdir else None

    normalized_lang = normalize_language(lang) or "auto"

    whisper_kwargs: Dict[str, Any] = {
        "model_size_or_path": model_name,
        "device": device,
        "compute_type": compute_type,
        "cpu_threads": cpu_threads,
        "num_workers": workers,
    }
    if cache_dir:
        whisper_kwargs["download_root"] = cache_dir

    model = WhisperModel(**whisper_kwargs)

    files = list(iter_media_files(root, recursive=recursive))
    if not files:
        return {"ok": True, "processed": 0, "failed": 0, "skipped": 0, "total": 0, "results": []}

    if max_duration > 0:
        filtered: List[pathlib.Path] = []
        for f in files:
            try:
                probe = ffmpeg.probe(str(f))
                duration = float(probe["format"]["duration"])
                if duration <= max_duration:
                    filtered.append(f)
            except Exception:
                filtered.append(f)
        files = filtered

    processed = 0
    failed = 0
    skipped = 0
    results: List[dict] = []

    for f in files:
        target_dir = out_base if out_base else f.parent
        target_dir.mkdir(parents=True, exist_ok=True)

        srt_path = target_dir / (f.stem + ".srt")
        vtt_path = target_dir / (f.stem + ".vtt")
        json_path = target_dir / (f.stem + "_transcript.json")
        md_path = target_dir / (f.stem + ".md")

        wants_srt = output_format in ("srt", "all")
        wants_vtt = output_format in ("vtt", "all")
        wants_json = output_format in ("json", "all")

        if not overwrite:
            already = False
            if wants_srt and srt_path.exists():
                already = True
            if wants_vtt and vtt_path.exists():
                already = True
            if wants_json and json_path.exists():
                already = True
            if emit_md and md_path.exists():
                already = True
            if already:
                skipped += 1
                results.append(
                    {
                        "file": str(f),
                        "ok": True,
                        "skipped": True,
                        "reason": "output_exists",
                        "srt": str(srt_path) if wants_srt else None,
                        "vtt": str(vtt_path) if wants_vtt else None,
                        "json": str(json_path) if wants_json else None,
                    }
                )
                continue

        tmp_dir = target_dir / ".tmp_stt"

        try:
            wav_path = decode_to_wav_16k_mono(f, tmp_dir)

            segs = transcribe_file(
                model=model,
                wav_path=wav_path,
                language=lang,
                beam_size=beam_size,
                vad_filter=vad,
                vad_min_silence_ms=vad_min_silence_ms,
                batch_size=batch_size,
                initial_prompt=initial_prompt,
            )

            if not segs:
                failed += 1
                results.append({"file": str(f), "ok": False, "error": "no_segments"})
                continue

            if normalize:
                segs = [
                    SegmentOut(id=s.id, start=s.start, end=s.end, text=normalize_punctuation(s.text))
                    for s in segs
                ]

            if merge_segments:
                segs = merge_short_segments(segs, max_chars=max_chars)

            metadata = {
                "source_file": str(f.name),
                "source_path": str(f),
                "model": model_name,
                "language": normalized_lang,
                "transcription_date": datetime.now().isoformat(),
                "duration": segs[-1].end if segs else 0,
                "segment_count": len(segs),
            }

            if wants_srt:
                write_srt(segs, srt_path)
            if wants_vtt:
                write_vtt(segs, vtt_path)
            if wants_json:
                write_json(segs, json_path, metadata)
            if emit_md:
                write_markdown_raw_text(segs, md_path)

            processed += 1
            results.append(
                {
                    "file": str(f),
                    "ok": True,
                    "segments": len(segs),
                    "srt": str(srt_path) if wants_srt else None,
                    "vtt": str(vtt_path) if wants_vtt else None,
                    "json": str(json_path) if wants_json else None,
                }
            )

        except Exception as e:
            failed += 1
            results.append({"file": str(f), "ok": False, "error": str(e)})
        finally:
            cleanup_temp_dir(tmp_dir, keep_temp=keep_temp)

    return {
        "ok": True,
        "total": len(files),
        "processed": processed,
        "failed": failed,
        "skipped": skipped,
        "results": results,
        "defaults": {
            "lang": normalized_lang,
            "model_name": model_name,
            "device": device,
            "compute_type": compute_type,
            "cpu_threads": cpu_threads,
            "workers": workers,
            "batch_size": batch_size,
            "vad": vad,
            "output_format": output_format,
            "merge_segments": merge_segments,
            "normalize": normalize,
        },
    }


def main() -> int:
    p = argparse.ArgumentParser(description="Elysian STT: transcricao/legendas via faster-whisper.")
    p.add_argument("--input", required=True, help="Arquivo ou diretório.")
    p.add_argument("--outdir", default="", help="Diretório de saída (default: ao lado do arquivo).")
    p.add_argument("--recursive", action="store_true")
    p.add_argument("--lang", default="pt", help="pt/pt-BR/en/auto")
    p.add_argument("--model", default="medium")
    p.add_argument("--device", default="cpu", choices=["cpu", "cuda"])
    p.add_argument("--compute-type", default="int8")
    p.add_argument("--cpu-threads", type=int, default=0, help="Threads CPU (0=auto).")
    p.add_argument("--workers", type=int, default=1, help="Workers de decoding/inferencia.")
    p.add_argument("--beam-size", type=int, default=5)
    p.add_argument("--batch-size", type=int, default=8, help="Batch size do transcribe.")
    p.add_argument("--vad", action="store_true")
    p.add_argument("--vad-min-silence-ms", type=int, default=500)
    p.add_argument("--overwrite", action="store_true")
    p.add_argument("--format", default="all", choices=["srt", "vtt", "json", "all"])
    p.add_argument("--merge-segments", action="store_true")
    p.add_argument("--max-chars", type=int, default=100)
    p.add_argument("--normalize", action="store_true")
    p.add_argument("--max-duration", type=int, default=0)
    p.add_argument("--initial-prompt", default="")
    p.add_argument("--keep-temp", action="store_true")
    p.add_argument("--cache-dir", default="")
    p.add_argument("--no-md", action="store_true", help="Nao gerar <stem>.md com texto bruto.")
    p.add_argument("--verbose", action="store_true")
    args = p.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
    )

    report = transcrever_midias_em_lote(
        input_path=args.input,
        outdir=args.outdir or None,
        recursive=args.recursive,
        lang=args.lang,
        model_name=args.model,
        device=args.device,
        compute_type=args.compute_type,
        cpu_threads=args.cpu_threads,
        workers=args.workers,
        beam_size=args.beam_size,
        batch_size=args.batch_size,
        vad=args.vad,
        vad_min_silence_ms=args.vad_min_silence_ms,
        overwrite=args.overwrite,
        output_format=args.format,
        merge_segments=args.merge_segments,
        max_chars=args.max_chars,
        normalize=args.normalize,
        max_duration=args.max_duration,
        initial_prompt=args.initial_prompt or None,
        keep_temp=args.keep_temp,
        cache_dir=args.cache_dir or None,
        emit_md=not args.no_md,
    )

    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report.get("failed", 0) == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
