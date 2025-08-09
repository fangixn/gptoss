'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import UserAvatar from '@/components/UserAvatar';

interface BlogMobileNavProps {
  onNavigation: (path: string) => void;
  onLoginOpen: () => void;
}

export default function BlogMobileNav({ onNavigation, onLoginOpen }: BlogMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleNavClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const navItems = [
    { label: 'Core Areas', action: () => onNavigation('/#features') },
    { label: 'Chat', action: () => onNavigation('/#how-it-works') },
    { label: 'Best Practices', action: () => onNavigation('/#try-now') },
    { label: 'Articles', action: () => onNavigation('/#blog-posts') },
    { label: 'Resources', action: () => onNavigation('/#resources') },
    { label: 'Blog', action: () => onNavigation('/blog') },
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
                  onClick={() => handleNavClick(item.action)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </nav>

          {/* Authentication Section */}
          <div className="pt-4 border-t">
            {user ? (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50">
                <UserAvatar />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-slate-500">Signed in</p>
                </div>
              </div>
            ) : (
              <Button
                className="w-full econai-button-primary h-12 text-base"
                onClick={() => handleNavClick(onLoginOpen)}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}