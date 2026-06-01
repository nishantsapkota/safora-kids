import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const student = await prisma.user.findUnique({
    where: { id },
    include: { masteries: true, sessions: true, attempts: { include: { question: true } } }
  });
  return NextResponse.json({ student });
}
