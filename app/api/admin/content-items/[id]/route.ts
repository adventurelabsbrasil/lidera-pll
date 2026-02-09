import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await supabase.from("profiles").select("role, tenant_id").eq("id", user.id).single();
  if (profile?.data?.role !== "tenant_admin" && profile?.data?.role !== "super_admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: item } = await supabase.from("content_items").select("content_group_id").eq("id", id).single();
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: group } = await supabase.from("content_groups").select("tenant_id").eq("id", item.content_group_id).single();
  if (profile?.data?.role === "tenant_admin" && group?.tenant_id !== profile?.data?.tenant_id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { error } = await supabase
    .from("content_items")
    .update({
      title: body.title,
      slug: body.slug,
      type: body.type,
      video_url: body.video_url ?? null,
      body: body.body ?? null,
      instructor_notes: body.instructor_notes ?? null,
      sort_order: body.sort_order ?? 0,
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
