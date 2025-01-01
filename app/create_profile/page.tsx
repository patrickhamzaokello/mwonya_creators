import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <section className="w-full py-16 md:py-28 lg:py-36 bg-gradient-to-br from-primary to-secondary">
      <div className="container mx-auto px-6 text-center md:px-12 lg:px-20">
        <div className="grid items-center justify-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="text-left space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tighter leading-tight sm:text-5xl md:text-6xl">
              Join Our Creative Community
            </h1>
            <p className="text-lg leading-relaxed text-primary-foreground/80 md:text-xl lg:max-w-[500px]">
              Discover the tools and resources tailored for you. Whether you're an aspiring artist or a professional record label, embark on your journey with us today.
            </p>
          </div>

          {/* Right Content */}
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/create_profile/artist"
              className="inline-flex items-center gap-3 rounded-lg bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50"
              prefetch={false}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="8" cy="18" r="4" />
                <path d="M12 18V2l7 4" />
              </svg>
              Register as Artist
            </Link>

            <Link
              href="/create_profile/recordlabel"
              className="inline-flex items-center gap-3 rounded-lg bg-secondary px-8 py-4 text-lg font-medium text-secondary-foreground shadow-md transition-all hover:bg-secondary/90 focus:outline-none focus:ring-4 focus:ring-secondary/50"
              prefetch={false}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
              Register as Record Label
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
