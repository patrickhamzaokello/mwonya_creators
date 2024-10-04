/**
 * v0 by Vercel.
 * @see https://v0.dev/t/URciEg1Evr5
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { JSX, SVGProps, useState} from "react"
import {Button} from "@/components/ui/button"
import {useRouter} from 'next/navigation'
import Image from "next/image"

export default function Component() {
  const router = useRouter()
  const [selectedCard, setSelectedCard] = useState("artist")
  const handleContinue = () => {
    if (selectedCard === "artist") {
      router.push('/create_profile/artist')
    } else {
      router.push('/create_profile/recordlabel')
    }
  }
  return (
      <div className="w-full max-w-4xl mx-auto py-12 md:py-16 lg:py-20 bg-white">
        <div className="flex flex-col items-center justify-center h-screen gap-8 bg-white">
          <div className="text-center space-y-2">
            <Image className="m-8 mx-auto" src="/mwonya_logo.png" width="50" height="50" alt="Mwonya"/>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Choose Your Path</h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Select your role to continue and experience our sleek and modern platform.
            </p>
          </div>
          <div>
            <div className="flex flex-row gap-4">
              <div
                  className={`px-8 py-8 rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                      selectedCard === "artist"
                          ? "border-2 border-primary bg-primary-foreground text-primary"
                          : "border bg-background hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setSelectedCard("artist")}
              >
                <MicIcon className="w-8 h-8"/>
                <span className="text-sm font-medium">Create New Artist</span>
              </div>
              <div
                  className={`px-8 py-8 rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                      selectedCard === "label"
                          ? "border-2 border-primary  bg-primary-foreground text-primary"
                          : "border bg-background hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setSelectedCard("label")}
              >
                <DiscIcon className="w-8 h-8"/>
                <span className="text-sm font-medium">Create New Record Label</span>
              </div>
            </div>
            <Button className="mt-12 w-full" onClick={handleContinue}>Continue</Button>

          </div>
        </div>
      </div>
  )
}

function DiscIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}


function MicIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}