import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import EditItemForm from "./edit-item-form";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const { id: groupId, itemId } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("content_items")
    .select("*")
    .eq("id", itemId)
    .eq("content_group_id", groupId)
    .single();
  if (!item) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, tenant_id")
    .eq("id", (await supabase.auth.getUser()).data.user?.id)
    .single();
  const { data: group } = await supabase.from("content_groups").select("tenant_id, title").eq("id", groupId).single();
  if (!group) notFound();
  if (profile?.role === "tenant_admin" && group.tenant_id !== profile.tenant_id) redirect("/admin");

  return (
    <div>
      <Link href={`/admin/conteudos/${groupId}`} className="text-zinc-400 hover:text-white text-sm mb-4 inline-block">
        ← {group.title}
      </Link>
      <h1 className="text-2xl font-bold mb-6">Editar aula: {item.title}</h1>
      <EditItemForm groupId={groupId} item={item} />
    </div>
  );
}
