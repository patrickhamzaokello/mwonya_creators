import localFont from 'next/font/local'
import { cn } from '@/lib/utils'
import "@/globals.css"
import OnboardingHeading from './Heading'




export default async function CreateProfile({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div>
           <div className='bg-white'><OnboardingHeading/></div>
         <div className='container mx-auto px-4 max-w-7xl'>
         {children}
         </div>
        </div>

    );


}



