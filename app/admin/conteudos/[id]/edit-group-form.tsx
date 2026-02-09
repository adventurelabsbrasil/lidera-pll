"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";

type Group = {
  id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  description: string | null;
  sort_order: number;
};

export default function EditGroupForm({ group }: { group: Group }) {
  const router = useRouter();

  async function submit(_prev: unknown, formData: FormData) {
    const res = await fetch(`/api/admin/content-groups/${group.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        slug: formData.get("slug"),
        cover_url: formData.get("cover_url") || null,
        description: formData.get("description") || null,
        sort_order: Number(formData.get("sort_order")) || 0,
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
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Título</label>
        <input
          name="title"
          defaultValue={group.title}
          required
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Slug</label>
        <input
          name="slug"
          defaultValue={group.slug}
          required
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">URL da capa</label>
        <input
          name="cover_url"
          type="url"
          defaultValue={group.cover_url ?? ""}
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Descrição</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={group.description ?? ""}
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Ordem</label>
        <input
          name="sort_order"
          type="number"
          defaultValue={group.sort_order}
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        />
      </div>
      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium">
        Salvar
      </button>
    </form>
  );
}
