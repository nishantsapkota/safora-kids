import { redirect } from "next/navigation";
import { DistributionPieChart, MasteryBarChart } from "@/components/charts";
import { Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { adminDashboard } from "@/lib/dashboard";
import { AdminShell } from "@/components/admin-shell";

export default async function AiAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");
  const data = await adminDashboard();

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
          <div className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            <p><span className="font-semibold text-safety-ink">low_mastery</span> means the student has lower mastery in that module, so the system selects more practice from it.</p>
            <p><span className="font-semibold text-safety-ink">due_review</span> means the concept is due for spaced-repetition review based on previous attempts.</p>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold">Weak Concepts Targeted</h2>
          <MasteryBarChart data={data.weakConcepts} percent={false} verticalLabels height={360} />
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
