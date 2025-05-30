"use client"
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { logout } from '@/actions/logout'
import { SignOutButton } from "./SignOutButton";
const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/menu_icon.svg",
        label: "Dashboard",
        href: "/studio",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/menu_icon.svg",
        label: "Artists",
        href: "/artist",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/menu_icon.svg",
        label: "Album",
        href: "/album",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/menu_icon.svg",
        label: "New Release",
        href: "/revenue",
        visible: ["admin", "teacher", "student", "parent"],
      },

      {
        icon: "/menu_icon.svg",
        label: "Uploads",
        href: "/upload",
        visible: ["admin", "teacher"],
      },




      {
        icon: "/menu_icon.svg",
        label: "Upload List",
        href: "/uploadList",
        visible: ["admin", "teacher", "student", "parent"],
      },



    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/menu_icon.svg",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/menu_icon.svg",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/menu_icon.svg",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];




export default function Menu() {
  const currentPath = usePathname();

  return (
    <div className="flex flex-col mt-4 text-sm h-[90%] justify-between">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2 text-bold" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light  my-4">{i.title}</span>
          {i.items.map((item) => {
            const isActive = currentPath === item.href;
            return item.label === "Logout" ? (

              <SignOutButton className="flex items-center hover:bg-primary hover:text-accent-foreground justify-center px-2 rounded-sm lg:justify-start gap-4 text-gray-500 py-2 w-full">
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </SignOutButton>


            ) : (
              <Link
                href={item.href}
                key={item.label}
                className={`flex items-center hover:bg-[#6519fb]  hover:text-white justify-center px-2 rounded-sm lg:justify-start  gap-4 py-2 ${isActive ? 'bg-[#6519fb] text-white' : 'text-[#1d1a18]'}`}
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>)
}
