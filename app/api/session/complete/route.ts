import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const user = await requireUser();
  const session = await prisma.session.findFirst({ where: { userId: user.id }, orderBy: { sessionDate: "desc" } });
  return NextResponse.json({ session });
}
