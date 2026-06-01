import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { selectAdaptiveQuestions } from "@/lib/ai";

export async function POST(request: Request) {
  const user = await requireUser();
  const body = await request.json().catch(() => ({}));
  const questions = await selectAdaptiveQuestions(user.id, Number(body.questionsNeeded ?? 3), body.sessionId);
  return NextResponse.json({ questionIds: questions.map((question) => question.id), questions });
}
