import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type Role = "ADMIN" | "ENSEIGNANT" | "ETUDIANT";

type AuthResult =
  | { ok: true; user: { id: number; name: string; email: string; role: string } }
  | { ok: false; status: 401 | 403; error: string };

export async function requireRole(allowedRoles: Role[]): Promise<AuthResult> {
  const session = await getSession();

  // 1. Vérifier la session
  if (!session) {
    return { ok: false, status: 401, error: "Non authentifié" };
  }

  // 2. Relire le rôle frais depuis la base de données
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    return { ok: false, status: 401, error: "Utilisateur introuvable" };
  }

  // 3. Contrôler les permissions
  if (!allowedRoles.includes(user.role as Role)) {
    return { ok: false, status: 403, error: "Accès interdit" };
  }

  return { ok: true, user };
}