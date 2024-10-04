"use client"
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { logout } from '@/actions/logout'
const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Dashboard",
        href: "/studio",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/artist.png",
        label: "Artists",
        href: "/artist",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Album",
        href: "/album",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "New Release",
        href: "/revenue",
        visible: ["admin", "teacher", "student", "parent"],
      },

      {
        icon: "/lesson.png",
        label: "Uploads",
        href: "/upload",
        visible: ["admin", "teacher"],
      },




      {
        icon: "/calendar.png",
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
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
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
    <div className="dark flex flex-col mt-4 text-sm h-[90%] justify-between">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2 text-bold" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light  my-4">{i.title}</span>
          {i.items.map((item) => {
            const isActive = currentPath === item.href;
            return item.label === "Logout" ? (
              <button onClick={() => {
                logout();
              }}
                className="flex items-center hover:bg-accent hover:text-accent-foreground justify-center px-2 rounded-sm lg:justify-start gap-4 text-gray-500 py-2 w-full"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </button>
            ) : (
              <Link
                href={item.href}
                key={item.label}
                className={`flex items-center hover:bg-[#6519fb]  hover:text-white justify-center px-2 rounded-sm lg:justify-start  gap-4 py-2 ${isActive ? 'text-white bg-[#6519fb]' : 'text-[#a2a5ab]'}`}
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
