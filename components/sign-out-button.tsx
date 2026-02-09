"use client";

import { signOut } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await signOut();
        router.push("/");
        router.refresh();
      }}
      className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm"
    >
      Sair
    </button>
  );
}
