import { NextResponse } from "next/server";
import { z } from "zod";
import { setAuthCookie, signToken, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/utils";

const schema = z.object({ studentId: z.string().min(1), password: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Student ID and password are required.");
  const user = await prisma.user.findUnique({ where: { studentId: parsed.data.studentId } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) return jsonError("Invalid login.", 401);
  await setAuthCookie(await signToken(user));
  return NextResponse.json({ ok: true });
}
