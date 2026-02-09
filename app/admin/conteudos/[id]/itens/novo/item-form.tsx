"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";

export default function ItemForm({ contentGroupId }: { contentGroupId: string }) {
  const router = useRouter();

  async function submit(_prev: unknown, formData: FormData) {
    const res = await fetch("/api/admin/content-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content_group_id: contentGroupId,
        title: formData.get("title"),
        slug: formData.get("slug"),
        type: formData.get("type") || "video",
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
    router.push(`/admin/conteudos/${contentGroupId}`);
    router.refresh();
    return { error: null };
  }

  const [state, formAction] = useActionState(submit, { error: null as string | null });

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Título</label>
        <input name="title" required className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Slug</label>
        <input name="slug" required placeholder="aula-1" className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Tipo</label>
        <select name="type" className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white">
          <option value="video">Vídeo</option>
          <option value="text">Texto</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">URL do vídeo (YouTube)</label>
        <input name="video_url" type="url" placeholder="https://youtube.com/..." className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Texto (HTML)</label>
        <textarea name="body" rows={5} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Anotações do professor</label>
        <textarea name="instructor_notes" rows={3} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Ordem</label>
        <input name="sort_order" type="number" defaultValue={0} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium">Criar</button>
    </form>
  );
}
