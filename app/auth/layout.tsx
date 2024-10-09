import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ 
  children, 
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden flex">
        {/* Left section with image and overlay text */}
        <div className="w-1/2 relative hidden md:block">
          <img 
            src={"https://assets.mwonya.com/images/artistprofiles/rokkku_profile.png"} 
            alt="Authentication background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center px-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Mwonya Artist Studio</h2>
            <p className="text-lg">The platform made for you to grow and develop</p>
          </div>
        </div>

        {/* Right section with form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="w-full shadow-none">
            
              {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;