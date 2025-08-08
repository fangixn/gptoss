import { useState, useEffect } from 'react';

const CHAT_SESSIONS_KEY = 'econai_chat_sessions';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  model: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export function useChatSessions() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('default');

  // Load chat sessions from localStorage
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(CHAT_SESSIONS_KEY);
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        // Convert date strings back to Date objects
        const sessionsWithDates = parsedSessions.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatSessions(sessionsWithDates);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      // If data is corrupted, clear it and start fresh
      localStorage.removeItem(CHAT_SESSIONS_KEY);
      setChatSessions([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Auto-save chat sessions whenever they change
  useEffect(() => {
    if (isLoaded && chatSessions.length >= 0) {
      saveSessions(chatSessions);
    }
  }, [chatSessions, isLoaded]);

  // Save sessions to localStorage with error handling
  const saveSessions = (sessions: ChatSession[]) => {
    try {
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving chat sessions:', error);
      // Attempt to clear space and try again
      try {
        // Remove old sessions (keep only the latest 50)
        const trimmedSessions = sessions.slice(0, 50);
        localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(trimmedSessions));
        console.warn('Trimmed chat sessions to save space');
      } catch (retryError) {
        console.error('Failed to save even trimmed sessions:', retryError);
      }
    }
  };

  // Add a new session
  const addSession = (session: ChatSession) => {
    setChatSessions(prev => [session, ...prev]);
  };

  // Update an existing session
  const updateSession = (sessionId: string, updates: Partial<ChatSession>) => {
    setChatSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, ...updates, updatedAt: new Date() }
          : session
      )
    );
  };

  // Delete a session
  const deleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  // Clear all sessions
  const clearAllSessions = () => {
    setChatSessions([]);
    localStorage.removeItem(CHAT_SESSIONS_KEY);
  };

  // Get session by ID
  const getSession = (sessionId: string) => {
    return chatSessions.find(s => s.id === sessionId);
  };

  // Get current session
  const getCurrentSession = () => {
    return getSession(currentSessionId) || chatSessions[0];
  };

  // Get messages for current session
  const messages = getCurrentSession()?.messages || [];

  // Create new session
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    console.log('Created new session with ID:', newSession.id);
    return newSession.id;
  };

  // Switch to a session
  const switchSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  // Add message to current session
  const addMessage = (message: Message) => {
    console.log('Adding message to session:', currentSessionId);
    console.log('Current sessions:', chatSessions.length);
    
    // If no session exists, create one
    if (chatSessions.length === 0) {
      const title = message.type === 'user' ? 
        (message.content.length > 30 ? message.content.substring(0, 30) + '...' : message.content) : 
        'New Chat';
      const newSession: ChatSession = {
        id: currentSessionId,
        title,
        messages: [message],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setChatSessions([newSession]);
      return;
    }
    
    // Find current session and update it
    setChatSessions(prev => 
      prev.map(session => {
        if (session.id === currentSessionId) {
          // Update title if this is the first user message and title is still "New Chat"
          let newTitle = session.title;
          if (message.type === 'user' && session.title === 'New Chat' && session.messages.length === 0) {
            newTitle = message.content.length > 30 ? 
              message.content.substring(0, 30) + '...' : 
              message.content;
          }
          
          return {
            ...session,
            title: newTitle,
            messages: [...session.messages, message],
            updatedAt: new Date()
          };
        }
        return session;
      })
    );
  };

  // Update session title
  const updateSessionTitle = (sessionId: string, title: string) => {
    updateSession(sessionId, { title });
  };

  // Initialize default session if none exists
  useEffect(() => {
    if (isLoaded && chatSessions.length === 0) {
      const newSessionId = createNewSession();
      console.log('Created new session:', newSessionId);
    } else if (isLoaded && chatSessions.length > 0 && !getSession(currentSessionId)) {
      setCurrentSessionId(chatSessions[0].id);
      console.log('Switched to existing session:', chatSessions[0].id);
    }
  }, [isLoaded, chatSessions]);

  // Export chat history as Markdown
  const exportChatHistory = () => {
    const exportDate = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    let markdownContent = `# Chat History\n\n**Export Time:** ${exportDate}\n\n---\n\n`;
    
    chatSessions.forEach((session, sessionIndex) => {
      const sessionDate = session.createdAt.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      markdownContent += `## Session ${sessionIndex + 1}: ${session.title}\n\n`;
      markdownContent += `**Created At:** ${sessionDate}\n`;
      markdownContent += `**Message Count:** ${session.messages.length}\n\n`;
      
      if (session.messages.length > 0) {
        session.messages.forEach((message, messageIndex) => {
          const messageTime = message.timestamp.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
          
          const roleLabel = message.type === 'user' ? '👤 User' : '🤖 AI Assistant';
          const modelInfo = message.model ? ` (${message.model})` : '';
          
          markdownContent += `### ${roleLabel}${modelInfo} - ${messageTime}\n\n`;
          markdownContent += `${message.content}\n\n`;
          
          if (messageIndex < session.messages.length - 1) {
            markdownContent += `---\n\n`;
          }
        });
      } else {
        markdownContent += `*No messages in this session*\n\n`;
      }
      
      if (sessionIndex < chatSessions.length - 1) {
        markdownContent += `\n\n---\n\n`;
      }
    });
    
    if (chatSessions.length === 0) {
      markdownContent += `*No chat history*\n`;
    }
    
    const dataBlob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Share conversation
  const shareConversation = async (sessionId: string) => {
    const session = getSession(sessionId);
    if (!session) return;
    
    const shareText = `Share Conversation: ${session.title}\n\n${session.messages.map(msg => 
      `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`
    ).join('\n\n')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Conversation: ${session.title}`,
          text: shareText
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText);
      alert('Conversation content copied to clipboard');
    }
  };

  // Copy conversation to clipboard
  const copyConversation = async (sessionId: string) => {
    const session = getSession(sessionId);
    if (!session) return;
    
    const copyText = session.messages.map(msg => 
      `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`
    ).join('\n\n');
    
    try {
      await navigator.clipboard.writeText(copyText);
      alert('Conversation content copied to clipboard');
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // Generate conversation image (placeholder function)
  const generateConversationImage = (sessionId: string) => {
    const session = getSession(sessionId);
    if (!session) return;
    
    // This is a placeholder function
    // In a real implementation, you would generate an image from the conversation
    console.log('Generate image for session:', session.title);
    alert('Image generation feature not yet implemented');
  };

  // Add debugging for messages
  useEffect(() => {
    console.log('Current session messages:', messages.length, messages);
  }, [messages]);

  return {
    chatSessions,
    isLoaded,
    currentSessionId,
    messages,
    addSession,
    updateSession,
    deleteSession,
    clearAllSessions,
    getSession,
    createNewSession,
    switchSession,
    addMessage,
    updateSessionTitle,
    exportChatHistory,
    shareConversation,
    copyConversation,
    generateConversationImage
  };
}