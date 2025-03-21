"use client"
// AppSidebar.tsx
import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Session } from 'next-auth';
import { filterRoutes } from '@/lib/nav_routes/filterRoutes';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const AppSidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  type Role = 'admin' | 'artist' | 'label' | 'user';
  const { navMain, navSecondary } = filterRoutes((session?.user?.role as Role) || 'user');

  // Add `isActive` property to navMain items
  const navMainWithActive = navMain.map((item) => {
    const isParentActive =
      pathname === item.url || // Check if the parent URL matches the current URL
      item.items?.some((nestedItem) => nestedItem.url === pathname); // Check if any child URL matches the current URL

    return {
      ...item,
      isActive: isParentActive, // Set the parent as active if it or any of its children are active
      items: item.items?.map((nestedItem) => ({
        ...nestedItem,
        isActive: pathname === nestedItem.url, // Check if the current URL matches the nested item's URL
      })),
    };
  });

  // Set "Home" as active by default if the current URL is the root ("/")
  if (pathname === '/studio') {
    const homeIndex = navMainWithActive.findIndex((item) => item.title === 'Home');
    if (homeIndex !== -1) {
      navMainWithActive[homeIndex].isActive = true;
    }
  }

  // Add `isActive` property to navSecondary items
  const navSecondaryWithActive = navSecondary.map((item) => ({
    ...item,
    isActive: pathname === item.url, // Check if the current URL matches the item's URL
  }));

  const data = {
    user: {
      name: session?.user?.name || 'Guest',
      email: session?.user?.email || 'guest@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
  };

  return (
    <Sidebar variant="inset" className="z-10 border-r-[1px] bg-background">
      <SidebarHeader className=' border rounded' >
        <div className="flex items-center space-x-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-backgroutext-sidebar-background-foreground">
            <Image src="/mwonya_logo_white.svg" alt="Logo" width={20} height={20} />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">MWONYA</span>
            <span className="truncate text-xs text-primary">{(session.user.role).toLocaleUpperCase()}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className='bg-background'>
        <NavMain items={navMainWithActive} />
        <NavSecondary items={navSecondaryWithActive} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter className='border rounded'>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;