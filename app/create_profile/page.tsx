
import Link from "next/link"
import { Button } from "@/components/ui/button"
import React from "react"

export default function Component() {
  return (
      
      <section className="w-full mt-4 py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary to-secondary">
        <div className="container grid items-center justify-center gap-6 px-4 text-center md:px-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4 text-primary-foreground">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Our Community</h1>
            <p className="max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose your path and start your journey with us. Whether you're an artist or a record label, we have the
              tools and resources to help you succeed.
            </p>
          </div>
          <div className="grid gap-4">
            <Link
              href="/create_profile/artist"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              prefetch={false}
            >
              <svg
                className="h-5 w-5"
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
                <circle cx="8" cy="18" r="4" />
                <path d="M12 18V2l7 4" />
              </svg>
              Register as Artist
            </Link>
            <Link
              href="/create_profile/recordlabel"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              prefetch={false}
            >
              <svg
                className="h-5 w-5"
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
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
              Register as Record Label
            </Link>
          </div>
        </div>
      </section>
  )
}

