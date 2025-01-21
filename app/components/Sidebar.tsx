"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  ReceiptPoundSterling,
  PieChart,
  Send,
  Settings2,
  PartyPopper,
  SquareTerminal,
} from "lucide-react"
import { auth, signOut } from '@/auth';
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { usePathname } from 'next/navigation'
import Link from "next/link";
import { Home, BarChart2, Users, Settings } from 'lucide-react'
import { Session } from "next-auth";
import Image from "next/image";

const AppSidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname()

  const data = {
    user: {
      name: session?.user?.name || "Guest",
      email: session?.user?.email || "guest@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Home",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Dasboard",
            url: "/studio",
          },
          {
            title: "New Single",
            url: "/new_single",
          },
          {
            title: "New Release",
            url: "/new_release",
          },
          {
            title: "Releases",
            url: "/mwonya_release",
          },
          
        ],
      },
      {
        title: "Earnings",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "All",
            url: "#",
          },
          {
            title: "Streams",
            url: "#",
          },
          {
            title: "Circle",
            url: "#",
          },
        ],
      },
      {
        title: "Events",
        url: "#",
        icon: PartyPopper,
        items: [
          {
            title: "New",
            url: "#",
          },
          {
            title: "All Events",
            url: "#",
          }
        ],
      },
      {
        title: "Manage",
        url: "#",
        icon: Frame,
        items: [
          {
            title: "New Artist",
            url: "#",
          },
          {
            title: "Manage Artists",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "Profile",
            url: "#",
          },
          {
            title: "Socials",
            url: "#",
          },
  
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
  
    ],
    navSecondary: [
      {
        title: "contact",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Mail",
        url: "#",
        icon: Send,
      },
    ],
    
  }


  // Filter navMain items based on user role
  const filteredNavMain = data.navMain.filter(item => {
    if (session?.user?.role === 'admin') {
      return true; // Admins see all items
    }
    if (session?.user?.role === 'artist' && ['Home', 'Earnings', 'Settings'].includes(item.title)) {
      return true; // Artists see all items except 'Circles'
    }
    if (session?.user?.role === 'label' && ['Home', 'Earnings', 'Settings', 'Manage'].includes(item.title)) {
      return true; // Labels see all items except 'Events'
    }
    if (session?.user?.role === 'user' && item.title === 'Home') {
      return true; // Users only see 'Home'
    }
    return false; // Default to hiding the item
  });

  

  return (
    <Sidebar variant="inset" className="z-10 border-r-[1px]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                  <Image src="/mwonya_logo_white.svg" alt="Logo" width={20} height={20} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MWONYA</span>
                  <span className="truncate text-xs">Creator: {session.user.role}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
      <NavMain items={filteredNavMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar