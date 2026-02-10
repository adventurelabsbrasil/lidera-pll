import { createClient } from "@/lib/supabase/server";
import { getClientBySlug } from "@/lib/client-resolver";
import Link from "next/link";

export default async function ClientWelcomePage({
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

  // Modo teste: sem bloqueio de login; depois reativar redirect quando configurar acessos
  // if (!user) redirect(`/${clientId}/login`);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Bem-vindo ao PLL</h1>
      <p className="text-zinc-400 mb-8">
        Programa Lucro e Liberdade - sua área exclusiva de conteúdo.
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Vídeo de boas-vindas</h2>
        <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Boas-vindas"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Atalhos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href={`/${clientId}/perfil`}
            className="block p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
          >
            <span className="font-medium">Perfil e preferências</span>
            <p className="text-sm text-zinc-400 mt-1">Foto, tema, notificações</p>
          </Link>
          <Link
            href={`/${clientId}/conteudo`}
            className="block p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
          >
            <span className="font-medium">Conteúdo</span>
            <p className="text-sm text-zinc-400 mt-1">Aulas e materiais</p>
          </Link>
          <Link
            href={`/${clientId}/conteudos-adquiridos`}
            className="block p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition"
          >
            <span className="font-medium">Conteúdos adquiridos</span>
            <p className="text-sm text-zinc-400 mt-1">O que você tem acesso</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
