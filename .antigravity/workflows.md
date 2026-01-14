# Workflows (Command Patterns)

## /plan_os
Generate:
- WPs with atomic commit boundaries
- acceptance criteria
- exact file paths (full paths)
- explicit non-goals

## /stage_check
Before any commit:
- run `git diff --cached --name-only`
- ensure PLAN.md is not staged
- ensure no artifacts/** raw outputs are staged
- ensure no .agent/ is staged

## /vault_close
Create:
- apps/ozzmosis/data/vault/rodobens-wealth/os_history/<OS_ID>_CLOSE.md
Commit:
- docs(vault): close <OS_ID>

## /evidence_pack
When requested:
- collect relevant outputs into docs/* (not artifacts/)
- reference artifact hashes and locations

## /design_contract_check
Validate UI components against:
- `docs/Vault/FRONTEND/TRUSTWARE_DESIGN_CONTRACT.md`

## /browser_allowlist_check
Before using browser:
- check against `.antigravity/browserAllowlist.example.txt`
- check local environment `~/.gemini/antigravity/browserAllowlist.txt`

## /os_close_policy
Hard Rule:
- OS-CLOSE artifact MUST be the final step after 100% completion
- No partial closures allowed
