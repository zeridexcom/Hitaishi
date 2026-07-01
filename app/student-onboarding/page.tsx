import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { StudentOnboardingClient } from "./StudentOnboardingClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch (err) {
    console.error('Failed to get current user:', err);
  }
  if (user) {
    redirect(`/${user.role}/dashboard`);
  }
  return <StudentOnboardingClient currentUser={user} />;
}
