import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id)
    .single();

  const { count: groupsCount } = await supabase
    .from("content_groups")
    .select("*", { count: "exact", head: true });
  const { count: clientsCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });
  const { count: accessCount } = await supabase
    .from("client_content_access")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="text-zinc-400 mb-8">
        Área administrativa {profile?.role === "super_admin" ? "(Super Admin)" : "(Lidera)"}.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Conteúdos (grupos)</p>
          <p className="text-2xl font-bold mt-1">{groupsCount ?? 0}</p>
          <Link href="/admin/conteudos" className="text-blue-400 hover:underline text-sm mt-2 inline-block">
            Gerenciar →
          </Link>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Clientes</p>
          <p className="text-2xl font-bold mt-1">{clientsCount ?? 0}</p>
          {profile?.role === "super_admin" && (
            <Link href="/super-admin/clientes" className="text-blue-400 hover:underline text-sm mt-2 inline-block">
              Gerenciar →
            </Link>
          )}
        </div>
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <p className="text-zinc-400 text-sm">Acessos atribuídos</p>
          <p className="text-2xl font-bold mt-1">{accessCount ?? 0}</p>
          <Link href="/admin/acessos" className="text-blue-400 hover:underline text-sm mt-2 inline-block">
            Atribuir →
          </Link>
        </div>
      </div>
    </div>
  );
}
