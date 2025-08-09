'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function BlogDetailMobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const navItems = [
    { label: 'Core Areas', href: '/#features' },
    { label: 'Chat', href: '/#how-it-works' },
    { label: 'Best Practices', href: '/#try-now' },
    { label: 'Articles', href: '/#blog-posts' },
    { label: 'Resources', href: '/#resources' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center space-x-2">
              <img src="/extension_icon.png" alt="GPT-OSS Blog" className="w-8 h-8 rounded-lg" />
              <span className="font-semibold text-slate-800">GPT-OSS Blog</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-6">
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-12 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  asChild
                  onClick={handleNavClick}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </div>
          </nav>

          {/* Back to Blog Link */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full h-12 text-base"
              asChild
              onClick={handleNavClick}
            >
              <Link href="/blog">← Back to Blog</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}