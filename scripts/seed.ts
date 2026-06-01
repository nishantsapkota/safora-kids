import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { seedQuestions } from "../src/lib/seed-data";
import { prisma } from "../src/lib/prisma";
import { MODULES } from "../src/lib/constants";

const demoStudents = [
  { studentId: "Aarav Sharma", ageGroup: "9-11", sessions: 20, passed: true, score: 94 },
  { studentId: "Anisha Karki", ageGroup: "12-14", sessions: 20, passed: true, score: 92 },
  { studentId: "Bibek Gurung", ageGroup: "9-11", sessions: 20, passed: true, score: 95 },
  { studentId: "Srijana Tamang", ageGroup: "6-8", sessions: 20, passed: true, score: 91 },
  { studentId: "Nima Sherpa", ageGroup: "12-14", sessions: 20, passed: true, score: 96 },
  { studentId: "Pratiksha Rai", ageGroup: "9-11", sessions: 20, passed: true, score: 93 },
  { studentId: "Rohan Thapa", ageGroup: "12-14", sessions: 20, passed: true, score: 90 },
  { studentId: "Kiran Basnet", ageGroup: "9-11", sessions: 20, passed: false, score: 78 },
  { studentId: "Maya Magar", ageGroup: "6-8", sessions: 20, passed: false, score: 74 },
  { studentId: "Suman Adhikari", ageGroup: "12-14", sessions: 20, passed: false, score: 81 },
  { studentId: "Laxmi Khadka", ageGroup: "9-11", sessions: 16, passed: false, score: 87 },
  { studentId: "Pemba Lama", ageGroup: "6-8", sessions: 14, passed: false, score: 84 }
];

async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

function sessionDateFromIndex(index: number) {
  const date = new Date();
  date.setDate(date.getDate() - (24 - index));
  date.setHours(8, 0, 0, 0);
  return date;
}

async function resetDemoStudent(studentId: string) {
  const existing = await prisma.user.findUnique({ where: { studentId } });
  if (!existing) return;
  await prisma.questionSchedule.deleteMany({ where: { userId: existing.id } });
  await prisma.aiSelectionLog.deleteMany({ where: { userId: existing.id } });
  await prisma.user.delete({ where: { id: existing.id } });
}

async function seedDemoStudent(student: (typeof demoStudents)[number], questions: Awaited<ReturnType<typeof prisma.question.findMany>>, passwordHash: string) {
  await resetDemoStudent(student.studentId);
  const isCompleted = student.sessions >= 20;
  const created = await prisma.user.create({
    data: {
      studentId: student.studentId,
      passwordHash,
      ageGroup: student.ageGroup,
      currentWeek: student.sessions >= 16 ? 4 : 3,
      totalXp: student.sessions * 190 + (student.passed ? 500 : 120),
      isCompleted,
      passed: student.passed,
      masteries: {
        create: MODULES.map((module, index) => {
          const masteryScore = student.passed ? student.score + (index % 2) : Math.max(55, student.score - 10 - index * 2);
          const attemptsCount = 90 + index * 5;
          return {
            module: module.key,
            masteryScore,
            attemptsCount,
            correctCount: Math.round((masteryScore / 100) * attemptsCount)
          };
        })
      }
    }
  });

  for (let sessionIndex = 0; sessionIndex < student.sessions; sessionIndex += 1) {
    const selectedQuestions = Array.from({ length: 25 }, (_, offset) => questions[(sessionIndex * 11 + offset) % questions.length]);
    const scoreShift = sessionIndex % 5 === 0 ? -4 : sessionIndex % 4 === 0 ? 2 : 0;
    const scorePercent = Math.max(52, Math.min(100, student.score + scoreShift));
    const correctCount = Math.round((scorePercent / 100) * 25);
    const session = await prisma.session.create({
      data: {
        userId: created.id,
        sessionDate: sessionDateFromIndex(sessionIndex),
        weekNumber: Math.min(4, Math.floor(sessionIndex / 5) + 1),
        dayPattern: sessionIndex % 2 === 0 ? "A" : "B",
        totalQuestions: 25,
        correctCount,
        wrongCount: 25 - correctCount,
        scorePercent,
        completed: true,
        questionIds: selectedQuestions.map((question) => question.id),
        currentIndex: 25
      }
    });

    for (let attemptIndex = 0; attemptIndex < selectedQuestions.length; attemptIndex += 1) {
      const question = selectedQuestions[attemptIndex];
      const isCorrect = attemptIndex < correctCount;
      await prisma.attempt.create({
        data: {
          userId: created.id,
          sessionId: session.id,
          questionId: question.id,
          selectedAnswer: isCorrect ? question.correctAnswer : (question.correctAnswer + 1) % 4,
          isCorrect,
          responseTimeSec: 8 + ((sessionIndex + attemptIndex) % 18),
          shownOptions: question.options as Prisma.InputJsonValue
        }
      });
    }

    if (sessionIndex % 3 === 0) {
      await prisma.aiSelectionLog.create({
        data: {
          userId: created.id,
          sessionId: session.id,
          selectedReason: "Greedy heuristic selected weak concepts, due reviews, and depth-matched safety questions.",
          selectedModules: ["natural_disaster_preparedness", "household_occupational_hazards"],
          selectedConcepts: ["flood_safe_place", "electric_shock_safety"],
          questionIds: selectedQuestions.slice(0, 3).map((question) => question.id),
          strategyUsed: "rule_based_fallback"
        }
      });
    }
  }

  for (const question of questions.slice(0, 40)) {
    await prisma.questionSchedule.upsert({
      where: { userId_questionId: { userId: created.id, questionId: question.id } },
      create: {
        userId: created.id,
        questionId: question.id,
        nextDueDate: new Date(Date.now() + ((student.passed ? 3 : -1) * 86400000)),
        intervalDays: student.passed ? 7 : 1,
        masteryLevel: student.passed ? 75 : 35,
        lastSeen: new Date(Date.now() - 86400000),
        timesSeen: student.passed ? 3 : 2,
        timesCorrect: student.passed ? 3 : 1
      },
      update: {}
    });
  }
}

async function main() {
  const count = await seedQuestions();
  const passwordHash = await hashPassword("admin123");
  await prisma.user.upsert({
    where: { studentId: "admin" },
    create: {
      studentId: "admin",
      passwordHash,
      ageGroup: "12-14",
      role: "admin",
      masteries: { create: MODULES.map((module) => ({ module: module.key })) }
    },
    update: { role: "admin", passwordHash }
  });

  const questions = await prisma.question.findMany({ orderBy: { id: "asc" } });
  for (const student of demoStudents) {
    await seedDemoStudent(student, questions, await hashPassword("student123"));
  }

  console.log(`Seeded ${count} questions, admin/admin123, and ${demoStudents.length} demo students.`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
