'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronUp } from 'lucide-react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when scrolled more than 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility)

    // Cleanup event listener
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Button
            onClick={scrollToTop}
            size="icon"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-600 hover:bg-slate-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Back to top"
          >
            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      )}
    </>
  )
}
