import { createClient } from "@/lib/supabase/server";
import type { Client } from "@/types/database";

export async function getClientBySlug(clientSlug: string): Promise<Client | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("*")
    .eq("slug", clientSlug)
    .limit(1)
    .single();
  return data as Client | null;
}
