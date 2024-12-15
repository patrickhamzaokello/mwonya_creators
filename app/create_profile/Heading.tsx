import Link from "next/link"
import React from "react"
import { auth} from "@/auth"
import Image from "next/image";
import { SignInButton } from "@/components/SignInButtton";
import { SignOutButton } from "@/components/SignOutButton";

export default async function OnboardingHeading() {
    const session = await auth();

    return (
        <header className="w-full py-4 block mx-auto container max-w-7xl" >
            <div className="container flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/create_profile/" className="text-lg font-bold" prefetch={false}>
                        MWONYA CREATORS
                    </Link>
                    <Link href="/create_profile/artist" className="text-active-foreground hover:underline" prefetch={false}>
                        Indie Artist
                    </Link>
                    <Link href="/create_profile/recordlabel" className="text-active-foreground hover:underline" prefetch={false}>
                        Record Label
                    </Link>
                   
                    
                </div>
                <div className="flex items-center gap-4">
                <Link href="#" className="text-muted-foreground hover:underline" prefetch={false}>
                        Help
                    </Link>
                    {session?.user ? (
                        <>
                            <div className="flex flex-col">
                                <span className="text-muted-foreground">{session.user.name}</span>
                            </div>
                            

                         <SignOutButton />                           
                        </>
                    ) : (
                        <>
                            
                            <SignInButton/>
                        </>

                    )}

                </div>
            </div>
        </header>
    )
}