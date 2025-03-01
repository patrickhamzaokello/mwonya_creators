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
          style={{ background: 'linear-gradient(to right,rgb(49, 10, 140),rgb(103, 3, 156))' }}
        ></div>
        
        {/* Large purple blob 2 */}
        <div 
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[80px]"
          style={{ background: 'linear-gradient(to right,rgb(63, 7, 116),rgb(113, 21, 204))' }}
        ></div>
        
        {/* Middle accent blob */}
        <div 
          className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full opacity-10 blur-[100px]"
          style={{ background: 'linear-gradient(to right,rgb(63, 25, 98),rgb(71, 9, 147))' }}
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