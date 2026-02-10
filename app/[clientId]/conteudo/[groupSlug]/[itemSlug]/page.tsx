import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getClientBySlug } from "@/lib/client-resolver";
import Link from "next/link";
import AulaClient from "./aula-client";

export default async function AulaPage({
  params,
}: {
  params: Promise<{ clientId: string; groupSlug: string; itemSlug: string }>;
}) {
  const { clientId, groupSlug, itemSlug } = await params;
  const client = await getClientBySlug(clientId);
  if (!client) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Modo teste: sem bloqueio de login
  // if (!user) redirect(`/${clientId}/login`);

  const { data: group } = await supabase
    .from("content_groups")
    .select("id, title")
    .eq("slug", groupSlug)
    .single();

  if (!group) notFound();

  const { data: item } = await supabase
    .from("content_items")
    .select("*")
    .eq("content_group_id", group.id)
    .eq("slug", itemSlug)
    .single();

  if (!item) notFound();

  const { data: progress } = user
    ? await supabase
        .from("user_lesson_progress")
        .select("completed, student_notes")
        .eq("user_id", user.id)
        .eq("content_item_id", item.id)
        .single()
    : { data: null };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href={`/${clientId}/conteudo?grupo=${groupSlug}`}
        className="text-zinc-400 hover:text-white text-sm mb-4 inline-block"
      >
        ← Voltar ao conteúdo
      </Link>
      <h1 className="text-2xl font-bold mb-6">{item.title}</h1>

      {item.type === "video" && item.video_url && (
        <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden mb-6">
          {item.video_url.includes("youtube.com") || item.video_url.includes("youtu.be") ? (
            <iframe
              className="w-full h-full"
              src={
                item.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
              }
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={item.video_url} controls className="w-full h-full" />
          )}
        </div>
      )}

      {item.type === "text" && item.body && (
        <div
          className="prose prose-invert prose-zinc max-w-none mb-6 p-4 rounded-xl bg-zinc-900"
          dangerouslySetInnerHTML={{ __html: item.body }}
        />
      )}

      {item.instructor_notes && (
        <section className="mb-6 p-4 rounded-xl bg-amber-950/30 border border-amber-800/50">
          <h2 className="text-lg font-semibold text-amber-200 mb-2">Anotações do professor</h2>
          <p className="text-zinc-300 whitespace-pre-wrap">{item.instructor_notes}</p>
        </section>
      )}

      <AulaClient
        clientId={clientId}
        contentItemId={item.id}
        initialCompleted={progress?.completed ?? false}
        initialStudentNotes={progress?.student_notes ?? ""}
      />
    </div>
  );
}
