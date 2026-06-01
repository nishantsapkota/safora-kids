import { MODULE_LABELS, MODULES, BADGES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function userDashboard(userId: string) {
  const [user, masteries, sessions, attempts] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.moduleMastery.findMany({ where: { userId } }),
    prisma.session.findMany({ where: { userId, completed: true }, orderBy: { sessionDate: "asc" } }),
    prisma.attempt.findMany({ where: { userId }, include: { question: true }, orderBy: { answeredAt: "desc" }, take: 100 })
  ]);

  const masteryData = MODULES.map((module) => ({
    name: module.label,
    value: Math.round(masteries.find((item) => item.module === module.key)?.masteryScore ?? 0)
  }));
  const scoreData = sessions.map((session, index) => ({ name: `S${index + 1}`, score: Math.round(session.scorePercent) }));
  const depthData = [1, 2, 3, 4].map((depth) => {
    const depthAttempts = attempts.filter((attempt) => attempt.question.conceptDepth === depth);
    const correct = depthAttempts.filter((attempt) => attempt.isCorrect).length;
    return { name: `Depth ${depth}`, value: depthAttempts.length ? Math.round((correct / depthAttempts.length) * 100) : 0 };
  });
  const wrongConcepts = attempts.filter((attempt) => !attempt.isCorrect).slice(0, 8).map((attempt) => attempt.question.masteryConcept);
  const weakTopics = [...new Set(wrongConcepts)].slice(0, 5);
  const earnedBadges = BADGES.filter((badge) => {
    if (badge.module === "overall") return user.passed;
    return (masteries.find((item) => item.module === badge.module)?.masteryScore ?? 0) >= 85;
  }).map((badge) => badge.name);

  return {
    user,
    masteryData,
    scoreData,
    depthData,
    weakTopics,
    earnedBadges,
    lastSession: sessions.at(-1),
    overallMastery: masteryData.length ? Math.round(masteryData.reduce((sum, item) => sum + item.value, 0) / masteryData.length) : 0
  };
}

export async function adminDashboard() {
  const [students, questions, sessions, attempts, aiLogs, schedules] = await Promise.all([
    prisma.user.findMany({ where: { role: "student" }, include: { masteries: true, sessions: { where: { completed: true }, orderBy: { sessionDate: "desc" }, take: 20 } } }),
    prisma.question.findMany(),
    prisma.session.findMany({ where: { completed: true } }),
    prisma.attempt.findMany({ include: { question: true } }),
    prisma.aiSelectionLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.questionSchedule.findMany()
  ]);

  const byModule: { name: string; value: number }[] = MODULES.map((module) => ({
    name: module.label,
    value: questions.filter((question) => question.module === module.key).length
  }));
  const aiPool = questions.filter((question) => question.module === "ai_adaptive_pool").length;
  if (aiPool) byModule.push({ name: "AI Pool", value: aiPool });
  const byDifficulty = ["easy", "medium", "hard"].map((name) => ({
    name,
    value: questions.filter((question) => question.difficulty === name).length
  }));
  const byDepth = [1, 2, 3, 4].map((depth) => ({
    name: `Depth ${depth}`,
    value: questions.filter((question) => question.conceptDepth === depth).length
  }));
  const weakConcepts = Object.entries(
    attempts
      .filter((attempt) => !attempt.isCorrect)
      .reduce<Record<string, number>>((acc, attempt) => {
        acc[attempt.question.masteryConcept] = (acc[attempt.question.masteryConcept] ?? 0) + 1;
        return acc;
      }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));
  const passCount = students.filter((student) => student.passed).length;
  const failCount = students.filter((student) => student.isCompleted && !student.passed).length;
  const activeCount = students.filter((student) => !student.isCompleted).length;
  const averageScore = sessions.length
    ? Math.round(sessions.reduce((sum, session) => sum + session.scorePercent, 0) / sessions.length)
    : 0;
  const allMasteries = students.flatMap((student) => student.masteries);
  const averageMastery = allMasteries.length
    ? Math.round(allMasteries.reduce((sum, mastery) => sum + mastery.masteryScore, 0) / allMasteries.length)
    : 0;
  const aiQuestionIds = new Set(aiLogs.flatMap((log) => (Array.isArray(log.questionIds) ? log.questionIds.map(String) : [])));
  const aiAttempts = attempts.filter((attempt) => aiQuestionIds.has(attempt.questionId) || attempt.question.module === "ai_adaptive_pool");
  const aiAccuracy = aiAttempts.length
    ? Math.round((aiAttempts.filter((attempt) => attempt.isCorrect).length / aiAttempts.length) * 100)
    : 0;
  const retentionSuccess = schedules.length
    ? Math.round((schedules.filter((schedule) => schedule.timesSeen > 1 && schedule.timesCorrect >= 2).length / schedules.length) * 100)
    : 0;
  const statusData = [
    { name: "Passed", value: passCount },
    { name: "Failed", value: failCount },
    { name: "In progress", value: activeCount }
  ];
  const scoreBands = [
    { name: "90-100", value: sessions.filter((session) => session.scorePercent >= 90).length },
    { name: "75-89", value: sessions.filter((session) => session.scorePercent >= 75 && session.scorePercent < 90).length },
    { name: "Below 75", value: sessions.filter((session) => session.scorePercent < 75).length }
  ];

  return {
    students,
    totalStudents: students.length,
    totalQuestions: questions.length,
    completedSessions: sessions.length,
    averageScore,
    averageMastery,
    passCount,
    failCount,
    activeCount,
    aiQuestionsAsked: aiAttempts.length,
    aiAccuracy,
    retentionSuccess,
    dueReviews: schedules.filter((schedule) => schedule.nextDueDate <= new Date()).length,
    byModule,
    byDifficulty,
    byDepth,
    weakConcepts,
    statusData,
    scoreBands,
    aiReasonData: [
      { name: "low_mastery", value: aiLogs.length },
      { name: "repeated_mistakes", value: aiLogs.filter((log) => String(log.selectedReason).includes("mistakes")).length },
      { name: "due_review", value: aiLogs.filter((log) => String(log.selectedReason).includes("review")).length }
    ],
    moduleLabels: MODULE_LABELS
  };
}
