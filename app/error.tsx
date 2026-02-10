"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-950 text-zinc-100">
      <h1 className="text-xl font-bold mb-2">Algo deu errado</h1>
      <p className="text-zinc-400 text-center max-w-md mb-6">
        {error.message || "Erro ao carregar a página. Verifique se as variáveis de ambiente (Supabase) estão configuradas na Vercel e faça um novo deploy."}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
      >
        Tentar de novo
      </button>
      <Link href="/" className="mt-4 text-zinc-400 hover:text-white text-sm">
        Voltar ao início
      </Link>
    </div>
  );
}
