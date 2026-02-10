import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-950 text-zinc-100">
      <h1 className="text-2xl font-bold mb-4">PLL - Área de Membros</h1>
      <p className="text-zinc-400 mb-8 text-center max-w-md">
        Acesse sua área pela URL: <strong>/[clientId]</strong> (ex.: /demo para o cliente Demo).
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/demo"
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-center"
        >
          Área demo (cliente Demo)
        </Link>
        <Link
          href="/super-admin"
          className="px-5 py-2.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 font-medium text-center border border-zinc-600"
        >
          Super Admin
        </Link>
      </div>
    </main>
  );
}
