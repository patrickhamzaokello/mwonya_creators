"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Mail } from 'lucide-react'
import Link from 'next/link';

export default function SignupConfirmation() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const userEmail = "Check your inbox and click to confirm"
    setEmail(userEmail);
  }, []);

  const handleResendEmail = () => {
    // console.log('Resending email to:', email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Image */}
            

            <div className="w-full md:w-1/2 p-6 md:p-8 space-y-6">
              <div className="text-center md:text-left">
                <div className="flex justify-center md:justify-start items-center space-x-2 text-black-600 mb-2">
                  <h2 className="text-2xl font-bold">Check Your Inbox</h2>
                </div>
                <p className="text-gray-600">We've sent a confirmation link to:</p>
                <p className="text-lg font-medium text-gray-800 mt-1">{email}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-sm text-gray-600">
                  <CheckCircle2 className="text-green-500 mt-0.5" size={20} />
                  <p>Click the link in the email to confirm your account</p>
                </div>
                <div className="flex items-start space-x-3 text-sm text-gray-600">
                  <CheckCircle2 className="text-green-500 mt-0.5" size={20} />
                  <p>If you don't see it, check your spam folder</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500 text-center md:text-left">
                  Didn't receive the email? We can send it again.
                </p>
                <div className="flex space-x-2">
                  {/* <Input
                    type="email"
                    placeholder="Confirm your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={handleResendEmail}>
                    Resend
                  </Button> */}
                   <Link href={"/auth/login"}>
                  <Button type='button'>
                    Login
                  </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="w-full md:w-1/2 relative h-48 md:h-auto">
              <Image
                src="https://assets.mwonya.com/images/artistprofiles/Lukas%C2%A0Blacc_profile_20230317135613_04099.JPG"
                alt="Confirmation Illustration"
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}