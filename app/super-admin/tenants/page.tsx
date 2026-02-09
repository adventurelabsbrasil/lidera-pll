import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import TenantForm from "./tenant-form";

export default async function SuperAdminTenantsPage() {
  const supabase = await createClient();
  const { data: tenants } = await supabase.from("tenants").select("id, name, slug").order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tenants</h1>
      <p className="text-zinc-400 mb-8">Cadastro de tenants (ex: Lidera).</p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Novo tenant</h2>
        <TenantForm />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Lista</h2>
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-900">
              <tr>
                <th className="text-left p-3 font-medium">Nome</th>
                <th className="text-left p-3 font-medium">Slug</th>
              </tr>
            </thead>
            <tbody>
              {(tenants ?? []).map((t) => (
                <tr key={t.id} className="border-t border-zinc-800">
                  <td className="p-3">{t.name}</td>
                  <td className="p-3 text-zinc-400">{t.slug}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!tenants || tenants.length === 0) && (
            <p className="p-6 text-zinc-500 text-center">Nenhum tenant.</p>
          )}
        </div>
      </section>
    </div>
  );
}
