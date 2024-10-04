import localFont from 'next/font/local'
import { cn } from '@/lib/utils'
import "@/globals.css"





export default async function CreateProfile({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div className={cn('antialiased', 'w-full h-full bg-[#f8fafd] py-12 md:py-16 lg:py-20 flex')}>
            {children}
        </div>

    );


}



