import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDashboardData } from "@/lib/dashboard";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  // 1. Vérification de session côté serveur
  const session = await getSession();
  if (!session) redirect("/login");

  // 2. Récupération sécurisée des données filtrées par rôle
  const data = await getDashboardData(session.userId);
  if (!data) redirect("/login");

  const isStaff = data.role === "ADMIN" || data.role === "ENSEIGNANT";
  const recentPercentage =
    data.totalStudents > 0
      ? Math.round((data.recentStudentsCount / data.totalStudents) * 100)
      : 0;

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6 pt-12">
      {/* En-tête : Profil & Déconnexion */}
      <header className="flex flex-col justify-between gap-4 rounded-xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Bonjour, {data.userName}
            </h1>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
              {data.role}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{data.userEmail}</p>
        </div>
        <LogoutButton />
      </header>

      {/* VUE ÉTUDIANT : Informations personnelles uniquement */}
      {data.role === "ETUDIANT" && (
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            Mon espace étudiant
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Bienvenue sur votre espace personnel. Vos informations de compte sont à jour.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-gray-500">Nom complet</p>
              <p className="mt-1 font-semibold text-gray-900">{data.userName}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-gray-500">Date d&apos;inscription</p>
              <p className="mt-1 font-semibold text-gray-900">
                {new Date(data.userCreatedAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* VUE ADMIN & ENSEIGNANT : KPIs, Graphique et Tableau */}
      {isStaff && (
        <>
          {/* Cartes KPI */}
          <section className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Total Étudiants</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {data.totalStudents}
              </p>
              <p className="mt-1 text-xs text-gray-400">Inscrits en base de données</p>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Nouveaux (30 derniers jours)
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                +{data.recentStudentsCount}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {recentPercentage}% de l&apos;effectif total
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Périmètre d&apos;accès</p>
              <p className="mt-2 text-lg font-bold text-blue-700">
                {data.role === "ADMIN" ? "Gestion complète (CRUD)" : "Consultation & Suivi"}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {data.role === "ADMIN"
                  ? "Création, édition et suppression autorisées"
                  : "Lecture des effectifs et suivi pédagogique"}
              </p>
            </div>
          </section>

          {/* Graphique simple : Répartition Anciens vs Nouveaux (30j) */}
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800">
              Croissance des inscriptions (30 derniers jours)
            </h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs font-medium text-gray-600">
                <span>Nouveaux inscrits ({data.recentStudentsCount})</span>
                <span>{recentPercentage}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${recentPercentage}%` }}
                />
              </div>
            </div>
          </section>

          {/* Tableau : 5 derniers étudiants ajoutés */}
          <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="border-b px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800">
                5 derniers étudiants ajoutés
              </h2>
            </div>

            {data.latestStudents.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                Aucun étudiant enregistré pour le moment.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Nom</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Date d&apos;inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.latestStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-900">
                          #{student.id}
                        </td>
                        <td className="px-6 py-3 text-gray-800">{student.name}</td>
                        <td className="px-6 py-3 text-gray-600">{student.email}</td>
                        <td className="px-6 py-3 text-gray-500">
                          {new Date(student.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}