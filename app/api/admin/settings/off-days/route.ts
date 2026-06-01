import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getOffDays, setOffDays } from "@/lib/settings";

export async function GET() {
  await requireAdmin();
  return NextResponse.json({ offDays: await getOffDays() });
}

export async function POST(request: Request) {
  await requireAdmin();
  const parsed = z.object({ offDays: z.array(z.number().min(0).max(6)) }).parse(await request.json());
  await setOffDays(parsed.offDays);
  return NextResponse.json({ offDays: parsed.offDays });
}
