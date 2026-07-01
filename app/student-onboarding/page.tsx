import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { StudentOnboardingClient } from "./StudentOnboardingClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getCurrentUser();
  if (user) {
    redirect(`/${user.role}/dashboard`);
  }
  return <StudentOnboardingClient currentUser={user} />;
}
