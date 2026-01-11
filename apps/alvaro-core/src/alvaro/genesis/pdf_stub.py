from __future__ import annotations


def build_pdf_stub(request_sha256: str) -> bytes:
    """
    Minimal deterministic PDF bytes.
    No external libs. Generates a single-page PDF with a short label.
    """
    text = f"GENESIS DECISION STUB\\nrequest_sha256={request_sha256}"
    text = text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")

    parts: list[bytes] = []
    parts.append(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")

    obj1 = b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    obj2 = b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
    obj3 = b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
    stream = (
        "BT\n"
        "/F1 18 Tf\n"
        "72 760 Td\n"
        f"({text}) Tj\n"
        "ET\n"
    ).encode("utf-8")
    obj4 = b"4 0 obj\n<< /Length " + str(len(stream)).encode("ascii") + b" >>\nstream\n" + stream + b"\nendstream\nendobj\n"
    obj5 = b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"

    objects = [obj1, obj2, obj3, obj4, obj5]
    offsets: list[int] = []

    current_len = len(parts[0])
    for obj in objects:
        offsets.append(current_len)
        parts.append(obj)
        current_len += len(obj)

    xref_start = current_len
    xref_lines = [b"xref\n", b"0 6\n", b"0000000000 65535 f \n"]
    for off in offsets:
        xref_lines.append(f"{off:010d} 00000 n \n".encode("ascii"))
    parts.extend(xref_lines)

    trailer = (
        b"trailer\n"
        b"<< /Size 6 /Root 1 0 R >>\n"
        b"startxref\n"
        + str(xref_start).encode("ascii")
        + b"\n%%EOF\n"
    )
    parts.append(trailer)

    return b"".join(parts)
