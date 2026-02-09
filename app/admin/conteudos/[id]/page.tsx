import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import EditGroupForm from "./edit-group-form";

export default async function AdminConteudoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, tenant_id")
    .eq("id", (await supabase.auth.getUser()).data.user?.id)
    .single();

  const { data: group } = await supabase
    .from("content_groups")
    .select("*")
    .eq("id", id)
    .single();

  if (!group) notFound();
  if (profile?.role === "tenant_admin" && group.tenant_id !== profile.tenant_id) redirect("/admin");

  const { data: items } = await supabase
    .from("content_items")
    .select("id, title, slug, type, sort_order")
    .eq("content_group_id", id)
    .order("sort_order");

  return (
    <div>
      <Link href="/admin/conteudos" className="text-zinc-400 hover:text-white text-sm mb-4 inline-block">
        ← Conteúdos
      </Link>
      <h1 className="text-2xl font-bold mb-6">Editar conteúdo: {group.title}</h1>
      <EditGroupForm group={group} />
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Aulas / itens</h2>
          <Link
            href={`/admin/conteudos/${id}/itens/novo`}
            className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-sm"
          >
            Nova aula
          </Link>
        </div>
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-900">
              <tr>
                <th className="text-left p-3 font-medium">Título</th>
                <th className="text-left p-3 font-medium">Slug</th>
                <th className="text-left p-3 font-medium">Tipo</th>
                <th className="text-left p-3 font-medium">Ordem</th>
                <th className="text-right p-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {(items ?? []).map((item) => (
                <tr key={item.id} className="border-t border-zinc-800">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3 text-zinc-400 text-sm">{item.slug}</td>
                  <td className="p-3 text-zinc-400">{item.type}</td>
                  <td className="p-3 text-zinc-400">{item.sort_order}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/conteudos/${id}/itens/${item.id}`}
                      className="text-blue-400 hover:underline text-sm"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!items || items.length === 0) && (
            <p className="p-6 text-zinc-500 text-center">Nenhuma aula. Adicione uma aula.</p>
          )}
        </div>
      </section>
    </div>
  );
}
