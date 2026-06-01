import { NextResponse } from "next/server";
import Papa from "papaparse";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ImportQuestion = {
  id: string;
  module: string;
  subtopic: string;
  difficulty: string;
  ageGroup: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  learningObjective: string;
  masteryConcept: string;
  variantGroup: string;
  repeatPriority: number;
  aiEligible: boolean;
  conceptDepth: number;
};

export async function POST(request: Request) {
  await requireAdmin();
  const text = await request.text();
  const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
  const rows: ImportQuestion[] = parsed.data.map((row) => ({
    id: row.id,
    module: row.module,
    subtopic: row.subtopic,
    difficulty: row.difficulty,
    ageGroup: row.ageGroup,
    question: row.question,
    options: JSON.parse(row.options),
    correctAnswer: Number(row.correctAnswer),
    explanation: row.explanation,
    learningObjective: row.learningObjective,
    masteryConcept: row.masteryConcept,
    variantGroup: row.variantGroup,
    repeatPriority: Number(row.repeatPriority ?? 1),
    aiEligible: row.aiEligible !== "false",
    conceptDepth: Number(row.conceptDepth ?? 1)
  }));
  for (const question of rows) {
    await prisma.question.upsert({ where: { id: question.id }, create: question, update: question });
  }
  return NextResponse.json({ imported: rows.length });
}
