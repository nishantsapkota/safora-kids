import { redirect } from "next/navigation";
import { Award, CalendarDays, Star, Target } from "lucide-react";
import { MasteryBarChart, ScoreLineChart } from "@/components/charts";
import { DepthExplanation } from "@/components/depth-explanation";
import { ButtonLink, Card, ProgressBar, Stat } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { userDashboard } from "@/lib/dashboard";
import { getTodaySessionStatus } from "@/lib/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "admin") redirect("/admin");
  const [dashboard, status] = await Promise.all([userDashboard(user.id), getTodaySessionStatus(user.id)]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.studentId}</h1>
          <p className="mt-1 text-slate-600">Week {user.currentWeek} adaptive learning dashboard</p>
        </div>
        {status.isOffDay ? (
          <span className="rounded-md bg-orange-50 px-4 py-3 font-semibold text-orange-700">Today is a rest day.</span>
        ) : (
          <ButtonLink href="/session" className="bg-safety-green text-white">Start Today’s Session</ButtonLink>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Total XP" value={dashboard.user.totalXp} icon={Star} />
        <Stat label="Overall Mastery" value={`${dashboard.overallMastery}%`} icon={Target} />
        <Stat label="Last Score" value={dashboard.lastSession ? `${Math.round(dashboard.lastSession.scorePercent)}%` : "None"} icon={CalendarDays} />
        <Stat label="Pass Status" value={dashboard.user.passed ? "Passed" : "Learning"} icon={Award} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-bold">Module Mastery</h2>
          <MasteryBarChart data={dashboard.masteryData} />
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-bold">Weekly Score Trend</h2>
          <ScoreLineChart data={dashboard.scoreData} />
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-bold">Question Depth Progress</h2>
          <MasteryBarChart data={dashboard.depthData} />
          <DepthExplanation />
        </Card>
        <Card>
          <h2 className="text-xl font-bold">Badges</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {dashboard.earnedBadges.length ? dashboard.earnedBadges.map((badge) => (
              <div key={badge} className="rounded-md bg-green-50 px-3 py-3 font-semibold text-green-700">{badge}</div>
            )) : <p className="text-slate-600">Earn badges by reaching 85% mastery in modules.</p>}
          </div>
          <h3 className="mt-6 font-bold">XP Progress</h3>
          <div className="mt-2"><ProgressBar value={dashboard.user.totalXp % 100} /></div>
          <h3 className="mt-6 font-bold">Weak Topics</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {dashboard.weakTopics.length ? dashboard.weakTopics.map((topic) => (
              <span key={topic} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{topic}</span>
            )) : <span className="text-slate-600">No weak topics yet.</span>}
          </div>
        </Card>
      </div>
    </div>
  );
}
