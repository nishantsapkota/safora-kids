import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import { MODULES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/utils";

const schema = z.object({
  studentId: z.string().min(3),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  ageGroup: z.enum(["6-8", "9-11", "12-14"])
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("Please enter a valid Student ID, password, and age group.");
  const { studentId, password, confirmPassword, ageGroup } = parsed.data;
  if (password !== confirmPassword) return jsonError("Passwords do not match.");
  const exists = await prisma.user.findUnique({ where: { studentId } });
  if (exists) return jsonError("Student ID already exists.");
  const user = await prisma.user.create({
    data: {
      studentId,
      passwordHash: await hashPassword(password),
      ageGroup,
      role: studentId.toLowerCase() === "admin" ? "admin" : "student",
      masteries: { create: MODULES.map((module) => ({ module: module.key })) }
    }
  });
  await setAuthCookie(await signToken(user));
  return NextResponse.json({ ok: true });
}
