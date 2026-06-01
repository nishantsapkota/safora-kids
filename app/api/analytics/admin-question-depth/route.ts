import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { adminDashboard } from "@/lib/dashboard";

export async function GET() {
  await requireAdmin();
  return NextResponse.json({ data: (await adminDashboard()).byDepth });
}
