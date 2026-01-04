import Link from "next/link";
import { listAdemiconVaultDocs } from "@/lib/vault/ademicon";

export default function AdemiconVaultPage() {
  const docs = listAdemiconVaultDocs();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="text-2xl font-semibold">Ademicon (Vault)</div>
      <div className="mt-1 text-sm opacity-70">
        Biblioteca SSOT em disco. A fonte de verdade permanece em
        <span className="ml-1 font-medium">apps/ozzmosis/data/vault/ademicon</span>.
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-lg font-semibold">Documentos</div>
        <div className="mt-3 space-y-2 text-sm">
          {docs.map((doc) => (
            <div key={doc.slug} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2">
              <div>{doc.title}</div>
              <Link className="text-xs font-semibold underline-offset-4 hover:underline" href={`/vault/ademicon/${doc.slug}`}>
                Abrir
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
