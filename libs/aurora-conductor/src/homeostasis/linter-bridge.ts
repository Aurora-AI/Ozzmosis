export interface LintResult {
  ok: boolean;
  output: string;
}

export async function runLint(): Promise<LintResult> {
  return {
    ok: true,
    output: "Stub: linter-bridge ainda não implementado."
  };
}
