import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getClientBySlug } from "@/lib/client-resolver";
import LoginForm from "./login-form";

export default async function LoginPage({
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

  if (user) {
    redirect(`/${clientId}`);
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-2">Entrar</h1>
      <p className="text-zinc-400 mb-8">{client.name} - Área de membros</p>
      <LoginForm clientId={clientId} />
    </div>
  );
}
