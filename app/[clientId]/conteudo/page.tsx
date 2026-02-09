import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getClientBySlug } from "@/lib/client-resolver";
import Link from "next/link";

export default async function ConteudoPage({
  params,
  searchParams,
}: {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ grupo?: string }>;
}) {
  const { clientId } = await params;
  const { grupo: grupoSlug } = await searchParams;
  const client = await getClientBySlug(clientId);
  if (!client) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${clientId}/login`);

  let groups: { id: string; title: string; slug: string; cover_url: string | null }[] = [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("client_id")
    .eq("id", user.id)
    .single();

  const effectiveClientId = profile?.client_id ?? client.id;

  const { data: access } = await supabase
    .from("client_content_access")
    .select("content_group_id, content_groups(id, title, slug, cover_url)")
    .eq("client_id", effectiveClientId);

  const allGroups = (access ?? []).flatMap((a) => {
    const g = (a as unknown as { content_groups: { id: string; title: string; slug: string; cover_url: string | null } | null | { id: string; title: string; slug: string; cover_url: string | null }[] }).content_groups;
    return Array.isArray(g) ? g : g ? [g] : [];
  });

  if (grupoSlug) {
    groups = allGroups.filter((g) => g.slug === grupoSlug);
    if (groups.length === 0) groups = allGroups;
  } else {
    groups = allGroups;
  }

  const group = groups[0];
  let items: { id: string; title: string; slug: string }[] = [];

  if (group) {
    const { data: itemsData } = await supabase
      .from("content_items")
      .select("id, title, slug")
      .eq("content_group_id", group.id)
      .order("sort_order", { ascending: true });
    items = (itemsData ?? []) as { id: string; title: string; slug: string }[];
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        {group ? group.title : "Conteúdo"}
      </h1>
      <p className="text-zinc-400 mb-8">
        {group
          ? "Selecione uma aula abaixo."
          : "Selecione um conteúdo em Conteúdos adquiridos."}
      </p>

      {groups.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {groups.map((g) => (
            <Link
              key={g.id}
              href={`/${clientId}/conteudo?grupo=${g.slug}`}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700"
            >
              {g.title}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.length === 0 ? (
          <p className="col-span-full text-zinc-500">
            {group ? "Nenhuma aula neste grupo ainda." : "Nenhum conteúdo disponível."}
          </p>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/${clientId}/conteudo/${group!.slug}/${item.slug}`}
              className="block rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition p-4"
            >
              <span className="font-medium line-clamp-2">{item.title}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
