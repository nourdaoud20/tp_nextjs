import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorization";
import { studentUpdateSchema } from "@/lib/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/students/[id] : Consultation d'un profil étudiant
export async function GET(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const targetId = Number(id);

  const auth = await requireRole(["ADMIN", "ENSEIGNANT", "ETUDIANT"]);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Prévention IDOR : un étudiant ne peut pas voir le profil d'un autre étudiant
  if (auth.user.role === "ETUDIANT" && auth.user.id !== targetId) {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  const student = await prisma.user.findUnique({
    where: { id: targetId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!student) {
    return NextResponse.json({ error: "Étudiant introuvable" }, { status: 404 });
  }

  return NextResponse.json(student);
}

// PATCH /api/students/[id] : Modification autorisée pour ADMIN et ENSEIGNANT
export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const targetId = Number(id);

  const auth = await requireRole(["ADMIN", "ENSEIGNANT"]);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json().catch(() => null);
  const parsed = studentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { id: targetId },
    data: parsed.data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json(updated);
}

// DELETE /api/students/[id] : Suppression réservée à l'ADMIN
export async function DELETE(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const targetId = Number(id);

  const auth = await requireRole(["ADMIN"]);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await prisma.user.delete({ where: { id: targetId } });
  return NextResponse.json({ ok: true });
}