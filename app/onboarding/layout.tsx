// app/onboarding/layout.js
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from '@/auth';
import { loginRoleChecks } from '@/actions/loginRoleCheck';

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  //redirect if session is null
  if (!session?.user.id) {
    redirect("/auth/login");
  }
  
  const roleCheckResult = await loginRoleChecks(session);
  // If user already has profiles, redirect to dashboard
  if (!roleCheckResult.needsProfileCreation) {
    redirect("/studio");
  }
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b bg-white dark:bg-slate-950">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png" 
              alt="Logo"
              width={32}
              height={32}
              className="mr-2"
            />
            <span className="font-bold">Creator Studio</span>
          </Link>
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}