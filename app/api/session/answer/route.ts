import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { updateMasteryAfterAttempt } from "@/lib/mastery";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/utils";

const schema = z.object({
  sessionId: z.string(),
  questionId: z.string(),
  selectedAnswer: z.number(),
  shownOptions: z.array(z.object({ label: z.string(), originalIndex: z.number() }))
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return jsonError("Invalid answer payload.");
    const { sessionId, questionId, selectedAnswer, shownOptions } = parsed.data;
    const session = await prisma.session.findFirstOrThrow({ where: { id: sessionId, userId: user.id } });
    if (session.completed) return jsonError("Session already completed.");
    const question = await prisma.question.findUniqueOrThrow({ where: { id: questionId } });
    const isCorrect = selectedAnswer === question.correctAnswer;
    await prisma.attempt.create({
      data: { userId: user.id, sessionId, questionId, selectedAnswer, isCorrect, shownOptions }
    });
    await updateMasteryAfterAttempt({ userId: user.id, questionId, module: question.module, isCorrect });
    const answeredCount = await prisma.attempt.count({ where: { sessionId } });
    const correctCount = await prisma.attempt.count({ where: { sessionId, isCorrect: true } });
    const completed = answeredCount >= session.totalQuestions;
    const scorePercent = completed ? (correctCount / session.totalQuestions) * 100 : session.scorePercent;
    const xp = (isCorrect ? 10 : 0) + (completed ? 50 : 0) + (completed && scorePercent >= 90 ? 100 : 0);
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        currentIndex: { increment: 1 },
        correctCount,
        wrongCount: answeredCount - correctCount,
        completed,
        scorePercent
      }
    });
    if (xp > 0) await prisma.user.update({ where: { id: user.id }, data: { totalXp: { increment: xp } } });
    return NextResponse.json({
      feedback: {
        isCorrect,
        correctAnswer: (question.options as string[])[question.correctAnswer],
        explanation: question.explanation
      }
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to save answer.", 400);
  }
}
