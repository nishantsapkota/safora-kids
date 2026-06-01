import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin-shell";

export default async function AdminStudentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");
  const students = await prisma.user.findMany({
    where: { role: "student" },
    include: { masteries: true, sessions: { where: { completed: true }, orderBy: { sessionDate: "desc" }, take: 1 } }
  });

  return (
    <AdminShell title="Student Progress" description="Click a student to view their dashboard, mastery, sessions, and AI insights.">
      <Card className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead><tr className="border-b"><th className="py-3">Student ID</th><th>Week</th><th>XP</th><th>Latest Score</th><th>Status</th><th>Average Mastery</th></tr></thead>
          <tbody>
            {students.map((student) => {
              const average = student.masteries.length ? Math.round(student.masteries.reduce((sum, item) => sum + item.masteryScore, 0) / student.masteries.length) : 0;
              return (
                <tr key={student.id} className="border-b last:border-0 hover:bg-blue-50">
                  <td className="py-3 font-semibold">
                    <Link className="text-safety-blue hover:underline" href={`/admin/students/${student.id}`}>
                      {student.studentId}
                    </Link>
                  </td>
                  <td>{student.currentWeek}</td>
                  <td>{student.totalXp}</td>
                  <td>{student.sessions[0] ? `${Math.round(student.sessions[0].scorePercent)}%` : "None"}</td>
                  <td>{student.passed ? "Passed" : student.isCompleted ? "Review" : "Learning"}</td>
                  <td>{average}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  );
}
