import { convertToModelMessages, streamText } from "ai";
import { createOllama } from "ai-sdk-ollama";

export const runtime = "nodejs";

function getEnv(name: string) {
  return process.env[name];
}

function getOllamaConfig() {
  const baseUrl = getEnv("OLLAMA_BASE_URL") ?? "http://127.0.0.1:11434";
  const model = getEnv("CHRONOS_LLM_MODEL") ?? "llama3.1";
  return { baseUrl, model };
}

function getProvider() {
  const provider = (getEnv("CHRONOS_LLM_PROVIDER") ?? "ollama").trim().toLowerCase();
  if (provider !== "ollama") {
    throw new Error("unsupported_provider");
  }
  return provider;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }

  try {
    getProvider();
  } catch {
    return new Response(JSON.stringify({ error: "unsupported_provider" }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }

  const { baseUrl, model } = getOllamaConfig();

  const provider = createOllama({ baseURL: baseUrl });

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : undefined;
  const messages = record && Array.isArray(record.messages) ? record.messages : undefined;

  let modelMessages;
  try {
    modelMessages = await convertToModelMessages(messages ?? []);
  } catch {
    return new Response(JSON.stringify({ error: "invalid_messages" }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }

  const result = streamText({
    model: provider(model),
    messages: modelMessages
  });

  return result.toUIMessageStreamResponse();
}
