import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminConteudosPage() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id, role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id)
    .single();

  let query = supabase.from("content_groups").select("id, title, slug, cover_url, sort_order").order("sort_order");
  if (profile?.role === "tenant_admin" && profile.tenant_id) {
    query = query.eq("tenant_id", profile.tenant_id);
  }
  const { data: groups } = await query;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Conteúdos</h1>
        <Link
          href="/admin/conteudos/novo"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium"
        >
          Novo conteúdo
        </Link>
      </div>
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-900">
            <tr>
              <th className="text-left p-3 font-medium">Capa</th>
              <th className="text-left p-3 font-medium">Título</th>
              <th className="text-left p-3 font-medium">Slug</th>
              <th className="text-left p-3 font-medium">Ordem</th>
              <th className="text-right p-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(groups ?? []).map((g) => (
              <tr key={g.id} className="border-t border-zinc-800 hover:bg-zinc-900/50">
                <td className="p-3">
                  {g.cover_url ? (
                    <img src={g.cover_url} alt="" className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <span className="text-zinc-500">—</span>
                  )}
                </td>
                <td className="p-3 font-medium">{g.title}</td>
                <td className="p-3 text-zinc-400 text-sm">{g.slug}</td>
                <td className="p-3 text-zinc-400">{g.sort_order}</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/conteudos/${g.id}`}
                    className="text-blue-400 hover:underline mr-3"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!groups || groups.length === 0) && (
          <p className="p-6 text-zinc-500 text-center">Nenhum conteúdo cadastrado.</p>
        )}
      </div>
    </div>
  );
}
