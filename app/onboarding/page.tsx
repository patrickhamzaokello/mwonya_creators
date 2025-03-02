import OnboardingView from "@/components/dashboard_metrics/onboarding_profile";
import { auth } from "@/auth";

async function LoginPage() {
  const session = await auth()

  // Redirect if session is null
  const userRole = session?.user.role || "user"

  return (
    <div>
      <OnboardingView userRole={userRole} />
    </div>
  )
}

export default LoginPage