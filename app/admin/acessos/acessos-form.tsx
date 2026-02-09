"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

type Client = { id: string; name: string; slug: string };
type Group = { id: string; title: string; slug: string };
type Access = { id: string; client_id: string; content_group_id: string };

export default function AcessosForm({
  clients,
  groups,
  currentAccess,
}: {
  clients: Client[];
  groups: Group[];
  currentAccess: Access[];
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [groupId, setGroupId] = useState("");

  async function addAccess(_prev: unknown, formData: FormData) {
    const cid = formData.get("client_id") as string;
    const gid = formData.get("content_group_id") as string;
    if (!cid || !gid) return { error: "Selecione cliente e conteúdo" };
    const res = await fetch("/api/admin/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: cid, content_group_id: gid }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      return { error: (e as { error?: string }).error || "Erro" };
    }
    router.refresh();
    return { error: null };
  }

  async function removeAccess(accessId: string) {
    await fetch(`/api/admin/access?id=${accessId}`, { method: "DELETE" });
    router.refresh();
  }

  const [state, formAction] = useActionState(addAccess, { error: null as string | null });

  const hasAccess = (cId: string, gId: string) =>
    currentAccess.some((a) => a.client_id === cId && a.content_group_id === gId);

  return (
    <div className="space-y-8">
      <form action={formAction} className="flex flex-wrap items-end gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Cliente</label>
          <select
            name="client_id"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white min-w-[200px]"
          >
            <option value="">Selecione</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.slug})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Conteúdo</label>
          <select
            name="content_group_id"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white min-w-[200px]"
          >
            <option value="">Selecione</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium">
          Dar acesso
        </button>
      </form>
      {state?.error && <p className="text-red-400">{state.error}</p>}

      <div>
        <h2 className="text-lg font-semibold mb-4">Acessos atuais</h2>
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-900">
              <tr>
                <th className="text-left p-3 font-medium">Cliente</th>
                <th className="text-left p-3 font-medium">Conteúdo</th>
                <th className="text-right p-3 font-medium">Ação</th>
              </tr>
            </thead>
            <tbody>
              {currentAccess.map((a) => {
                const client = clients.find((c) => c.id === a.client_id);
                const group = groups.find((g) => g.id === a.content_group_id);
                return (
                  <tr key={a.id} className="border-t border-zinc-800">
                    <td className="p-3">{client?.name ?? a.client_id}</td>
                    <td className="p-3">{group?.title ?? a.content_group_id}</td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeAccess(a.id)}
                        className="text-red-400 hover:underline text-sm"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {currentAccess.length === 0 && (
            <p className="p-6 text-zinc-500 text-center">Nenhum acesso atribuído.</p>
          )}
        </div>
      </div>
    </div>
  );
}
