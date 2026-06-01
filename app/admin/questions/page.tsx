import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { adminDashboard } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin-shell";
import { QuestionTable } from "@/components/question-table";

export default async function AdminQuestionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");
  const [data, questions] = await Promise.all([
    adminDashboard(),
    prisma.question.findMany({ orderBy: [{ module: "asc" }, { id: "asc" }] })
  ]);

  return (
    <AdminShell title="Question Bank" description="All questions stored in the database. Click a row to inspect metadata and options.">
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold">Question Counts</h2>
          <div className="mt-4 space-y-3">
            {data.byModule.map((item) => (
              <div key={item.name} className="flex justify-between rounded-md bg-slate-50 px-3 py-2">
                <span>{item.name}</span><strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-bold">Question Tools</h2>
          <p className="mt-3 text-slate-700">Total question count: <strong>{data.totalQuestions}/350</strong></p>
          <form action="/api/questions/seed" method="post" className="mt-5">
            <button className="rounded-md bg-safety-green px-4 py-3 font-semibold text-white">Reseed 350 Questions</button>
          </form>
        </Card>
      </div>
      <Card className="mt-6 p-0">
        <QuestionTable questions={questions} />
      </Card>
    </AdminShell>
  );
}
