"use client";

import { useActionState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { setThemeInStorage } from "@/components/theme-provider";

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
};
type Prefs = {
  theme: string;
  notifications_enabled: boolean;
  organization_logo_url: string | null;
};

export default function PerfilForm({
  clientId,
  profile,
  preferences,
}: {
  clientId: string;
  profile?: Profile;
  preferences?: Prefs;
}) {
  const router = useRouter();

  async function savePreferences(_prev: unknown, formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false };
    const theme = (formData.get("theme") as string) || "system";
    const notifications = formData.get("notifications") === "on";
    const fullName = (formData.get("full_name") as string) || null;

    await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
    await supabase.from("user_preferences").upsert(
      { user_id: user.id, theme, notifications_enabled: notifications },
      { onConflict: "user_id" }
    );

    setThemeInStorage(theme as "light" | "dark" | "system");
    router.refresh();
    return { ok: true };
  }

  const [state, formAction] = useActionState(savePreferences, { ok: false });

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-zinc-300 mb-1">
          Nome completo
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={profile?.full_name ?? ""}
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        />
      </div>
      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-zinc-300 mb-1">
          Tema
        </label>
        <select
          id="theme"
          name="theme"
          defaultValue={preferences?.theme ?? "system"}
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        >
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
          <option value="system">Sistema</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="notifications"
          name="notifications"
          type="checkbox"
          defaultChecked={preferences?.notifications_enabled ?? true}
          className="rounded border-zinc-600 bg-zinc-800 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="notifications" className="text-sm text-zinc-300">
          Receber notificações
        </label>
      </div>
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium"
      >
        Salvar
      </button>
    </form>
  );
}
