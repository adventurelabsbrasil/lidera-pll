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
  const { client_id, content_group_id } = body;
  if (!client_id || !content_group_id)
    return NextResponse.json({ error: "client_id and content_group_id required" }, { status: 400 });

  const { data: client } = await supabase.from("clients").select("tenant_id").eq("id", client_id).single();
  const { data: group } = await supabase.from("content_groups").select("tenant_id").eq("id", content_group_id).single();
  if (!client || !group) return NextResponse.json({ error: "Client or group not found" }, { status: 404 });
  if (client.tenant_id !== group.tenant_id)
    return NextResponse.json({ error: "Client and group must belong to same tenant" }, { status: 400 });
  if (profile?.data?.role === "tenant_admin" && client.tenant_id !== profile?.data?.tenant_id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await supabase.from("client_content_access").insert({
    client_id,
    content_group_id,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await supabase.from("profiles").select("role, tenant_id").eq("id", user.id).single();
  if (profile?.data?.role !== "tenant_admin" && profile?.data?.role !== "super_admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await supabase.from("client_content_access").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
