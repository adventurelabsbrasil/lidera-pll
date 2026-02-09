import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function getProfileServer(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return data as Profile | null;
}

export async function requireProfile(): Promise<Profile> {
  const profile = await getProfileServer();
  if (!profile) throw new Error("Unauthorized");
  return profile;
}
