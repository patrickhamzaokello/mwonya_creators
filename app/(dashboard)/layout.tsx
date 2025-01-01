
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Menu from "@/components/Menu"
import Navbar from "@/components/Navbar";
import { auth, signOut } from '@/auth';
import { ArtistProvider } from "@/contexts/ArtistContext";
import { loginRoleChecks } from '@/actions/loginRoleCheck';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/Sidebar"


export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();

  //redirect if session is null
  if (!session?.user.id) {
    redirect("/auth/login");
  }
  const userId = session.user.id ?? "null";
  console.log(userId)
  const roleCheckResult = await loginRoleChecks(userId);
  console.log(roleCheckResult)
  if (roleCheckResult.profileStatus.needsProfileCreation) {
    redirect("/create_profile");
  }

  return (
    <ArtistProvider>
      <SidebarProvider>
        <AppSidebar  />
        <main className="w-full">
          <Navbar session={session} userRole={roleCheckResult?.user.role} />
          <div className="p-4 md:gap-8 md:p-4 bg-[#fff]" >
            {children}
          </div>
        </main>
      </SidebarProvider>
    </ArtistProvider>
  );


}
