"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";

export default function ConteudoGroupForm({
  tenantId,
  tenantsList,
}: {
  tenantId: string | null;
  tenantsList: { id: string; name: string }[];
}) {
  const router = useRouter();

  async function submit(_prev: unknown, formData: FormData) {
    const res = await fetch("/api/admin/content-groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenant_id: (formData.get("tenant_id") as string) || tenantId,
        title: formData.get("title"),
        slug: formData.get("slug"),
        cover_url: formData.get("cover_url") || null,
        description: formData.get("description") || null,
        sort_order: Number(formData.get("sort_order")) || 0,
      }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      return { error: (e as { error?: string }).error || "Erro ao criar" };
    }
    const { id } = (await res.json()) as { id: string };
    router.push(`/admin/conteudos/${id}`);
    router.refresh();
    return { error: null };
  }

  const [state, formAction] = useActionState(submit, { error: null as string | null });

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {tenantId === null && tenantsList.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Tenant</label>
          <select
            name="tenant_id"
            required
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
          >
            <option value="">Selecione</option>
            {tenantsList.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {tenantId && <input type="hidden" name="tenant_id" value={tenantId} />}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Título</label>
        <input
          name="title"
          required
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Slug (URL)</label>
        <input
          name="slug"
          required
          placeholder="meu-curso"
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">URL da capa</label>
        <input
          name="cover_url"
          type="url"
          placeholder="https://..."
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Descrição</label>
        <textarea
          name="description"
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Ordem</label>
        <input
          name="sort_order"
          type="number"
          defaultValue={0}
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        />
      </div>
      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium">
        Criar
      </button>
    </form>
  );
}
