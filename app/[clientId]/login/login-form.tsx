"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";

export default function LoginForm({ clientId }: { clientId: string }) {
  const router = useRouter();

  async function handleSubmit(_prev: unknown, formData: FormData) {
    const result = await signIn(formData);
    if (result.error) {
      return { error: result.error };
    }
    router.push(`/${clientId}`);
    router.refresh();
    return { error: null };
  }

  const [state, formAction] = useActionState(handleSubmit, { error: null as string | null });

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="seu@email.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      <button
        type="submit"
        className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium transition"
      >
        Entrar
      </button>
    </form>
  );
}
