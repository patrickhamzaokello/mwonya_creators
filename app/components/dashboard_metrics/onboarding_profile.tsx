"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { StringDecoder } from "node:string_decoder"
import { useState } from 'react'

export default function OnboardingView({ userRole }: { userRole: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 space-y-8 max-w-3xl mx-auto">
      <div className="rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 w-full">
        <div className="bg-white dark:bg-slate-950 rounded-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">Welcome to Creator Studio</h1>
            <p className="text-muted-foreground">
              Let's set up your {userRole === 'label' ? 'first artist' : 'profile'} to get started
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 mb-8">
            <div className="flex flex-col items-center p-4 rounded-lg border border-dashed">
              <div className="mb-4 p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Create Your Profile</h3>
              <p className="text-sm text-center text-muted-foreground">
                Build your brand and showcase your work
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg border border-dashed">
              <div className="mb-4 p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Track Performance</h3>
              <p className="text-sm text-center text-muted-foreground">
                Monitor listener engagement and growth
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/artist/create-profile">
              <Button size="lg" className="px-8">
                Create Your {userRole === 'label' ? 'First Artist' : 'Profile'} Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {userRole === 'label' && (
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg w-full">
          <h2 className="text-xl font-medium mb-3">Label Account Benefits</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Create and manage multiple artist profiles</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Advanced analytics and reporting for your roster</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Consolidated revenue tracking across all artists</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}