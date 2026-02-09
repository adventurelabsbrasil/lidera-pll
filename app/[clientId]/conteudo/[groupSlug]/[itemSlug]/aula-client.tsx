"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AulaClient({
  clientId,
  contentItemId,
  initialCompleted,
  initialStudentNotes,
}: {
  clientId: string;
  contentItemId: string;
  initialCompleted: boolean;
  initialStudentNotes: string;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [notes, setNotes] = useState(initialStudentNotes);

  async function saveProgress() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("user_lesson_progress").upsert(
      {
        user_id: user.id,
        content_item_id: contentItemId,
        completed,
        student_notes: notes || null,
        completed_at: completed ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,content_item_id" }
    );
    router.refresh();
  }

  return (
    <section className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
      <h2 className="text-lg font-semibold mb-4">Suas anotações</h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={saveProgress}
        placeholder="Anotações da aula..."
        className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 min-h-[120px]"
      />
      <div className="flex items-center gap-3 mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => {
              setCompleted(e.target.checked);
              setTimeout(saveProgress, 0);
            }}
            className="rounded border-zinc-600 bg-zinc-800 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-zinc-300">Marquei como concluída esta aula</span>
        </label>
      </div>
      <button
        type="button"
        onClick={saveProgress}
        className="mt-3 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm"
      >
        Salvar anotações
      </button>
    </section>
  );
}
