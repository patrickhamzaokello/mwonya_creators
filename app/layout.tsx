import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import { cn } from '@/lib/utils'
import localFont from 'next/font/local'
import { GoogleAnalytics } from '@next/third-parties/google'

const myFont = localFont({
    src: [
        {
            path: './fonts/fonnts.com-DegularDemo-Light.otf',

            weight: '300', // Lighter weight for paragraphs
            style: 'normal',
        },
        {
            path: './fonts/fonnts.com-DegularDemo-Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {

            path: './fonts/fonnts.com-DegularDemo-Medium.otf',

            weight: '500', // Medium weight for subheadings

            style: 'normal',

        },

        {
            path: './fonts/fonnts.com-DegularDemo-Bold.otf',
            weight: '700', // Bold weight for headings
            style: 'normal',
        },
        {

            path: './fonts/fonnts.com-DegularDemo-Black.otf',
            weight: '900', // Heaviest weight for emphasis
            style: 'normal',

        },
    ],
})

export const metadata: Metadata = {
  title: "Mwonya: Creator Studio",
  description: "Mwonya Artist Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <body className={cn(myFont.className)}>
        <main className="h-full">{children}</main>
        <Toaster />
      </body>
      <GoogleAnalytics gaId="G-J8MHCYYF9P" />

    </html>
  );
}
