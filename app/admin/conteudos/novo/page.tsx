import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ConteudoGroupForm from "./conteudo-group-form";

export default async function NovoConteudoPage() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id, role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id)
    .single();

  if (profile?.role === "tenant_admin" && !profile.tenant_id) {
    redirect("/admin");
  }

  const tenantId = profile?.tenant_id ?? null;
  const { data: tenants } = await supabase.from("tenants").select("id, name");
  const tenantsList = profile?.role === "super_admin" ? (tenants ?? []) : [];

  return (
    <div>
      <Link href="/admin/conteudos" className="text-zinc-400 hover:text-white text-sm mb-4 inline-block">
        ← Conteúdos
      </Link>
      <h1 className="text-2xl font-bold mb-6">Novo conteúdo (grupo)</h1>
      <ConteudoGroupForm tenantId={tenantId} tenantsList={tenantsList} />
    </div>
  );
}
