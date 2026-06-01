import { prisma } from "@/lib/prisma";
import { addActiveDays } from "@/lib/utils";
import { getOffDays } from "@/lib/settings";

export async function updateMasteryAfterAttempt(args: {
  userId: string;
  questionId: string;
  module: string;
  isCorrect: boolean;
}) {
  const mastery = await prisma.moduleMastery.upsert({
    where: { userId_module: { userId: args.userId, module: args.module } },
    create: {
      userId: args.userId,
      module: args.module,
      attemptsCount: 1,
      correctCount: args.isCorrect ? 1 : 0,
      masteryScore: args.isCorrect ? 100 : 0
    },
    update: {
      attemptsCount: { increment: 1 },
      correctCount: { increment: args.isCorrect ? 1 : 0 },
      lastUpdated: new Date()
    }
  });

  const attemptsCount = mastery.attemptsCount + 1;
  const correctCount = mastery.correctCount + (args.isCorrect ? 1 : 0);
  await prisma.moduleMastery.update({
    where: { userId_module: { userId: args.userId, module: args.module } },
    data: { masteryScore: (correctCount / attemptsCount) * 100 }
  });

  const offDays = await getOffDays();
  const currentSchedule = await prisma.questionSchedule.findUnique({
    where: { userId_questionId: { userId: args.userId, questionId: args.questionId } }
  });
  const timesCorrect = (currentSchedule?.timesCorrect ?? 0) + (args.isCorrect ? 1 : 0);
  const intervalDays = args.isCorrect
    ? timesCorrect >= 4
      ? 30
      : timesCorrect === 3
        ? 14
        : timesCorrect === 2
          ? 7
          : 3
    : 1;

  await prisma.questionSchedule.upsert({
    where: { userId_questionId: { userId: args.userId, questionId: args.questionId } },
    create: {
      userId: args.userId,
      questionId: args.questionId,
      nextDueDate: addActiveDays(new Date(), intervalDays, offDays),
      intervalDays,
      masteryLevel: args.isCorrect ? 25 : 0,
      lastSeen: new Date(),
      timesSeen: 1,
      timesCorrect: args.isCorrect ? 1 : 0
    },
    update: {
      nextDueDate: addActiveDays(new Date(), intervalDays, offDays),
      intervalDays,
      masteryLevel: Math.min(100, timesCorrect * 25),
      lastSeen: new Date(),
      timesSeen: { increment: 1 },
      timesCorrect
    }
  });
}
