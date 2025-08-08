'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface StartChatButtonProps {
  className?: string;
}

export default function StartChatButton({ className }: StartChatButtonProps) {
  const router = useRouter();

  const handleStartChat = () => {
    router.push('/chat');
  };

  return (
    <Button 
      onClick={handleStartChat}
      className={className}
      size="lg"
    >
      <MessageSquare className="mr-2 h-5 w-5" />
      Start Chat
    </Button>
  );
}