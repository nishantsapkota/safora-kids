import { Question } from "@prisma/client";
import { MODULES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function selectAdaptiveQuestions(userId: string, count: number, sessionId?: string) {
  const masteries = await prisma.moduleMastery.findMany({ where: { userId } });
  const masteryByModule = new Map(masteries.map((item) => [item.module, item.masteryScore]));
  const schedules = await prisma.questionSchedule.findMany({ where: { userId } });
  const scheduleByQuestion = new Map(schedules.map((item) => [item.questionId, item]));
  const recentWrong = await prisma.attempt.findMany({
    where: { userId, isCorrect: false },
    include: { question: true },
    orderBy: { answeredAt: "desc" },
    take: 25
  });

  const wrongConcepts = new Set(recentWrong.map((attempt) => attempt.question.masteryConcept));
  const candidates = await prisma.question.findMany({ where: { aiEligible: true } });
  const now = new Date();

  const ranked = candidates
    .map((question) => {
      const mastery = masteryByModule.get(question.module) ?? 0;
      const schedule = scheduleByQuestion.get(question.id);
      const daysSinceLastSeen = schedule?.lastSeen
        ? Math.max(0, (now.getTime() - schedule.lastSeen.getTime()) / 86400000)
        : 14;
      const repeatPriority = wrongConcepts.has(question.masteryConcept) ? 100 : question.repeatPriority * 20;
      const difficultyMatch = mastery < 50 && question.difficulty === "easy" ? 100 : mastery < 75 ? 80 : 55;
      const priorityScore =
        (100 - mastery) * 0.45 +
        repeatPriority * 0.25 +
        Math.min(daysSinceLastSeen * 8, 100) * 0.15 +
        difficultyMatch * 0.15;
      return { question, priorityScore };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, count);

  const selected = ranked.map((item) => item.question);
  const modules = [...new Set(selected.map((question) => question.module))];
  const concepts = [...new Set(selected.map((question) => question.masteryConcept))];

  await prisma.aiSelectionLog.create({
    data: {
      userId,
      sessionId,
      selectedReason: "Greedy heuristic: low mastery, repeated mistakes, due review, and difficulty match.",
      selectedModules: modules,
      selectedConcepts: concepts,
      questionIds: selected.map((question) => question.id),
      strategyUsed: process.env.GEMINI_API_KEY ? "gemini_or_rule_fallback" : "rule_based_fallback"
    }
  });

  return selected;
}

export async function finalAssessment(userId: string) {
  const sessions = await prisma.session.findMany({
    where: { userId, completed: true },
    orderBy: { sessionDate: "desc" },
    take: 20
  });
  const masteries = await prisma.moduleMastery.findMany({ where: { userId } });
  const finalWeek = sessions.slice(0, 5);
  const finalAverage =
    finalWeek.length === 0 ? 0 : finalWeek.reduce((sum, session) => sum + session.scorePercent, 0) / finalWeek.length;
  const lastFiveAbove90 = finalWeek.filter((session) => session.scorePercent >= 90).length;
  const weakModules = MODULES.filter((module) => {
    const mastery = masteries.find((item) => item.module === module.key)?.masteryScore ?? 0;
    return mastery < 85;
  });
  const passed = finalAverage >= 90 && lastFiveAbove90 >= 4 && weakModules.length === 0;

  await prisma.user.update({
    where: { id: userId },
    data: { isCompleted: sessions.length >= 20, passed }
  });

  return {
    passed,
    finalScore: Math.round(finalAverage),
    status: passed ? "Safora Safety Champion" : "Review Recommended",
    summary: passed
      ? "The student has shown strong understanding across the safety modules."
      : "The student should continue reviewing weak modules before passing.",
    strengths: masteries.filter((item) => item.masteryScore >= 85).map((item) => item.module),
    needsReview: weakModules.map((module) => module.key)
  };
}
