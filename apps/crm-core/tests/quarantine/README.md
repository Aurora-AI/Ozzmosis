# Quarantine Tests (Non-Discoverable)

This folder contains legacy or exploratory test artifacts that are intentionally **not**
picked up by pytest discovery (filenames do not start with `test_`).

Rationale:
- Preserve useful knowledge without creating accidental CI failures.
- Promote to official tests only after:
  1) toolchain is governed (pytest/venv policy decided),
  2) tests conform to current OS scope (WP3+),
  3) PLAN.md references exist if required.

Do not import these from production code.
