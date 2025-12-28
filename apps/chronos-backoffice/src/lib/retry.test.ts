import { tryReflectRetry } from "./retry";

test("tryReflectRetry retries and succeeds", async () => {
  let calls = 0;

  const result = await tryReflectRetry({
    organ: "chronos",
    action: "unit_retry_success",
    attemptLimit: 3,
    baseDelayMs: 1,
    fn: async () => {
      calls++;
      if (calls < 2) throw new Error("fail_once");
      return "ok";
    }
  });

  expect(result).toBe("ok");
  expect(calls).toBe(2);
});
