"use client";

import React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

function roleLabel(role: string) {
  if (role === "user") return "Você";
  if (role === "assistant") return "Chronos";
  if (role === "system") return "Sistema";
  return role;
}

export default function OpsChatPage() {
  const [input, setInput] = React.useState("");

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ops/chat" }),
    messages: []
  });

  const isLoading = status === "submitted" || status === "streaming";
  const provider = process.env.NEXT_PUBLIC_CHRONOS_PROVIDER ?? "ollama";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage({ text });
  }

  function messageText(m: { parts: Array<{ type: string; text?: string }> }) {
    return m.parts
      .filter((p) => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("");
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-10">
      <header>
        <div className="text-2xl font-semibold">Ops Chat (Local)</div>
        <div className="mt-1 text-sm opacity-70">
          Provider default: Ollama. Sem persistência automática. Sem fallback cloud.
        </div>
      </header>

      <section className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        {provider === "deepseek" ? (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm">
            Modo demonstração — DeepSeek (cloud). Não use dados sensíveis.
          </div>
        ) : null}

        {messages.length === 0 ? (
          <div className="text-sm opacity-70">
            Dica: defina `CHRONOS_LLM_MODEL` e garanta que o Ollama está rodando em `OLLAMA_BASE_URL`.
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
              <div className="text-xs opacity-60">{roleLabel(m.role)}</div>
              <div className="mt-1 whitespace-pre-wrap text-sm">{messageText(m)}</div>
            </div>
          ))}
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm">
            Falha: {String(error.message || error)}
          </div>
        ) : null}
      </section>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Respondendo..." : "Digite sua mensagem"}
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || input.trim().length === 0}
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}
