import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorization";
import { studentCreateSchema } from "@/lib/validation";

// GET /api/students : Lister les étudiants
export async function GET() {
  const auth = await requireRole(["ADMIN", "ENSEIGNANT", "ETUDIANT"]);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Si c'est un étudiant, il ne consulte que ses propres données
  if (auth.user.role === "ETUDIANT") {
    const me = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return NextResponse.json(me ? [me] : []);
  }

  // ADMIN et ENSEIGNANT ont accès à la liste complète des étudiants
  const students = await prisma.user.findMany({
    where: { role: "ETUDIANT" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(students);
}

// POST /api/students : Création réservée exclusivement à l'ADMIN
export async function POST(req: Request) {
  const auth = await requireRole(["ADMIN"]);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json().catch(() => null);
  const parsed = studentCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);
  const student = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      role: "ETUDIANT",
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json(student, { status: 201 });
}