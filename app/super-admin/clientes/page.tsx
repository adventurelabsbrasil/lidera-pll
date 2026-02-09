import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ClienteForm from "./cliente-form";

export default async function SuperAdminClientesPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, slug, tenant_id, tenants(name, slug)")
    .order("name");
  const { data: tenants } = await supabase.from("tenants").select("id, name, slug").order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>
      <p className="text-zinc-400 mb-8">Cadastro de clientes (organizações) por tenant.</p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Novo cliente</h2>
        <ClienteForm tenants={tenants ?? []} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Lista</h2>
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-900">
              <tr>
                <th className="text-left p-3 font-medium">Nome</th>
                <th className="text-left p-3 font-medium">Slug</th>
                <th className="text-left p-3 font-medium">Tenant</th>
                <th className="text-left p-3 font-medium">URL área</th>
              </tr>
            </thead>
            <tbody>
              {(clients ?? []).map((c) => {
                const t = (c as unknown as { tenants: { name: string; slug: string } | { name: string; slug: string }[] | null }).tenants;
                const tenant = Array.isArray(t) ? t[0] : t;
                return (
                  <tr key={c.id} className="border-t border-zinc-800">
                    <td className="p-3">{c.name}</td>
                    <td className="p-3 text-zinc-400">{c.slug}</td>
                    <td className="p-3 text-zinc-400">{tenant?.name ?? c.tenant_id}</td>
                    <td className="p-3">
                      <Link href={`/${c.slug}`} className="text-blue-400 hover:underline text-sm">
                        /{c.slug}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(!clients || clients.length === 0) && (
            <p className="p-6 text-zinc-500 text-center">Nenhum cliente.</p>
          )}
        </div>
      </section>
    </div>
  );
}
