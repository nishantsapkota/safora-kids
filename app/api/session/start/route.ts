import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getSessionQuestion, startDailySession } from "@/lib/session";
import { jsonError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await requireUser();
    const session = await startDailySession(user.id);
    const question = await getSessionQuestion(session.id, user.id);
    return NextResponse.json(question ?? { session, question: null }, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to start session.", 401);
  }
}
