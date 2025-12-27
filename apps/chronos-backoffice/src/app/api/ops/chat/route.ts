import { convertToModelMessages, streamText } from "ai";
import { createOllama } from "ai-sdk-ollama";
import { createOpenAI } from "@ai-sdk/openai";

export const runtime = "nodejs";

type ProviderName = "ollama" | "deepseek";

function getEnv(name: string) {
  return process.env[name];
}

function getOllamaConfig() {
  const baseUrl = getEnv("OLLAMA_BASE_URL") ?? "http://127.0.0.1:11434";
  const model = getEnv("CHRONOS_LLM_MODEL") ?? "llama3.1";
  return { baseUrl, model };
}

function getProviderName(): ProviderName {
  const provider = (getEnv("CHRONOS_LLM_PROVIDER") ?? "ollama").trim().toLowerCase();
  if (provider === "ollama" || provider === "deepseek") return provider;
  throw new Error("unsupported_provider");
}

function getModelForProvider(providerName: ProviderName) {
  if (providerName === "ollama") {
    const { baseUrl, model } = getOllamaConfig();
    const provider = createOllama({ baseURL: baseUrl });
    return provider(model);
  }

  const apiKey = getEnv("DEEPSEEK_API_KEY");
  if (!apiKey) throw new Error("missing_deepseek_api_key");

  const baseURL = getEnv("DEEPSEEK_BASE_URL") ?? "https://api.deepseek.com";
  const modelId = getEnv("DEEPSEEK_MODEL") ?? "deepseek-chat";

  const provider = createOpenAI({ apiKey, baseURL });
  return provider(modelId);
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

  let providerName: ProviderName;
  try {
    providerName = getProviderName();
  } catch {
    return new Response(JSON.stringify({ error: "unsupported_provider" }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : undefined;
  const messages = record && Array.isArray(record.messages) ? record.messages : undefined;

  let modelMessages;
  try {
    const withoutIds = (messages ?? []).map((m) => {
      if (!m || typeof m !== "object") return m;
      const { id: _id, ...rest } = m as Record<string, unknown>;
      return rest;
    });

    modelMessages = await convertToModelMessages(withoutIds as never[]);
  } catch {
    return new Response(JSON.stringify({ error: "invalid_messages" }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }

  let model;
  try {
    model = getModelForProvider(providerName);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "missing_deepseek_api_key") {
      return new Response(JSON.stringify({ error: "missing_deepseek_api_key" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "invalid_provider_config" }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }

  const result = streamText({
    model,
    messages: modelMessages
  });

  return result.toUIMessageStreamResponse();
}
