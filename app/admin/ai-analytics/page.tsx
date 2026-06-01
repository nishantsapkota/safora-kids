import { redirect } from "next/navigation";
import { DistributionPieChart, MasteryBarChart } from "@/components/charts";
import { Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { adminDashboard } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin-shell";

export default async function AiAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");
  const [data, logs] = await Promise.all([
    adminDashboard(),
    prisma.aiSelectionLog.findMany({ orderBy: { createdAt: "desc" }, take: 20 })
  ]);

  return (
    <AdminShell title="AI Performance" description="How adaptive selection, spaced repetition, and mastery assessment are working.">
      <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="mb-4 text-xl font-bold">AI Assessment Summary</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Metric label="AI augmented questions asked" value={data.aiQuestionsAsked} />
            <Metric label="AI question accuracy" value={`${data.aiAccuracy}%`} />
            <Metric label="Spaced repetition success" value={`${data.retentionSuccess}%`} />
            <Metric label="Reviews due now" value={data.dueReviews} />
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-700">
            The tutor agent prioritizes low-mastery modules, repeated mistakes, due review questions, and depth-matched
            questions. Higher spaced repetition success means students are answering repeated concepts correctly over time.
          </p>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-bold">Selection Reasons</h2>
          <DistributionPieChart data={data.aiReasonData} />
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-bold">Weak Concepts Targeted</h2>
          <MasteryBarChart data={data.weakConcepts} percent={false} />
        </Card>
        <Card>
          <h2 className="text-xl font-bold">Recent Strategy Logs</h2>
          <div className="mt-4 space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="rounded-md bg-slate-50 p-3">
                <p className="font-semibold">{log.strategyUsed}</p>
                <p className="text-sm text-slate-600">{log.selectedReason}</p>
              </div>
            ))}
            {!logs.length ? <p className="text-slate-600">No AI selection logs yet.</p> : null}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-3">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
