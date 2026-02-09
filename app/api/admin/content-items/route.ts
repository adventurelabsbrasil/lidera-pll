import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await supabase.from("profiles").select("role, tenant_id").eq("id", user.id).single();
  if (profile?.data?.role !== "tenant_admin" && profile?.data?.role !== "super_admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const content_group_id = body.content_group_id;
  if (!content_group_id) return NextResponse.json({ error: "content_group_id required" }, { status: 400 });

  const { data: group } = await supabase.from("content_groups").select("tenant_id").eq("id", content_group_id).single();
  if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });
  if (profile?.data?.role === "tenant_admin" && group.tenant_id !== profile?.data?.tenant_id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("content_items")
    .insert({
      content_group_id,
      title: body.title,
      slug: body.slug,
      type: body.type ?? "video",
      video_url: body.video_url ?? null,
      body: body.body ?? null,
      instructor_notes: body.instructor_notes ?? null,
      sort_order: body.sort_order ?? 0,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ id: data.id });
}
