import { redirect } from "next/navigation";
import { Card, ButtonLink } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ResultPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { sessionId } = await params;
  const session = await prisma.session.findFirst({ where: { id: sessionId, userId: user.id }, include: { attempts: { include: { question: true } } } });
  if (!session) redirect("/dashboard");
  const weak = [...new Set(session.attempts.filter((attempt) => !attempt.isCorrect).map((attempt) => attempt.question.masteryConcept))];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Card>
        <h1 className="text-3xl font-bold">Session Result</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-md bg-blue-50 p-4"><p className="text-sm text-blue-700">Score</p><p className="text-3xl font-bold">{Math.round(session.scorePercent)}%</p></div>
          <div className="rounded-md bg-green-50 p-4"><p className="text-sm text-green-700">Correct</p><p className="text-3xl font-bold">{session.correctCount}</p></div>
          <div className="rounded-md bg-orange-50 p-4"><p className="text-sm text-orange-700">Wrong</p><p className="text-3xl font-bold">{session.wrongCount}</p></div>
        </div>
        <h2 className="mt-6 text-xl font-bold">Weak Concepts</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {weak.length ? weak.map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm">{item}</span>) : <span className="text-slate-600">No weak concepts this session.</span>}
        </div>
        <p className="mt-6 text-slate-700">
          Recommendation: {session.scorePercent >= 90 ? "Excellent progress. Continue daily practice." : "Review the highlighted concepts and try again on the next active day."}
        </p>
        <div className="mt-6"><ButtonLink href="/dashboard" className="bg-safety-blue text-white">Back to Dashboard</ButtonLink></div>
      </Card>
    </div>
  );
}
