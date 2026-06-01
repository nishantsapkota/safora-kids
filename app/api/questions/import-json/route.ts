import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/utils";

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const questions = Array.isArray(body) ? body : body.questions;
  if (!Array.isArray(questions)) return jsonError("Expected a JSON array of questions.");
  for (const question of questions) {
    await prisma.question.upsert({ where: { id: question.id }, create: question, update: question });
  }
  return NextResponse.json({ imported: questions.length });
}
