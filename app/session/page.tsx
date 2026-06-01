import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SessionPlayer } from "@/components/session-player";

export default async function SessionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <SessionPlayer />;
}
