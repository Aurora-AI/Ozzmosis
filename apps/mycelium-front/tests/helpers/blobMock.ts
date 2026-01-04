export type FetchLikeResponse = {
  ok: boolean;
  status?: number;
  json: () => Promise<unknown>;
};

export const okJson = (value: unknown): FetchLikeResponse => ({
  ok: true,
  json: async () => value,
});

export const notFoundJson = (value: unknown): FetchLikeResponse => ({
  ok: false,
  status: 404,
  json: async () => value,
});

export function getLastPutJson(
  putMock: { mock: { calls: unknown[][] } },
  pathnameIncludes: string | null = null
): unknown {
  const calls = putMock?.mock?.calls ?? [];
  if (calls.length === 0) throw new Error("Expected put() to be called.");
  const picked =
    pathnameIncludes == null
      ? calls[calls.length - 1]
      : [...calls].reverse().find((c) => String(c?.[0] ?? "").includes(pathnameIncludes));
  if (!picked) throw new Error("Expected put() to be called with matching pathname.");
  const body = picked[1];
  if (typeof body !== "string") throw new Error("Expected put() body to be a JSON string.");
  return JSON.parse(body) as unknown;
}
