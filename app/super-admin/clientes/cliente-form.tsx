"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";

export default function ClienteForm({
  tenants,
}: {
  tenants: { id: string; name: string; slug: string }[];
}) {
  const router = useRouter();

  async function submit(_prev: unknown, formData: FormData) {
    const res = await fetch("/api/super-admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenant_id: formData.get("tenant_id"),
        name: formData.get("name"),
        slug: formData.get("slug"),
      }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      return { error: (e as { error?: string }).error || "Erro" };
    }
    router.refresh();
    return { error: null };
  }

  const [state, formAction] = useActionState(submit, { error: null as string | null });

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Tenant</label>
        <select
          name="tenant_id"
          required
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        >
          <option value="">Selecione</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.slug})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Nome do cliente</label>
        <input name="name" required placeholder="Acme Corp" className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Slug (usado na URL)</label>
        <input name="slug" required placeholder="acme" className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <button type="submit" className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 font-medium">
        Criar cliente
      </button>
    </form>
  );
}
