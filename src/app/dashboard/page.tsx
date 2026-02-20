import { getUserOrRedirect } from "@/lib/auth";
import { getPendingFollowups } from "@/lib/followups";
import { DashboardContent } from "@/components/DashboardContent";

export default async function DashboardPage() {
  // Enforce authentication and allowlist check
  const user = await getUserOrRedirect();

  // Fetch all pending follow-ups (client-side will filter by tab)
  const followups = await getPendingFollowups();

  return <DashboardContent followups={followups} userEmail={user.email ?? ""} />;
}
