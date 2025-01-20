import { cn } from "@/lib/utils"
import OnboardingHeading from "./Heading"

export default function CreateProfile({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <OnboardingHeading />
        <main className="flex-grow">{children}</main>
        <footer className="py-6 text-center text-muted-foreground bg-muted">
          <p>&copy; 2025 MWONYA CREATORS. All rights reserved.</p>
        </footer>
      </div>
    )
  }
  
  