import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">PLL - Área de Membros</h1>
      <p className="text-gray-400 mb-6">
        Acesse sua área usando a URL: /[clientId] (ex: /meu-cliente)
      </p>
      <Link
        href="/demo"
        className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Ir para área demo
      </Link>
    </main>
  );
}
