import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin();
  const students = await prisma.user.findMany({
    where: { role: "student" },
    include: { masteries: true, sessions: { orderBy: { sessionDate: "desc" }, take: 1 } }
  });
  return NextResponse.json({ students });
}
