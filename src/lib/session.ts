import { Prisma } from "@prisma/client";
import { DAY_PATTERN_A, DAY_PATTERN_B, MODULES } from "@/lib/constants";
import { selectAdaptiveQuestions } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { getOffDays } from "@/lib/settings";
import { pick, shuffle, startOfLocalDay } from "@/lib/utils";

export async function isOffDay(date = new Date()) {
  const offDays = await getOffDays();
  return offDays.includes(date.getDay());
}

export async function getTodaySessionStatus(userId: string) {
  const today = startOfLocalDay();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const session = await prisma.session.findFirst({
    where: { userId, sessionDate: { gte: today, lt: tomorrow } },
    include: { attempts: true }
  });
  return {
    isOffDay: await isOffDay(),
    session,
    canStart: !(await isOffDay()) && !session?.completed
  };
}

export function getDayPattern(date = new Date()) {
  return date.getDate() % 2 === 0 ? { name: "A", quotas: DAY_PATTERN_A } : { name: "B", quotas: DAY_PATTERN_B };
}

async function normalQuestions(userId: string, quotas: Record<string, number>) {
  const selected = [];
  const seen = await prisma.attempt.findMany({ where: { userId }, select: { questionId: true } });
  const seenIds = new Set(seen.map((attempt) => attempt.questionId));

  for (const module of MODULES) {
    const count = quotas[module.key] ?? 0;
    const fresh = await prisma.question.findMany({
      where: { module: module.key, id: { notIn: [...seenIds] } },
      take: count * 3
    });
    const fallback = fresh.length >= count ? [] : await prisma.question.findMany({ where: { module: module.key }, take: count * 3 });
    selected.push(...pick([...fresh, ...fallback], count));
  }
  return selected;
}

export async function startDailySession(userId: string) {
  const status = await getTodaySessionStatus(userId);
  if (status.isOffDay) throw new Error("Today is a rest day. No new questions are available today.");
  if (status.session?.completed) throw new Error("Daily session already completed.");
  if (status.session) return status.session;

  const pattern = getDayPattern();
  const dueSchedules = await prisma.questionSchedule.findMany({
    where: { userId, nextDueDate: { lte: new Date() } },
    take: 8
  });
  const dueQuestions = dueSchedules.length
    ? await prisma.question.findMany({ where: { id: { in: dueSchedules.map((item) => item.questionId) } } })
    : [];
  const normal = await normalQuestions(userId, pattern.quotas);
  const ai = await selectAdaptiveQuestions(userId, pattern.quotas.ai_selected);
  const byId = new Map([...dueQuestions, ...normal, ...ai].map((question) => [question.id, question]));
  let finalQuestions = shuffle([...byId.values()]).slice(0, 25);
  if (finalQuestions.length < 25) {
    const fillers = await prisma.question.findMany({ where: { id: { notIn: finalQuestions.map((q) => q.id) } }, take: 50 });
    finalQuestions = shuffle([...finalQuestions, ...pick(fillers, 25 - finalQuestions.length)]);
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const weekNumber = Math.min(4, Math.floor((Date.now() - user.createdAt.getTime()) / (86400000 * 7)) + 1);
  return prisma.session.create({
    data: {
      userId,
      sessionDate: startOfLocalDay(),
      weekNumber,
      dayPattern: pattern.name,
      questionIds: finalQuestions.map((question) => question.id)
    }
  });
}

export async function getSessionQuestion(sessionId: string, userId: string) {
  const session = await prisma.session.findFirstOrThrow({ where: { id: sessionId, userId } });
  const ids = session.questionIds as string[];
  const answeredCount = await prisma.attempt.count({ where: { sessionId } });
  const currentIndex = Math.min(Math.max(session.currentIndex, answeredCount), ids.length);
  const questionId = ids[currentIndex];
  if (!questionId) return null;
  const question = await prisma.question.findUniqueOrThrow({ where: { id: questionId } });
  const options = shuffle((question.options as Prisma.JsonArray).map(String).map((label, index) => ({ label, originalIndex: index })));
  return {
    session: { ...session, currentIndex },
    question: {
      id: question.id,
      module: question.module,
      subtopic: question.subtopic,
      difficulty: question.difficulty,
      conceptDepth: question.conceptDepth,
      question: question.question,
      options
    }
  };
}
