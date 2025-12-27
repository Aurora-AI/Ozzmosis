export interface ReflectInput {
  errorText: string;
  lastPlan?: string;
}

export interface ReflectOutput {
  diagnosis: string;
  nextPrompt: string;
}

export function reflect(_input: ReflectInput): ReflectOutput {
  return {
    diagnosis: "Stub: reflector ainda não implementado.",
    nextPrompt: "TODO: gerar prompt de correção com base no erro e no plano anterior."
  };
}
