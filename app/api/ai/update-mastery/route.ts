import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { updateMasteryAfterAttempt } from "@/lib/mastery";

export async function POST(request: Request) {
  const user = await requireUser();
  const body = await request.json();
  await updateMasteryAfterAttempt({ userId: user.id, questionId: body.questionId, module: body.module, isCorrect: body.isCorrect });
  return NextResponse.json({ ok: true });
}
