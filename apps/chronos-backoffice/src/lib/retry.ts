import { logEvent } from "./log";

export async function tryReflectRetry<T>(args: {
  organ: "chronos";
  action: string;
  attemptLimit: number;
  baseDelayMs: number;
  fn: (attempt: number) => Promise<T>;
}): Promise<T> {
  const { organ, action, attemptLimit, baseDelayMs, fn } = args;

  let lastErr: unknown;

  for (let attempt = 1; attempt <= attemptLimit; attempt++) {
    try {
      if (attempt > 1) logEvent({ organ, action, status: "info", meta: { attempt, note: "retry" } });
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      logEvent({
        organ,
        action,
        status: "failure",
        meta: { attempt, attemptLimit, error: err instanceof Error ? err.message : String(err) }
      });

      if (attempt < attemptLimit) {
        const delay = Math.round(baseDelayMs * Math.pow(2, attempt - 1));
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
