export type ToolCall = {
  tool: string;
  input: Record<string, unknown>;
  request_id?: string;
};

export type ToolResult = {
  tool: string;
  ok: boolean;
  reason_codes: string[];
  output: Record<string, unknown>;
  meta: Record<string, unknown>;
};

export type ToolListResult = {
  ok: boolean;
  specs: Record<string, unknown>;
};
