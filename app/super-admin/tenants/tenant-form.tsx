"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";

export default function TenantForm() {
  const router = useRouter();

  async function submit(_prev: unknown, formData: FormData) {
    const res = await fetch("/api/super-admin/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
    <form action={formAction} className="max-w-md flex gap-4 items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium text-zinc-300 mb-1">Nome</label>
        <input name="name" required placeholder="Lidera" className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-zinc-300 mb-1">Slug</label>
        <input name="slug" required placeholder="lidera" className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white" />
      </div>
      <button type="submit" className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 font-medium whitespace-nowrap">
        Criar
      </button>
      {state?.error && <p className="text-red-400 text-sm col-span-full">{state.error}</p>}
    </form>
  );
}
