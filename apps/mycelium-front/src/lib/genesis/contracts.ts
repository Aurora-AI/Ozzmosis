export type GenesisDecideRequest = {
  force_block?: boolean;
  // Allow forwards-compatible fields (intent/channel/etc).
  [k: string]: unknown;
};

export type GenesisPolicy = {
  verdict: 'ALLOW' | 'BLOCK';
  reasons: string[];
  version: string;
  mode: string;
  rules_triggered: string[];
};

export type GenesisUiStatus = 'allowed' | 'blocked' | 'needs_more_info' | 'handoff_required';

export type GenesisUiStep = {
  id: string;
  title: string;
  status: 'done' | 'pending' | 'error';
  summary: string;
};

export type GenesisNextAction =
  | { id: string; label: string; type: 'retry' }
  | { id: string; label: string; type: 'handoff'; channel: string }
  | { id: string; label: string; type: 'collect_input'; fields: string[] }
  | { id: string; label: string; type: 'open_artifact'; url: string };

export type GenesisUiArtifacts = {
  decision_json: string;
  decision_pdf: string;
};

export type GenesisUi = {
  status: GenesisUiStatus;
  user_message: string;
  steps: GenesisUiStep[];
  next_actions: GenesisNextAction[];
  artifacts: GenesisUiArtifacts;
};

export type GenesisDecideResponse = {
  // v1.0 fields (kept for compatibility)
  contract_version: string;
  endpoint: string;
  request_sha256: string;
  verdict: 'ALLOW' | 'BLOCK';
  reasons: string[];
  policy_version?: string;
  policy_mode?: string;
  policy_rule_ids_triggered?: string[];

  // v1.1 fields
  decision_id?: string;
  correlation_id?: string;
  policy?: GenesisPolicy;
  artifacts?: GenesisUiArtifacts;
  ui?: GenesisUi;
};

