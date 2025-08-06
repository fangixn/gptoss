'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronUp } from 'lucide-react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // 滚动超过 300px 时显示按钮
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // 添加滚动事件监听器
    window.addEventListener('scroll', toggleVisibility)

    // 清理事件监听器
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
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Button
            onClick={scrollToTop}
            size="icon"
            className="h-12 w-12 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="回到顶部"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  )
}
