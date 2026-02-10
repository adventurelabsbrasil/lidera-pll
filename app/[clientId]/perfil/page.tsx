import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getClientBySlug } from "@/lib/client-resolver";
import PerfilForm from "./perfil-form";

export default async function PerfilPage({
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
  // Modo teste: perfil exige login; depois reativar redirect quando configurar acessos
  if (!user) redirect(`/${clientId}/login`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: prefs } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Perfil e preferências</h1>
      <PerfilForm
        clientId={clientId}
        profile={profile ?? undefined}
        preferences={prefs ?? undefined}
      />
    </div>
  );
}
