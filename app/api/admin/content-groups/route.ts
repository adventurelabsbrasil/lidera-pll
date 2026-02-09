import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await supabase.from("profiles").select("role, tenant_id").eq("id", user.id).single();
  const role = profile?.data?.role;
  const tenantId = profile?.data?.tenant_id;
  if (role !== "tenant_admin" && role !== "super_admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const tenant_id = body.tenant_id ?? tenantId;
  if (!tenant_id) return NextResponse.json({ error: "tenant_id required" }, { status: 400 });
  if (role === "tenant_admin" && tenant_id !== tenantId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("content_groups")
    .insert({
      tenant_id,
      title: body.title,
      slug: body.slug,
      cover_url: body.cover_url ?? null,
      description: body.description ?? null,
      sort_order: body.sort_order ?? 0,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ id: data.id });
}
