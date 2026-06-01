import { NextResponse } from "next/server";
import { adminDashboard } from "@/lib/dashboard";

export async function GET() {
  const data = await adminDashboard();
  return NextResponse.json({ byModule: data.byModule, byDifficulty: data.byDifficulty, byDepth: data.byDepth });
}
