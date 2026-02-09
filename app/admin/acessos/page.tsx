import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AcessosForm from "./acessos-form";

export default async function AdminAcessosPage() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, tenant_id")
    .eq("id", (await supabase.auth.getUser()).data.user?.id)
    .single();

  let clientsQuery = supabase.from("clients").select("id, name, slug").order("name");
  if (profile?.role === "tenant_admin" && profile.tenant_id) {
    clientsQuery = clientsQuery.eq("tenant_id", profile.tenant_id);
  }
  const { data: clients } = await clientsQuery;

  let groupsQuery = supabase.from("content_groups").select("id, title, slug").order("sort_order");
  if (profile?.role === "tenant_admin" && profile.tenant_id) {
    groupsQuery = groupsQuery.eq("tenant_id", profile.tenant_id);
  }
  const { data: groups } = await groupsQuery;

  const { data: accessList } = await supabase
    .from("client_content_access")
    .select("id, client_id, content_group_id");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Atribuir acessos</h1>
      <p className="text-zinc-400 mb-8">
        Vincule um cliente a um conteúdo para que os membros desse cliente possam acessar as aulas.
      </p>
      <AcessosForm
        clients={clients ?? []}
        groups={groups ?? []}
        currentAccess={accessList ?? []}
      />
    </div>
  );
}
