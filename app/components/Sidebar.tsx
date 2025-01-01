"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
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

const AppSidebar = () => {
  const pathname = usePathname()

  const data = {
    user: {
      name: "pk",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Release",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "New",
            url: "#",
          },
          {
            title: "My Releases",
            url: "Releases",
          },
          {
            title: "Metrics",
            url: "studio",
          },
        ],
      },
      {
        title: "Circles",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Members",
            url: "#",
          },
          {
            title: "Metric",
            url: "#",
          },
          {
            title: "Settings",
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
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "New Artist",
        url: "studio",
        icon: Frame,
      },
      {
        name: "Data",
        url: "Releases",
        icon: PieChart,
      },
      {
        name: "Tour",
        url: "Releases",
        icon: Map,
      },
    ],
  }
  

  return (
    <Sidebar variant="inset" className="bg-[#f9fafd] z-10 border-r-[1px] border-[#e7e7e7]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MWONYA</span>
                  <span className="truncate text-xs">Creators</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
      <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />

        
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar