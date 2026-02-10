import { createClient } from "@/lib/supabase/server";
import { getClientBySlug } from "@/lib/client-resolver";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

export const dynamic = "force-dynamic";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = await getClientBySlug(clientId);

  if (!client) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-xl font-bold text-red-400">Cliente não encontrado</h1>
        <p className="text-gray-400 mt-2">Verifique a URL ou entre em contato.</p>
        <Link href="/" className="mt-4 text-blue-400 hover:underline">
          Voltar ao início
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
        <Link href={`/${clientId}`} className="font-semibold">
          {client.name}
        </Link>
        {user ? (
          <nav className="flex gap-4">
            <Link href={`/${clientId}`} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              Início
            </Link>
            <Link href={`/${clientId}/conteudos-adquiridos`} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              Conteúdos
            </Link>
            <Link href={`/${clientId}/conteudo`} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              Aulas
            </Link>
            <Link href={`/${clientId}/perfil`} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              Perfil
            </Link>
            <SignOutButton />
          </nav>
        ) : (
          <Link
            href={`/${clientId}/login`}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Entrar
          </Link>
        )}
      </header>
      <main className="p-4 md:p-6 bg-zinc-50 dark:bg-zinc-950">{children}</main>
    </div>
  );
}
