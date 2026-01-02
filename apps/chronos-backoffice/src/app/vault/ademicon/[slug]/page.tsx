import Link from "next/link";
import { notFound } from "next/navigation";
import { listAdemiconVaultDocs, readAdemiconVaultDoc } from "@/lib/vault/ademicon";

export default function AdemiconVaultDocPage({ params }: { params: { slug: string } }) {
  const result = readAdemiconVaultDoc(params.slug);
  if (!result) notFound();

  const { doc, content } = result;
  const docs = listAdemiconVaultDocs();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">{doc.title}</div>
          <div className="mt-1 text-xs opacity-70">Fonte: apps/ozzmosis/data/vault/ademicon/{doc.relativePath}</div>
        </div>
        <Link className="text-xs font-semibold underline-offset-4 hover:underline" href="/vault/ademicon">
          Voltar
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed">{content}</pre>
      </div>

      <div className="mt-8 text-xs uppercase tracking-wide opacity-60">Mais documentos</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {docs.map((item) => (
          <Link
            key={item.slug}
            className={`rounded-full border border-white/10 px-3 py-1 text-xs ${
              item.slug === doc.slug ? "bg-white/10" : "bg-black/20 hover:bg-white/10"
            }`}
            href={`/vault/ademicon/${item.slug}`}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
