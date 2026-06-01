import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { finalAssessment } from "@/lib/ai";

export async function POST() {
  const user = await requireUser();
  return NextResponse.json(await finalAssessment(user.id));
}
