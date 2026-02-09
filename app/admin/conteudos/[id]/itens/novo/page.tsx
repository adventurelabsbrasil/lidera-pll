import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ItemForm from "./item-form";

export default async function NovoItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = await params;
  const supabase = await createClient();
  const { data: group } = await supabase
    .from("content_groups")
    .select("id, title")
    .eq("id", groupId)
    .single();
  if (!group) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, tenant_id")
    .eq("id", (await supabase.auth.getUser()).data.user?.id)
    .single();
  const { data: groupFull } = await supabase.from("content_groups").select("tenant_id").eq("id", groupId).single();
  if (profile?.role === "tenant_admin" && groupFull?.tenant_id !== profile.tenant_id) redirect("/admin");

  return (
    <div>
      <Link href={`/admin/conteudos/${groupId}`} className="text-zinc-400 hover:text-white text-sm mb-4 inline-block">
        ← {group.title}
      </Link>
      <h1 className="text-2xl font-bold mb-6">Nova aula</h1>
      <ItemForm contentGroupId={groupId} />
    </div>
  );
}
