"use client";

export default function DashboardError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-md pt-24 text-center">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800">
          Erreur lors du chargement du tableau de bord
        </h2>
        <p className="mt-2 text-sm text-red-600">
          Impossible de récupérer les indicateurs depuis la base de données.
        </p>
        <button
          onClick={reset}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    </main>
  );
}