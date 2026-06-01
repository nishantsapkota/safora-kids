import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { userDashboard } from "@/lib/dashboard";

export async function GET() {
  const user = await requireUser();
  return NextResponse.json(await userDashboard(user.id));
}
