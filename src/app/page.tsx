import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          TP Authentification Full Stack
        </h1>
        <p className="text-gray-600 mb-8">
          Next.js 15 · Prisma 7 · SQLite · Jose · Zod
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-lg border border-gray-300 shadow-sm transition"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </main>
  );
}