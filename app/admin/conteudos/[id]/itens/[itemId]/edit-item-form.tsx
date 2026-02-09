"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  title: string;
  slug: string;
  type: string;
  video_url: string | null;
  body: string | null;
  instructor_notes: string | null;
  sort_order: number;
};

export default function EditItemForm({ groupId, item }: { groupId: string; item: Item }) {
  const router = useRouter();

  async function submit(_prev: unknown, formData: FormData) {
    const res = await fetch(`/api/admin/content-items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        slug: formData.get("slug"),
        type: formData.get("type"),
        video_url: formData.get("video_url") || null,
        body: formData.get("body") || null,
        instructor_notes: formData.get("instructor_notes") || null,
        sort_order: Number(formData.get("sort_order")) || 0,
      }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      return { error: (e as { error?: string }).error || "Erro" };
    }
    router.push(`/admin/conteudos/${groupId}`);
    router.refresh();
    return { error: null };
  }

  const [state, formAction] = useActionState(submit, { error: null as string | null });

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Título</label>
        <input name="title" defaultValue={item.title} required className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Slug</label>
        <input name="slug" defaultValue={item.slug} required className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Tipo</label>
        <select name="type" defaultValue={item.type} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white">
          <option value="video">Vídeo</option>
          <option value="text">Texto</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">URL do vídeo</label>
        <input name="video_url" type="url" defaultValue={item.video_url ?? ""} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Texto (HTML)</label>
        <textarea name="body" rows={5} defaultValue={item.body ?? ""} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Anotações do professor</label>
        <textarea name="instructor_notes" rows={3} defaultValue={item.instructor_notes ?? ""} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Ordem</label>
        <input name="sort_order" type="number" defaultValue={item.sort_order} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium">Salvar</button>
    </form>
  );
}
