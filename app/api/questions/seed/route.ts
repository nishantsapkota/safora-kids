import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { seedQuestions } from "@/lib/seed-data";

export async function POST() {
  await requireAdmin();
  const count = await seedQuestions();
  return NextResponse.json({ count });
}
