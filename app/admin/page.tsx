import { redirect } from "next/navigation";
import { DistributionPieChart, MasteryBarChart } from "@/components/charts";
import { DepthExplanation } from "@/components/depth-explanation";
import { Card, Stat } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { adminDashboard } from "@/lib/dashboard";
import { getOffDays } from "@/lib/settings";
import { BookOpen, BrainCircuit, CalendarCheck, GraduationCap, ListChecks, Repeat2, Trophy } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { ActiveDaySettings } from "@/components/active-day-settings";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");
  const [data, offDays] = await Promise.all([adminDashboard(), getOffDays()]);

  return (
    <AdminShell title="Admin Dashboard" description="Question bank, student progress, active days, and AI performance.">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Students" value={data.totalStudents} icon={GraduationCap} />
        <Stat label="Questions" value={`${data.totalQuestions}/350`} icon={BookOpen} />
        <Stat label="Completed Sessions" value={data.completedSessions} icon={ListChecks} />
        <Stat label="Average Score" value={`${data.averageScore}%`} icon={Trophy} />
        <Stat label="Average Mastery" value={`${data.averageMastery}%`} icon={CalendarCheck} />
        <Stat label="AI Questions Asked" value={data.aiQuestionsAsked} icon={BrainCircuit} />
        <Stat label="AI Accuracy" value={`${data.aiAccuracy}%`} icon={BrainCircuit} />
        <Stat label="Due Reviews" value={data.dueReviews} icon={Repeat2} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-bold">Active Learning Days</h2>
          <ActiveDaySettings initialOffDays={offDays} />
        </Card>
        <Card><h2 className="mb-4 text-xl font-bold">Student Status</h2><DistributionPieChart data={data.statusData} /></Card>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card><h2 className="mb-4 text-xl font-bold">Question Distribution</h2><DistributionPieChart data={data.byModule} /></Card>
        <Card><h2 className="mb-4 text-xl font-bold">Difficulty Distribution</h2><MasteryBarChart data={data.byDifficulty} percent={false} /></Card>
        <Card><h2 className="mb-4 text-xl font-bold">Concept Depth</h2><MasteryBarChart data={data.byDepth} percent={false} /><DepthExplanation /></Card>
        <Card><h2 className="mb-4 text-xl font-bold">Score Bands</h2><MasteryBarChart data={data.scoreBands} percent={false} /></Card>
        <Card><h2 className="mb-4 text-xl font-bold">Weakest Concepts</h2><MasteryBarChart data={data.weakConcepts} percent={false} /></Card>
      </div>
    </AdminShell>
  );
}
