import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  // 1. Double protection côté serveur (défense en profondeur)
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // 2. Charger les informations de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <LogoutButton />
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Nom complet
            </span>
            <p className="text-lg font-medium text-gray-900">{user.name}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Adresse email
            </span>
            <p className="text-lg font-medium text-gray-900">{user.email}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Date d'inscription
            </span>
            <p className="text-sm text-gray-700">
              {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}