'use client'

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Purple fog background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large purple blob 1 */}
        <div 
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[80px]"
          style={{ background: 'linear-gradient(to right, #8b5cf6, #d946ef)' }}
        ></div>
        
        {/* Large purple blob 2 */}
        <div 
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[80px]"
          style={{ background: 'linear-gradient(to right, #a855f7, #ec4899)' }}
        ></div>
        
        {/* Middle accent blob */}
        <div 
          className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full opacity-10 blur-[100px]"
          style={{ background: 'linear-gradient(to right, #c026d3, #8b5cf6)' }}
        ></div>
      </div>
      
      {/* Content */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
        </Link>
      </div>
      
      <div className="w-full max-w-[500px] space-y-6 z-10">
        {children}
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-500 z-10">
        <p>© {new Date().getFullYear()} Mwonya Media LTD. All rights reserved.</p>

      </footer>
    </div>
  );
};

export default AuthLayout;