import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { MasteryBarChart, ScoreLineChart } from "@/components/charts";
import { Card, Stat } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { MODULES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { Award, BrainCircuit, CalendarDays, Repeat2, Star, Target } from "lucide-react";

export default async function AdminStudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");
  const { id } = await params;
  const student = await prisma.user.findUnique({
    where: { id },
    include: {
      masteries: true,
      sessions: { where: { completed: true }, orderBy: { sessionDate: "asc" } },
      attempts: { include: { question: true }, orderBy: { answeredAt: "desc" }, take: 200 }
    }
  });
  if (!student) redirect("/admin/students");

  const schedules = await prisma.questionSchedule.findMany({ where: { userId: student.id } });
  const aiLogs = await prisma.aiSelectionLog.findMany({ where: { userId: student.id }, orderBy: { createdAt: "desc" }, take: 10 });
  const masteryData = MODULES.map((module) => ({
    name: module.label,
    value: Math.round(student.masteries.find((item) => item.module === module.key)?.masteryScore ?? 0)
  }));
  const scoreData = student.sessions.map((session, index) => ({ name: `S${index + 1}`, score: Math.round(session.scorePercent) }));
  const depthData = [1, 2, 3, 4].map((depth) => {
    const depthAttempts = student.attempts.filter((attempt) => attempt.question.conceptDepth === depth);
    const correct = depthAttempts.filter((attempt) => attempt.isCorrect).length;
    return { name: `Depth ${depth}`, value: depthAttempts.length ? Math.round((correct / depthAttempts.length) * 100) : 0 };
  });
  const averageMastery = masteryData.length ? Math.round(masteryData.reduce((sum, item) => sum + item.value, 0) / masteryData.length) : 0;
  const latestScore = student.sessions.at(-1)?.scorePercent ?? 0;
  const weakConcepts = Object.entries(
    student.attempts
      .filter((attempt) => !attempt.isCorrect)
      .reduce<Record<string, number>>((acc, attempt) => {
        acc[attempt.question.masteryConcept] = (acc[attempt.question.masteryConcept] ?? 0) + 1;
        return acc;
      }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const retentionSuccess = schedules.length
    ? Math.round((schedules.filter((schedule) => schedule.timesSeen > 1 && schedule.timesCorrect >= 2).length / schedules.length) * 100)
    : 0;
  const insight =
    averageMastery >= 85 && latestScore >= 90
      ? "AI insight: this student shows stable mastery. Keep spaced review active to confirm retention."
      : weakConcepts.length
        ? `AI insight: prioritize ${weakConcepts[0][0].replaceAll("_", " ")} and related scenario questions next.`
        : "AI insight: not enough attempts yet. The system should ask baseline questions across all modules.";

  return (
    <AdminShell title={student.studentId} description="Student dashboard, mastery, session progress, and AI insights.">
      <div className="grid gap-4 md:grid-cols-5">
        <Stat label="Week" value={student.currentWeek} icon={CalendarDays} />
        <Stat label="XP" value={student.totalXp} icon={Star} />
        <Stat label="Latest Score" value={`${Math.round(latestScore)}%`} icon={Award} />
        <Stat label="Average Mastery" value={`${averageMastery}%`} icon={Target} />
        <Stat label="Retention Success" value={`${retentionSuccess}%`} icon={Repeat2} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card><h2 className="mb-4 text-xl font-bold">Module Mastery</h2><MasteryBarChart data={masteryData} /></Card>
        <Card><h2 className="mb-4 text-xl font-bold">Session Scores</h2><ScoreLineChart data={scoreData} /></Card>
        <Card><h2 className="mb-4 text-xl font-bold">Depth Performance</h2><MasteryBarChart data={depthData} /></Card>
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold"><BrainCircuit className="h-5 w-5 text-safety-blue" /> AI Insights</h2>
          <p className="leading-7 text-slate-700">{insight}</p>
          <h3 className="mt-5 font-bold">Weak Concepts</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {weakConcepts.length ? weakConcepts.map(([concept, count]) => (
              <span key={concept} className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-800">
                {concept.replaceAll("_", " ")} ({count})
              </span>
            )) : <span className="text-slate-600">No repeated weak concepts.</span>}
          </div>
          <h3 className="mt-5 font-bold">Recent AI Logs</h3>
          <div className="mt-3 space-y-2">
            {aiLogs.map((log) => (
              <div key={log.id} className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">{log.selectedReason}</div>
            ))}
            {!aiLogs.length ? <p className="text-sm text-slate-600">No AI logs yet.</p> : null}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
