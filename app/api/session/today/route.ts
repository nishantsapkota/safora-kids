import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getSessionQuestion, getTodaySessionStatus } from "@/lib/session";
import { jsonError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    const status = await getTodaySessionStatus(user.id);
    if (!status.session) {
      return NextResponse.json(status, {
        headers: { "Cache-Control": "no-store" }
      });
    }
    const question = await getSessionQuestion(status.session.id, user.id);
    return NextResponse.json(question ?? { session: status.session, question: null }, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unauthorized", 401);
  }
}
