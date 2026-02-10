import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
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
    .select("role, tenant_id")
    .eq("id", user.id)
    .single();

  const isTenantAdmin = profile?.role === "tenant_admin";
  const isSuperAdmin = profile?.role === "super_admin";
  if (!isTenantAdmin && !isSuperAdmin) redirect("/");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      <aside className="w-56 border-r border-zinc-800 p-4 flex flex-col gap-2">
        <Link href="/admin" className="font-bold text-lg mb-4">
          Admin PLL
        </Link>
        <Link href="/admin" className="text-zinc-400 hover:text-white py-1">
          Dashboard
        </Link>
        <Link href="/admin/conteudos" className="text-zinc-400 hover:text-white py-1">
          Conteúdos
        </Link>
        <Link href="/admin/acessos" className="text-zinc-400 hover:text-white py-1">
          Acessos
        </Link>
        {isSuperAdmin && (
          <>
            <span className="border-t border-zinc-800 my-2" />
            <Link href="/super-admin" className="text-amber-400 hover:text-amber-300 py-1">
              Super Admin
            </Link>
          </>
        )}
        <div className="mt-auto pt-4 border-t border-zinc-800">
          <Link href="/" className="text-zinc-500 hover:text-zinc-400 text-sm">
            ← Voltar ao site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
