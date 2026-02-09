"use client";

import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

export async function signUp(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string | null;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName || undefined } },
  });
  if (error) {
    return { error: error.message };
  }
  return { error: null };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return profile;
}
