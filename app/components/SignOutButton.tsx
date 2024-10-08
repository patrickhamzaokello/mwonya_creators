"use client"

import { useRouter } from "next/navigation" 
import { Button } from "@/components/ui/button"
import { handleSignOut } from "@/actions/signOutServerAction"

export const SignOutButton = (props: {
    children?: React.ReactNode;
    className?: string;
  }) => {
    return (
        <Button
        className={props.className}
        style={{ cursor: "pointer" }}
        onClick={() => handleSignOut()}
      >
        {props.children || "Sign Out"}
      </Button>
    )
}