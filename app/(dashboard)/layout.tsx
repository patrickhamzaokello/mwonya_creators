import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Menu from "@/components/Menu"
import Navbar from "@/components/Navbar";
import { auth, signOut } from '@/auth';
import { ArtistProvider } from "@/contexts/ArtistContext";
import { getUserById } from '@/data-layer/user';
import { loginRoleChecks } from '@/actions/loginRoleCheck';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"



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
  if (roleCheckResult.profileStatus.needsProfileCreation) {
    redirect("/create_profile");
  }

  const user = await getUserById(userId);
  return (
    <SidebarProvider>
      <ArtistProvider>
        <AppSidebar className="bg-[#f9fafd] z-10 border-r-[1px] border-[#e7e7e7]" />
        <main className="w-full">
          <Navbar session={session} userRole={user?.role} />
          <div className="p-4 md:gap-8 md:p-4 bg-[#fff]" >
            {children}

          </div>
        </main>
      </ArtistProvider>

    </SidebarProvider>

  );


}
