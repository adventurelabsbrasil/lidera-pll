import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getClientBySlug } from "@/lib/client-resolver";
import Link from "next/link";

export default async function ConteudosAdquiridosPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = await getClientBySlug(clientId);
  if (!client) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Modo teste: sem bloqueio de login
  // if (!user) redirect(`/${clientId}/login`);

  let effectiveClientId = client.id;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("client_id, role")
      .eq("id", user.id)
      .single();
    effectiveClientId = profile?.client_id ?? client.id;
  }

  const { data: access } = await supabase
    .from("client_content_access")
    .select("content_group_id, content_groups(id, title, slug, cover_url)")
    .eq("client_id", effectiveClientId);

  const groups = (access ?? []).flatMap((a) => {
    const g = (a as unknown as { content_groups: { id: string; title: string; slug: string; cover_url: string | null } | null | { id: string; title: string; slug: string; cover_url: string | null }[] }).content_groups;
    return Array.isArray(g) ? g : g ? [g] : [];
  });

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Conteúdos adquiridos</h1>
      <p className="text-zinc-400 mb-8">
        Conteúdos que você tem direito a acessar.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {groups.length === 0 ? (
          <p className="col-span-full text-zinc-500">Nenhum conteúdo atribuído ainda.</p>
        ) : (
          groups.map((g) => (
            <Link
              key={g.id}
              href={`/${clientId}/conteudo?grupo=${g.slug}`}
              className="block rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
            >
              <div className="aspect-video bg-zinc-800">
                {g.cover_url ? (
                  <img src={g.cover_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 text-4xl">
                    📚
                  </div>
                )}
              </div>
              <div className="p-3">
                <span className="font-medium line-clamp-2">{g.title}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
