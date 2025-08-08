import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ClientHeaderProps {
  className?: string;
}

export default function ClientHeader({ className }: ClientHeaderProps) {
  return (
    <div className={className}>
      <Link href="#features">
        <Button 
          variant="ghost" 
          className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3"
        >
          Core Areas
        </Button>
      </Link>
      <Link href="/blog">
        <Button 
          variant="ghost" 
          className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3"
        >
          Articles
        </Button>
      </Link>
      <Link href="#resources">
        <Button 
          variant="ghost" 
          className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3"
        >
          Resources
        </Button>
      </Link>
      <Link href="/chat">
        <Button 
          variant="ghost" 
          className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3"
        >
          Chat
        </Button>
      </Link>
    </div>
  );
}