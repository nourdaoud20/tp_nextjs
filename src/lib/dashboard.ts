import { prisma } from "@/lib/prisma";

export interface DashboardStudent {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export interface DashboardData {
  role: string;
  userName: string;
  userEmail: string;
  userCreatedAt: Date;
  // KPIs (disponibles pour ADMIN et ENSEIGNANT)
  totalStudents: number;
  recentStudentsCount: number;
  // Liste des 5 derniers étudiants (ADMIN et ENSEIGNANT)
  latestStudents: DashboardStudent[];
}

export async function getDashboardData(userId: number): Promise<DashboardData | null> {
  // 1. Relire l'utilisateur et son rôle fiable depuis la base
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!currentUser) return null;

  // 2. Si c'est un ETUDIANT : accès limité uniquement à ses propres données personnelles
  if (currentUser.role === "ETUDIANT") {
    return {
      role: currentUser.role,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userCreatedAt: currentUser.createdAt,
      totalStudents: 0,
      recentStudentsCount: 0,
      latestStudents: [],
    };
  }

  // 3. Si ADMIN ou ENSEIGNANT : calcul des KPIs depuis la base de données
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalStudents, recentStudentsCount, latestStudents] = await Promise.all([
    // KPI 1 : Nombre total d'étudiants
    prisma.user.count({
      where: { role: "ETUDIANT" },
    }),

    // KPI 2 : Étudiants créés durant les 30 derniers jours
    prisma.user.count({
      where: {
        role: "ETUDIANT",
        createdAt: { gte: thirtyDaysAgo },
      },
    }),

    // Tableau : Les 5 derniers étudiants ajoutés (sans jamais exposer password)
    prisma.user.findMany({
      where: { role: "ETUDIANT" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    role: currentUser.role,
    userName: currentUser.name,
    userEmail: currentUser.email,
    userCreatedAt: currentUser.createdAt,
    totalStudents,
    recentStudentsCount,
    latestStudents,
  };
}