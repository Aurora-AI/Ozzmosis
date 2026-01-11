# OS-GATES-LINUX-CANONICO-001 - ADDENDUM

## Context
Fix applied to the Linux gates runner for PowerShell variable interpolation.

## Root Cause
Invalid interpolation in volume mount: "$repoRoot:/repo".

## Correction
Updated to "${repoRoot}:/repo".

## Impact
Linux canonical runner unblocked; Windows runner remains best-effort.

## Evidence
Commit: 9873f22

## Verdict
Linux gates runner restored as canonical.
