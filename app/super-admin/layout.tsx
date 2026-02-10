import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "super_admin") redirect("/admin");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      <aside className="w-56 border-r border-zinc-800 p-4 flex flex-col gap-2">
        <Link href="/super-admin" className="font-bold text-lg mb-4 text-amber-400">
          Super Admin
        </Link>
        <Link href="/super-admin" className="text-zinc-400 hover:text-white py-1">
          Dashboard
        </Link>
        <Link href="/super-admin/tenants" className="text-zinc-400 hover:text-white py-1">
          Tenants
        </Link>
        <Link href="/super-admin/clientes" className="text-zinc-400 hover:text-white py-1">
          Clientes
        </Link>
        <div className="mt-auto pt-4 border-t border-zinc-800">
          <Link href="/admin" className="text-zinc-500 hover:text-zinc-400 text-sm">
            ← Admin
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
