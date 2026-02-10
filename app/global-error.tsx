"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 24, fontFamily: "system-ui", background: "#0a0a0a", color: "#ededed" }}>
        <h1 style={{ fontSize: "1.25rem" }}>Erro no carregamento</h1>
        <p style={{ color: "#a1a1aa", marginTop: 8, maxWidth: 400 }}>
          {error.message || "Erro inesperado. Se acabou de adicionar variáveis de ambiente na Vercel, faça um novo deploy (Deployments → Redeploy)."}
        </p>
        <button
          onClick={() => reset()}
          style={{ marginTop: 16, padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
        >
          Tentar de novo
        </button>
        <br />
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error substitui root, Link pode não estar disponível */}
        <a href="/" style={{ marginTop: 16, display: "inline-block", color: "#a1a1aa", fontSize: 14 }}>
          Voltar ao início
        </a>
      </body>
    </html>
  );
}
