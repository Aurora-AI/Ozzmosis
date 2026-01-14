# Review Policy — Genesis

## Levels

- **Always Ask**:
  - Browser automation (e.g., with JavaScript execution)
  - Accessing authenticated pages
  - Any action that alters state, secrets, or configuration
  - Architecture, contracts, policies, CI workflows, security
  - Anything touching Vault/SSOT

- **Agent Decides**:
  - Local refactors
  - Documentation updates
  - Non-critical UI polishing within Codex constraints

- **Always Proceed**:
  - Disposable prototypes outside main codepaths (must not be merged without review)

## Default

Always Ask.
