'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signInWithGoogle, signInWithGitHub } from '@/lib/supabase'
import { Github, Loader2, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AuthLoginProps {
  onClose?: () => void
}

export default function AuthLogin({ onClose }: AuthLoginProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleGoogleSignIn = async () => {
    setIsLoading('google')
    try {
      if (!signInWithGoogle) {
        toast({
          title: "Configuration Error",
          description: "Supabase is not properly configured",
          variant: "destructive"
        })
        return
      }
      const { error } = await signInWithGoogle()
      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with Google",
        variant: "destructive"
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleGitHubSignIn = async () => {
    setIsLoading('github')
    try {
      if (!signInWithGitHub) {
        toast({
          title: "Configuration Error",
          description: "Supabase is not properly configured",
          variant: "destructive"
        })
        return
      }
      const { error } = await signInWithGitHub()
      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with GitHub",
        variant: "destructive"
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <img 
            src="/extension_icon.png" 
            alt="GPT-OSS Logo" 
            className="w-20 h-20 object-contain drop-shadow-lg"
          />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-sm">
          Choose your preferred sign-in method
        </p>
      </div>

      {/* Sign-in Buttons */}
      <div className="space-y-3 mb-6">
        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading !== null}
          className="w-full h-14 text-base font-medium bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] group"
          variant="outline"
        >
          <div className="flex items-center justify-center">
            {isLoading === 'google' ? (
               <Loader2 className="mr-3 h-5 w-5 animate-spin text-blue-600" />
             ) : (
               <img 
                 src="/google.com-favicon.ico" 
                 alt="Google" 
                 className="mr-3 h-5 w-5"
               />
             )}
            <span className="group-hover:text-blue-600 transition-colors duration-200">
              Continue with Google
            </span>
          </div>
        </Button>
        
        <Button
          onClick={handleGitHubSignIn}
          disabled={isLoading !== null}
          className="w-full h-14 text-base font-medium bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-center">
            {isLoading === 'github' ? (
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            ) : (
              <div className="mr-3 p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors duration-200">
                <Github className="h-4 w-4" />
              </div>
            )}
            <span>Continue with GitHub</span>
          </div>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-white px-4 py-1 rounded-full border border-gray-100 shadow-sm">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Secure Authentication
            </span>
          </div>
        </div>
      </div>

      {/* Security Notice */}
       <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
         <div className="flex items-center justify-center space-x-3">
           <div className="flex-shrink-0">
             <Shield className="h-5 w-5 text-blue-600" />
           </div>
           <p className="text-sm text-gray-600 text-center">
             Your data remains secure and private.
           </p>
         </div>
       </div>
    </div>
  )
}