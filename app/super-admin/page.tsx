import Link from "next/link";

export default function SuperAdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Super Admin</h1>
      <p className="text-zinc-400 mb-8">
        Gestão de tenants e clientes (Adventure Labs).
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/super-admin/tenants"
          className="block p-6 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-700 transition"
        >
          <h2 className="text-lg font-semibold mb-2">Tenants</h2>
          <p className="text-zinc-400 text-sm">Criar e editar tenants (ex: Lidera).</p>
        </Link>
        <Link
          href="/super-admin/clientes"
          className="block p-6 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-700 transition"
        >
          <h2 className="text-lg font-semibold mb-2">Clientes</h2>
          <p className="text-zinc-400 text-sm">Criar e editar clientes por tenant.</p>
        </Link>
      </div>
    </div>
  );
}
