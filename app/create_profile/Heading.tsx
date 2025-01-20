import Link from "next/link"
import { auth } from "@/auth"
import { SignInButton } from "@/components/SignInButtton"
import { SignOutButton } from "@/components/SignOutButton"
import { Button } from "@/components/ui/button"
import { MusicIcon, BuildingIcon, HelpCircleIcon } from "lucide-react"

export default async function OnboardingHeading() {
    const session = await auth()
  
    return (
      <header className="w-full py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/create_profile/" className="text-2xl font-bold text-foreground" prefetch={false}>
              MWONYA CREATORS
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link href="/create_profile/artist" prefetch={false}>
                <Button variant="ghost" className="text-foreground hover:text-foreground hover:bg-accent">
                  <MusicIcon className="mr-2 h-4 w-4" />
                  Indie Artist
                </Button>
              </Link>
              <Link href="/create_profile/recordlabel" prefetch={false}>
                <Button variant="ghost" className="text-foreground hover:text-foreground hover:bg-accent">
                  <BuildingIcon className="mr-2 h-4 w-4" />
                  Record Label
                </Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" prefetch={false}>
              <Button variant="ghost" className="text-foreground hover:text-foreground hover:bg-accent">
                <HelpCircleIcon className="mr-2 h-4 w-4" />
                Help
              </Button>
            </Link>
            {session?.user ? (
              <div className="flex items-center gap-4">
                <span className="text-foreground">{session.user.name}</span>
                <SignOutButton />
              </div>
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </header>
    )
  }
  