'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, MessageCircle, Brain, TrendingUp, DollarSign, BarChart3, PieChart, ExternalLink, BookOpen, Building, Globe, ArrowRight, Sparkles, Upload, CheckCircle, XCircle, FileText, MessageSquare, Shield, Clock, CalendarDays, Tag, Download, Share2, Image, Copy, History, Trash2 } from 'lucide-react';
import { API_CONFIGS } from '@/lib/apiConfig';
import { useApiSettings } from '@/hooks/useApiSettings';
import { ApiStatusIndicator } from '@/components/ApiStatusIndicator';
import { useChatSessions } from '@/hooks/useChatSessions';
import { callChatApi } from '@/lib/chatApi';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ImageGenerator } from '@/components/ImageGenerator';
import { UsageLimitIndicator } from '@/components/UsageLimitIndicator';
import { UsageLimitError } from '@/components/UsageLimitError';
import AuthLogin from '@/components/AuthLogin';
import UserAvatar from '@/components/UserAvatar';
import { useAuth } from '@/components/AuthProvider';
import MobileNav from '@/components/MobileNav';


interface ApiSettings {
  [key: string]: string;
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedModel, setSelectedModel] = useState<string>('gpt-oss-120b');
  const [question, setQuestion] = useState<string>('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [imageGeneratorData, setImageGeneratorData] = useState<{
    userQuestion: string;
    assistantResponse: string;
    timestamp: string;
  } | null>(null);
  const [usageLimitError, setUsageLimitError] = useState<{
    message: string;
    resetTime?: number;
    limits?: {
      dailyLimit: number;
      hourlyLimit: number;
      cooldownMinutes: number;
    };
  } | null>(null);
  const [canSendMessage, setCanSendMessage] = useState(true);

  // Use custom hook to manage API settings
  const { 
    apiSettings, 
    isLoaded: apiSettingsLoaded, 
    saveApiSettings, 
    hasApiKey, 
    getApiKey, 
    getConfiguredModelsCount,
    isBackendModel 
  } = useApiSettings();

  // Use chat sessions hook
  const {
    messages,
    addMessage,
    createNewSession,
    currentSessionId,
    exportChatHistory,
    shareConversation,
    copyConversation,
    generateConversationImage,
    chatSessions,
    switchSession,
    deleteSession
  } = useChatSessions();

  const gptOssAreas = [
    { icon: TrendingUp, title: 'Model Comparison', desc: 'In-depth comparison of different open-source GPT models' },
    { icon: DollarSign, title: 'Cost Analysis', desc: 'Cost-benefit analysis of open-source vs commercial models' },
    { icon: BarChart3, title: 'Performance Benchmarks', desc: 'Benchmark tests and real-world application evaluations' },
    { icon: PieChart, title: 'Technical Guides', desc: 'Practical tutorials for model deployment and optimization' },
  ];

  // Featured blog posts for homepage
  const featuredBlogPosts = [
    {
      id: 6,
      slug: 'gpt-oss-120b-vs-openai-o4-mini-comparison',
      title: 'GPT-OSS-120B ≈ o4-mini? Why Open-Source Models Are Catching Up with OpenAI',
      description: 'Performance comparison analysis between GPT-OSS-120B and OpenAI o4-mini, open-source models are rapidly catching up with closed-source models, achieving similar levels in multiple key metrics.',
      author: 'AI Technology Analyst',
      date: '2025-08-06',
      readTime: '15 min read',
      tags: ['GPT-OSS', 'OpenAI', 'Open Source AI', 'Model Comparison', 'Technical Analysis'],
      category: 'Technical Analysis'
    },
    {
      id: 7,
      slug: 'gpt-oss-120b-vs-20b-which-model-to-choose',
      title: 'GPT-OSS-120B vs GPT-OSS-20B: Which One Should You Use?',
      description: 'Detailed comparison analysis of GPT-OSS-120B and GPT-OSS-20B, helping developers choose the most suitable open-source language model based on specific requirements, including comprehensive evaluation of performance, cost, and hardware requirements.',
      author: 'AI Product Manager',
      date: '2025-08-06',
      readTime: '12 min read',
      tags: ['GPT-OSS', 'Model Selection', 'Performance Comparison', 'Cost Analysis'],
      category: 'Usage Guide'
    },
    {
      id: 8,
      slug: 'what-is-gpt-oss',
      title: 'What is GPT-OSS?',
      description: 'Complete guide to GPT-OSS open-source GPT models, from basic concepts to practical applications, providing deep insights into the advantages, features, and usage methods of open-source GPT models.',
      author: 'AI Technology Evangelist',
      date: '2025-08-06',
      readTime: '10 min read',
      tags: ['GPT-OSS', 'Open Source AI', 'Technical Guide', 'AI Basics'],
      category: 'Technical Tutorial'
    }
  ];

  const resourceCategories = [
    {
      title: 'Open Source AI Platforms',
      icon: Building,
      iconColor: 'text-blue-600',
      resources: [
        { name: 'Hugging Face', url: 'https://huggingface.co/', desc: 'Open-source AI models and datasets hub' },
        { name: 'GitHub AI', url: 'https://github.com/topics/artificial-intelligence', desc: 'Open-source AI projects and repositories' },
        { name: 'Papers with Code', url: 'https://paperswithcode.com/', desc: 'Machine learning research papers with code implementations' },
        { name: 'ModelScope', url: 'https://modelscope.cn/', desc: 'Community-driven platform for AI model sharing' }
      ]
    },
    {
      title: 'Academic & Research Resources',
      icon: BookOpen,
      iconColor: 'text-green-600', 
      resources: [
        { name: 'arXiv AI/ML', url: 'https://arxiv.org/list/cs.AI/recent', desc: 'Latest AI and machine learning research papers' },
        { name: 'Google AI Research', url: 'https://ai.google/research/', desc: 'Cutting-edge AI research and publications' },
        { name: 'OpenAI Research', url: 'https://openai.com/research/', desc: 'Advanced AI research and model developments' },
        { name: 'Meta AI Research', url: 'https://ai.meta.com/research/', desc: 'Open research in AI and machine learning' }
      ]
    }
  ];

  const handleStartChat = async () => {
    // Check if model is available (either backend configured or user has API key)
    if (!hasApiKey(selectedModel)) {
      alert('Please configure API key first');
      setSettingsOpen(true);
      return;
    }

    // Show chat interface
    setShowChat(true);
    
    // If there's a question, send it immediately
    if (question.trim()) {
      await sendMessage(question.trim());
      setQuestion(''); // Clear the input after sending
    }
  };

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading || !canSendMessage) return;

    // Clear any previous usage limit errors
    setUsageLimitError(null);
    setIsLoading(true);
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: messageContent,
      timestamp: new Date(),
      model: selectedModel
    };
    addMessage(userMessage);

    try {
      // Get API key (could be 'backend' for backend models)
      const apiKey = getApiKey(selectedModel);
      const useBackendKey = isBackendModel(selectedModel);
      
      // Call chat API
      const result = await callChatApi({
        prompt: messageContent,
        model: selectedModel,
        userApiKey: useBackendKey ? undefined : apiKey,
        useBackendKey,
        isAuthenticated: !!user
      });

      if (result.success && result.response) {
        // Add AI response
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai' as const,
          content: result.response,
          timestamp: new Date(),
          model: selectedModel
        };
        addMessage(aiMessage);
      } else if (result.error === 'Usage limit exceeded') {
        // Handle usage limit error
        setUsageLimitError({
          message: result.message || 'Usage limit reached',
          resetTime: result.resetTime,
          limits: result.limits
        });
        setCanSendMessage(false);
        
        // Set a timer to re-enable sending if there's a reset time
        if (result.resetTime) {
          const timeUntilReset = result.resetTime - Date.now();
          if (timeUntilReset > 0) {
            setTimeout(() => {
              setUsageLimitError(null);
              setCanSendMessage(true);
            }, timeUntilReset);
          }
        }
      } else {
        // Add error message
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai' as const,
          content: `Sorry, there was an error: ${result.error || 'Unknown error'}`,
          timestamp: new Date(),
          model: selectedModel
        };
        addMessage(errorMessage);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date(),
        model: selectedModel
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsageLimitRetry = () => {
    setUsageLimitError(null);
    setCanSendMessage(true);
  };

  // Home page doesn't need temporary API settings, save directly
  const handleApiSettingChange = (modelKey: string, value: string) => {
    const newSettings = {
      ...apiSettings,
      [modelKey]: value
    };
    saveApiSettings(newSettings);
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Navigation bar height
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleGetStarted = () => {
    scrollToSection('get-started');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-200 econai-mobile-header">
        <div className="max-w-7xl mx-auto px-6 py-4 econai-safe-area-left econai-safe-area-right">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <img src="/extension_icon.png" alt="GPT-OSS Blog" className="w-12 h-12 rounded-xl" />
              </div>
              <div>
                <span className="text-lg font-semibold text-slate-800">GPT-OSS Blog</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium"
                onClick={() => scrollToSection('features')}
              >
                Core Areas
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium"
                onClick={() => scrollToSection('how-it-works')}
              >
                Chat
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium"
                onClick={() => scrollToSection('try-now')}
              >
                Best Practices
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium"
                onClick={() => scrollToSection('blog-posts')}
              >
                Articles
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium"
                onClick={() => scrollToSection('resources')}
              >
                Resources
              </Button>
              <Button 
                className="econai-button-primary px-6 econai-touch-button"
                onClick={() => router.push('/blog')}
              >
                Blog
              </Button>
              
              {/* Desktop Authentication */}
              {user ? (
                <UserAvatar />
              ) : (
                <Button 
                  className="econai-button-primary px-3 md:px-4 econai-touch-button"
                  onClick={() => setLoginOpen(true)}
                >
                  Sign In
                </Button>
              )}
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <MobileNav 
                onScrollToSection={scrollToSection}
                onLoginOpen={() => setLoginOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 econai-safe-area-left econai-safe-area-right">
        {/* Hero Section */}
        <section id="features" className="text-center py-8 md:py-12 econai-mobile-hero">
          <div className="mb-4">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-3 w-3 mr-2" />
              Open Source GPT Models Tech Blog
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight econai-mobile-text-lg">
            <span className="econai-gradient-text">GPT-OSS Blog</span>
          </h1>
          <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold mb-8 text-slate-700 leading-tight econai-mobile-text-base">
            Explore Open Source GPT Models Unlimited Potential
          </h2>
          
          {/* GPT-OSS Specialization Areas */}
          <div className="mb-8 econai-mobile-spacing">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 econai-mobile-text-lg">GPT-OSS Core Areas</h3>
            <p className="text-sm md:text-base text-slate-600 mb-6 econai-mobile-text-sm">Comprehensive coverage of all important aspects of open-source GPT models</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto econai-mobile-grid econai-tablet-grid">
              {gptOssAreas.map((area, index) => (
                <Card key={index} className="econai-card econai-mobile-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0">
                  <CardHeader className="pb-2 pt-4">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3">
                      <area.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-sm md:text-base text-slate-800 econai-mobile-text-sm">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-1 pb-4">
                    <CardDescription className="text-xs md:text-sm text-slate-600 leading-relaxed econai-mobile-text-sm">{area.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
            <Button 
              onClick={() => scrollToSection('how-it-works')}
              className="econai-button-primary px-6 py-3 text-base h-auto w-full sm:w-auto econai-mobile-button econai-touch-button"
            >
              Start Chatting
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* Unified Chat Interface */}
        <section id="how-it-works" className="mb-8 md:mb-16">
          <Card className="econai-card econai-mobile-card border-0 max-w-6xl mx-auto p-4 md:p-8 econai-mobile-chat">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 econai-mobile-text-lg">
                {showChat ? `Chat with ${API_CONFIGS[selectedModel].name}` : 'Start Chatting'}
              </h2>
              <div className="flex flex-col items-center justify-center space-y-2 mt-2">
                <div className="text-xs md:text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 econai-mobile-text-sm">
                  ⚠️ Free users: 3 messages/day, 2 messages/hour
                </div>
                {!showChat && (
                  <p className="text-sm md:text-base text-slate-600 econai-mobile-text-sm">Select your preferred AI model and begin your GPT-OSS exploration</p>
                )}
              </div>
            </div>

            {/* AI Model Selection - Always visible */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-3">
                <h3 className="text-sm md:text-base font-semibold text-slate-800 econai-mobile-text-sm">Available AI Models</h3>
              </div>
              <div className="flex justify-center mb-4">
                <div className="flex flex-col items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border w-full max-w-4xl">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Object.entries(API_CONFIGS).map(([key, config]) => (
                      <Button
                        key={key}
                        variant={selectedModel === key ? "default" : "ghost"}
                        onClick={() => {
                           setSelectedModel(key);
                           if (showChat) {
                             // If chat is active, reset messages when switching models
                             createNewSession();
                           }
                         }}
                        className={`min-w-[100px] md:min-w-[120px] h-10 text-xs md:text-sm transition-all duration-200 econai-touch-button ${
                          selectedModel === key 
                            ? 'econai-button-primary shadow-lg' 
                            : 'hover:bg-white hover:shadow-md'
                        }`}
                      >
                        {config.name}
                      </Button>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 text-center">
                    More models are being deployed
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={exportChatHistory}
                    className="text-slate-500 hover:text-slate-700 text-xs md:text-sm econai-touch-button"
                  >
                    <Download className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                    <span className="hidden sm:inline">Save History</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setHistoryOpen(true)}
                    className="text-slate-500 hover:text-slate-700 text-xs md:text-sm econai-touch-button"
                  >
                    <History className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                    <span className="hidden sm:inline">View History</span>
                    <span className="sm:hidden">History</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setShowChat(false);
                      createNewSession();
                    }}
                    className="text-slate-500 hover:text-slate-700 text-xs md:text-sm econai-touch-button"
                  >
                    <span className="hidden sm:inline">Reset Chat</span>
                    <span className="sm:hidden">Reset</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Chat Messages - Show when chat is active */}
            {showChat && (
              <div className="mb-6">
                <div className="bg-slate-50 rounded-lg p-2 md:p-4 max-h-[400px] md:max-h-[600px] overflow-y-auto space-y-4 econai-mobile-chat-messages">
                  {messages.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                      <MessageCircle className="h-8 md:h-12 w-8 md:w-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-sm md:text-base econai-mobile-text-sm">Start a conversation with {API_CONFIGS[selectedModel].name}</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          id={`message-${message.id}`}
                          className={`max-w-[90%] md:max-w-[80%] p-2 md:p-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white border shadow-sm'
                        }`}>
                          {message.type === 'ai' ? (
                            <div className="text-xs md:text-sm econai-mobile-text-sm">
                              <MarkdownRenderer content={message.content} />
                            </div>
                          ) : (
                            <div className="text-xs md:text-sm whitespace-pre-wrap econai-mobile-text-sm">{message.content}</div>
                          )}
                          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                            <div className={`text-xs ${
                              message.type === 'user' ? 'text-blue-100' : 'text-slate-400'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                            {/* Action buttons for AI messages */}
                            {message.type === 'ai' && (
                              <div className="flex flex-wrap gap-1 items-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    navigator.clipboard.writeText(message.content).then(() => {
                                      alert('AI reply copied to clipboard!');
                                    }).catch(() => {
                                      alert('Copy failed, please select and copy manually');
                                    });
                                  }}
                                  className="h-8 w-8 md:h-6 md:w-6 p-0 text-slate-400 hover:text-slate-600 econai-touch-button"
                                  title="Copy Content"
                                >
                                  <Copy className="w-4 h-4 md:w-3 md:h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // Get user question (find corresponding user message from chat history)
                                    const rawUserQuestion = messages.find(m => m.type === 'user' && messages.indexOf(m) === messages.indexOf(message) - 1)?.content || 'User Question';
                                    
                                    setImageGeneratorData({
                                      userQuestion: rawUserQuestion,
                                      assistantResponse: message.content,
                                      timestamp: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')
                                    });
                                  }}
                                  className="h-8 w-8 md:h-6 md:w-6 p-0 text-slate-400 hover:text-slate-600 econai-touch-button"
                                  title="Generate Image"
                                >
                                  <Image className="w-4 h-4 md:w-3 md:h-3" />
                                </Button>
                                <div className="flex items-center flex-wrap gap-1 md:gap-2">
                                  <span className="text-xs text-slate-500 hidden sm:inline">Share:</span>
                                  <button
                                    onClick={() => {
                                      const summary = message.content.length > 100 ? message.content.slice(0, 100) + '...' : message.content;
                                      const text = encodeURIComponent(`🤖 GPT-OSS AI Assistant Reply:\n\n"${summary}"\n\n💡 Explore more AI content at: https://gptoss.blog/`);
                                      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
                                    }}
                                    className="p-1.5 md:p-1 hover:bg-gray-100 rounded transition-colors econai-touch-button"
                                    title="Share to X"
                                  >
                                    <img src="https://favicon.im/x.com" alt="x.com favicon" className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const summary = message.content.length > 200 ? message.content.slice(0, 200) + '...' : message.content;
                                      const title = encodeURIComponent(`GPT-OSS AI Assistant Reply Share`);
                                      const text = encodeURIComponent(`${summary}\n\nSource: GPT-OSS Blog - Open Source GPT Models Technical Blog`);
                                      const url = encodeURIComponent('https://gptoss.blog/');
                                      window.open(`https://www.reddit.com/submit?title=${title}&text=${text}&url=${url}`, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes');
                                    }}
                                    className="p-1.5 md:p-1 hover:bg-gray-100 rounded transition-colors econai-touch-button"
                                    title="Share to Reddit"
                                  >
                                    <img src="https://favicon.im/Reddit.com?larger=true" alt="Reddit.com favicon (large)" className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const summary = message.content.length > 150 ? message.content.slice(0, 150) + '...' : message.content;
                                      const quote = encodeURIComponent(`🤖 GPT-OSS AI Assistant Reply: "${summary}" - Source: GPT-OSS Blog Open Source GPT Models Technical Blog`);
                                      const url = encodeURIComponent('https://gptoss.blog/');
                                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
                                    }}
                                    className="p-1.5 md:p-1 hover:bg-gray-100 rounded transition-colors econai-touch-button"
                                    title="Share to Facebook"
                                  >
                                    <img src="https://favicon.im/facebook.com" alt="facebook.com favicon" className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const summary = message.content.length > 180 ? message.content.slice(0, 180) + '...' : message.content;
                                      const text = encodeURIComponent(`🤖 GPT-OSS AI Assistant Excellent Reply: "${summary}" 💡 Explore more AI technical content`);
                                      const url = encodeURIComponent('https://gptoss.blog/');
                                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
                                    }}
                                    className="p-1.5 md:p-1 hover:bg-gray-100 rounded transition-colors econai-touch-button"
                                    title="Share to LinkedIn"
                                  >
                                    <img src="https://favicon.im/LinkedIn.com?larger=true" alt="LinkedIn.com favicon (large)" className="w-4 h-4" />
                                  </button>
                                </div>

                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border shadow-sm p-2 md:p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          <span className="text-xs md:text-sm text-slate-600 econai-mobile-text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Usage Limit Error - Show when there's a usage limit error */}
            {usageLimitError && (
              <div className="mb-4">
                <UsageLimitError
                  message={usageLimitError.message}
                  resetTime={usageLimitError.resetTime}
                  limits={usageLimitError.limits}
                  onRetry={handleUsageLimitRetry}
                />
              </div>
            )}

            {/* Usage Limit Indicator - Show when using backend models */}
            {isBackendModel(selectedModel) && showChat && (
              <div className="mb-4">
                <UsageLimitIndicator
                  onUsageUpdate={(canSend) => setCanSendMessage(canSend)}
                  className="max-w-md mx-auto"
                  isAuthenticated={!!user}
                />
              </div>
            )}

            {/* Input Area - Always visible */}
            <div id="get-started" className="space-y-4 econai-mobile-spacing">
              <div>
                <label className="text-xs md:text-sm font-medium mb-2 block text-slate-700 econai-mobile-text-sm">
                  {showChat ? 'Continue the conversation' : 'Your GPT-OSS Question (Optional)'}
                </label>
                <Textarea
                  placeholder={showChat ? "Ask anything about GPT-OSS models..." : "e.g., Compare GPT-OSS-120B vs OpenAI GPT-4 performance..."}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  className="text-xs md:text-sm econai-mobile-text-sm econai-mobile-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (question.trim()) {
                        if (showChat) {
                          sendMessage(question.trim());
                          setQuestion('');
                        } else {
                          handleStartChat();
                        }
                      }
                    }
                  }}
                />
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => {
                    if (showChat) {
                      if (question.trim()) {
                        sendMessage(question.trim());
                        setQuestion('');
                      }
                    } else {
                      handleStartChat();
                    }
                  }}
                  disabled={!question.trim() || isLoading || (!canSendMessage && isBackendModel(selectedModel))}
                  className="econai-button-primary py-3 md:py-4 text-sm md:text-lg h-auto px-6 md:px-12 min-w-[160px] md:min-w-[200px] econai-mobile-button econai-touch-button"
                >
                  <MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
                  <span className="hidden sm:inline">{isLoading ? 'Sending...' : (showChat ? 'Send Message' : (question.trim() ? 'Start Analysis Chat' : 'Start Chat'))}</span>
                  <span className="sm:hidden">{isLoading ? 'Sending...' : (showChat ? 'Send' : 'Start')}</span>
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 md:ml-3" />
                </Button>
              </div>

              {!showChat && question.trim() && (
                <div className="bg-slate-50 rounded-lg p-2 md:p-3 border econai-mobile-card">
                  <p className="text-xs text-slate-600 mb-1 econai-mobile-text-sm">
                    <strong>Preview:</strong> You will ask {API_CONFIGS[selectedModel].name}:
                  </p>
                  <p className="text-xs md:text-sm text-slate-700 italic econai-mobile-text-sm">&ldquo;{question}&rdquo;</p>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Best Practices for GPT-OSS Research */}
        <section id="try-now" className="mb-12 md:mb-20 econai-mobile-spacing">
          <Card className="econai-card border-0 max-w-6xl mx-auto p-4 md:p-8 econai-mobile-card">
            <div className="mb-6 md:mb-8">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                </div>
                <h2 className="text-lg md:text-2xl font-bold text-slate-800 econai-mobile-text-lg">Best Practices for GPT-OSS Research</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
              {/* Effective Questions */}
              <div>
                <div className="flex items-center mb-3 md:mb-4">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600 mr-2" />
                  <h3 className="text-base md:text-lg font-semibold text-slate-800 econai-mobile-text-base">Effective Questions to Ask</h3>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <div className="border-l-4 border-green-500 bg-green-50 p-3 md:p-4 rounded-r-lg">
                    <p className="text-xs md:text-sm text-slate-700 italic econai-mobile-text-sm">
                      &ldquo;Compare GPT-OSS-120B vs GPT-OSS-20B performance on coding tasks&rdquo;
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50 p-3 md:p-4 rounded-r-lg">
                    <p className="text-xs md:text-sm text-slate-700 italic econai-mobile-text-sm">
                      &ldquo;What are the hardware requirements for running GPT-OSS-120B locally?&rdquo;
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50 p-3 md:p-4 rounded-r-lg">
                    <p className="text-xs md:text-sm text-slate-700 italic econai-mobile-text-sm">
                      &ldquo;How does GPT-OSS compare to OpenAI GPT-4 in terms of accuracy and cost?&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions to Avoid */}
              <div>
                <div className="flex items-center mb-3 md:mb-4">
                  <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-600 mr-2" />
                  <h3 className="text-base md:text-lg font-semibold text-slate-800 econai-mobile-text-base">Questions to Avoid</h3>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <div className="border-l-4 border-red-500 bg-red-50 p-3 md:p-4 rounded-r-lg">
                    <p className="text-xs md:text-sm text-slate-700 italic econai-mobile-text-sm">
                      &ldquo;Which model is the best?&rdquo; (Too vague, specify use case)
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 bg-red-50 p-3 md:p-4 rounded-r-lg">
                    <p className="text-xs md:text-sm text-slate-700 italic econai-mobile-text-sm">
                      &ldquo;Help me generate harmful content&rdquo; (Against ethical guidelines)
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 bg-red-50 p-3 md:p-4 rounded-r-lg">
                    <p className="text-xs md:text-sm text-slate-700 italic econai-mobile-text-sm">
                      Questions without specifying model version or specific requirements
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Tips */}
            <div>
              <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-4 md:mb-6 econai-mobile-text-base">GPT-OSS Research Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-slate-800 mb-2 econai-mobile-text-sm">Specify Model Version</h4>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed econai-mobile-text-sm">
                    Always mention specific GPT-OSS model versions (20B, 120B) for accurate comparisons
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-slate-800 mb-2 econai-mobile-text-sm">Include Use Cases</h4>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed econai-mobile-text-sm">
                    Describe your specific use case (coding, writing, analysis) for better recommendations
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-slate-800 mb-2 econai-mobile-text-sm">Consider Resources</h4>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed econai-mobile-text-sm">
                    Factor in hardware requirements, costs, and performance trade-offs
                  </p>
                </div>
              </div>
            </div>

          </Card>
        </section>

        {/* Featured Blog Posts */}
        <section id="blog-posts" className="mb-12 md:mb-20 econai-mobile-spacing">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-3 md:mb-4 econai-mobile-text-lg">Featured Articles</h2>
            <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto econai-mobile-text-base">
              Explore our latest insights on open-source GPT models, performance comparisons, and technical guides
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
            {featuredBlogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                <Card className="econai-card border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full econai-mobile-card">
                  <CardHeader className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <Badge variant="outline" className="text-xs text-slate-700 border-slate-300">{post.category}</Badge>
                      <div className="flex items-center text-xs md:text-sm text-slate-600 econai-mobile-text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-base md:text-lg hover:text-blue-600 transition-colors line-clamp-2 econai-mobile-text-base">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-xs md:text-sm leading-relaxed text-slate-800 econai-mobile-text-sm">
                      {post.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className="flex items-center text-xs md:text-sm text-gray-500 econai-mobile-text-sm">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <span className="text-xs md:text-sm text-gray-600 econai-mobile-text-sm">{post.author}</span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3 md:mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs md:text-sm font-medium hover:text-blue-600 transition-colors econai-mobile-text-sm">
                      <span>Read Article</span>
                      <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* View All Blog Posts Button */}
          <div className="text-center mt-8 md:mt-12">
            <Button
              onClick={() => router.push('/blog')}
              variant="outline"
              className="px-6 md:px-8 py-2 md:py-3 text-sm md:text-base h-auto group econai-mobile-button econai-touch-button"
            >
              <span className="hidden sm:inline">View All Articles</span>
              <span className="sm:hidden">All Articles</span>
              <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
        </section>

        {/* AI Knowledge Resources */}
        <section id="resources" className="mb-16 md:mb-20 econai-mobile-spacing">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-3 md:mb-4 econai-mobile-text-2xl">AI Knowledge Resources</h2>
            <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto econai-mobile-text-base">
              Curated collection of free, high-quality AI resources to enhance your 
              research and understanding
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            {resourceCategories.map((category, index) => (
              <Card key={index} className="econai-card border-0 p-4 md:p-8 econai-mobile-card">
                <div className="mb-4 md:mb-6">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center mr-2 md:mr-3 ${
                      category.iconColor === 'text-blue-600' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      <category.icon className={`h-4 w-4 md:h-5 md:w-5 ${category.iconColor}`} />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 econai-mobile-text-lg">{category.title}</h3>
                  </div>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  {category.resources.map((resource, resourceIndex) => (
                    <div 
                      key={resourceIndex} 
                      className="group cursor-pointer econai-touch-button"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <div className="flex items-center justify-between p-3 md:p-4 rounded-xl hover:bg-slate-50 transition-all duration-200">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm md:text-base text-slate-800 mb-1 group-hover:text-blue-600 transition-colors econai-mobile-text-sm">
                            {resource.name}
                          </h4>
                          <p className="text-xs md:text-sm text-slate-600 leading-relaxed econai-mobile-text-xs">
                            {resource.desc}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 ml-3 md:ml-4 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

        </section>

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className="econai-dialog econai-api-dialog max-w-2xl overflow-hidden flex flex-col econai-mobile-dialog">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-lg md:text-xl econai-mobile-text-lg">API Key Configuration</DialogTitle>
              <DialogDescription className="text-sm md:text-base econai-mobile-text-sm">
                Configure API keys for each AI model. Click the links below to get API keys.
              </DialogDescription>
            </DialogHeader>
            
            {/* Scrollable area */}
            <div className="flex-1 api-scroll-area space-y-4 md:space-y-6 mt-4 md:mt-6 pr-2">
              {Object.entries(API_CONFIGS).filter(([key, config]) => config).map(([key, config]) => {
                // Define API application links for each model
                const getApiLink = (modelKey: string) => {
                  switch (modelKey) {
                    case 'openai':
                      return 'https://platform.openai.com/api-keys';
                    case 'deepseek':
                      return 'https://platform.deepseek.com/api_keys';
                    case 'gemini':
                      return 'https://aistudio.google.com/app/apikey';
                    case 'claude':
                      return 'https://console.anthropic.com/settings/keys';
                    case 'qwen':
                      return 'https://dashscope.console.aliyun.com/api-key';
                    case 'gpt-oss-20b':
                    case 'gpt-oss-120b':
                      return 'https://fireworks.ai/api-keys';
                    default:
                      return '#';
                  }
                };

                return (
                  <div key={key} className="econai-api-model-card space-y-2 md:space-y-3 p-3 md:p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <label htmlFor={`api-key-${key}`} className="font-medium text-sm md:text-base text-slate-800 econai-mobile-text-sm">
                        {config.name}
                      </label>
                      <a
                        href={getApiLink(key)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="econai-api-link text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium econai-mobile-text-xs"
                      >
                        Get API Key →
                      </a>
                    </div>
                    <Input
                      id={`api-key-${key}`}
                      type="password"
                      placeholder={`Enter ${config.name} API key`}
                      value={getApiKey(key)}
                      onChange={(e) => handleApiSettingChange(key, e.target.value)}
                      className="bg-white text-sm md:text-base econai-mobile-input"
                    />
                    {hasApiKey(key) && !isBackendModel(key) && (
                      <div className="flex items-center text-xs text-green-600 econai-mobile-text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        API Key Configured
                      </div>
                    )}
                    {isBackendModel(key) && (
                      <div className="flex items-center text-xs text-blue-600 econai-mobile-text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ready to Use
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Fixed button area at bottom */}
            <div className="flex-shrink-0 flex justify-end space-x-2 md:space-x-3 mt-4 md:mt-6 pt-4 md:pt-6 border-t econai-dialog-footer">
              <Button variant="outline" onClick={() => setSettingsOpen(false)} className="px-3 md:px-4 py-2 text-sm md:text-base econai-mobile-button">
                Cancel
              </Button>
              <Button onClick={() => setSettingsOpen(false)} className="econai-button-primary px-3 md:px-4 py-2 text-sm md:text-base econai-mobile-button">
                Save Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Footer */}
      <footer className="mt-16 md:mt-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-6 md:mb-8">
            {/* Brand Section */}
            <div className="md:col-span-5 flex flex-col">
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 md:mr-3">
                  <Brain className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <span className="text-lg md:text-xl font-bold econai-mobile-text-lg">GPT-OSS Blog</span>
              </div>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 econai-mobile-text-xs">
                Technical blog focused on open-source GPT models, providing in-depth comparative analysis, usage guides, and AI chat functionality.
              </p>
              <div className="flex items-center text-xs md:text-sm text-slate-400 econai-mobile-text-xs">
                <Globe className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span>Open Source AI Technology Sharing</span>
              </div>
            </div>

            {/* Platform and Resources Container */}
            <div className="md:col-span-7 grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Platform Links */}
              <div className="flex flex-col">
                <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base text-slate-200 econai-mobile-text-sm">Platform</h4>
                <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
                  <li><a href="#features" className="text-slate-300 hover:text-blue-400 transition-colors block econai-mobile-text-xs">Core Areas</a></li>
                  <li><a href="#how-it-works" className="text-slate-300 hover:text-blue-400 transition-colors block econai-mobile-text-xs">Chat</a></li>
                  <li><a href="#try-now" className="text-slate-300 hover:text-blue-400 transition-colors block econai-mobile-text-xs">Best Practices</a></li>
                  <li><a href="#blog-posts" className="text-slate-300 hover:text-blue-400 transition-colors block econai-mobile-text-xs">Articles</a></li>
                  <li><a href="#resources" className="text-slate-300 hover:text-blue-400 transition-colors block econai-mobile-text-xs">Resources</a></li>
                </ul>
              </div>

              {/* Resources Links */}
              <div className="flex flex-col">
                <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base text-slate-200 econai-mobile-text-sm">Resources</h4>
                <div className="grid grid-cols-2 gap-x-3 md:gap-x-4 gap-y-1 md:gap-y-2 text-xs md:text-sm text-slate-300">
                  <a href="https://huggingface.co/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors econai-mobile-text-xs">Hugging Face</a>
                  <a href="https://github.com/topics/artificial-intelligence" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors econai-mobile-text-xs">GitHub AI</a>
                  <a href="https://paperswithcode.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors econai-mobile-text-xs">Papers with Code</a>
                  <a href="https://modelscope.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors econai-mobile-text-xs">ModelScope</a>
                  <a href="https://arxiv.org/list/cs.AI/recent" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors econai-mobile-text-xs">arXiv AI/ML</a>
                  <a href="https://ai.google/research/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors econai-mobile-text-xs">Google AI Research</a>
                  <a href="https://openai.com/research/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors econai-mobile-text-xs">OpenAI Research</a>
                  <a href="https://ai.meta.com/research/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors econai-mobile-text-xs">Meta AI Research</a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-700 pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-3 md:mb-0">
                <p className="text-xs md:text-sm text-slate-400 econai-mobile-text-xs">
                  © 2025 GPT-OSS Blog. All rights reserved.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6 text-xs md:text-sm text-slate-400">
                <div className="flex items-center">
                  <Shield className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  <span className="econai-mobile-text-xs">Secure & Confidential</span>
                </div>
                <div className="flex items-center">
                  <Brain className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  <span className="econai-mobile-text-xs">AI-Powered Research</span>
                </div>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 leading-relaxed econai-mobile-text-xs">
                <strong>Disclaimer:</strong> GPT-OSS Blog provides technical analysis and research tools for open-source AI models. Generated information should be verified with original sources before making important decisions. This platform is for educational and research purposes only. Users are responsible for ensuring compliance with relevant copyright laws and academic integrity policies.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat History Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col econai-mobile-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center text-lg md:text-xl econai-mobile-text-lg">
              <History className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Chat History
            </DialogTitle>
            <DialogDescription className="text-slate-700 text-sm md:text-base econai-mobile-text-sm">
              View and switch to previous chat sessions
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 space-y-2 md:space-y-3">
            {chatSessions.length === 0 ? (
              <div className="text-center py-6 md:py-8 text-slate-700">
                <MessageCircle className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-slate-400" />
                <p className="text-sm md:text-base econai-mobile-text-sm">No chat history</p>
              </div>
            ) : (
              chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 md:p-4 rounded-lg border cursor-pointer transition-colors econai-touch-button ${
                    session.id === currentSessionId
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                  onClick={() => {
                    switchSession(session.id);
                    setShowChat(true);
                    setHistoryOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800 mb-1">
                        {session.title || 'Untitled Chat'}
                      </h4>
                      <div className="flex items-center space-x-4 text-xs text-slate-700">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(session.createdAt).toLocaleString('en-US')}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {session.messages.length} messages
                        </div>
                      </div>
                      {session.messages.length > 0 && (
                        <p className="text-sm text-slate-800 mt-2 line-clamp-2">
                          {session.messages[session.messages.length - 1].content.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      {session.id === currentSessionId && (
                        <Badge variant="secondary">
                          Current
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
                            deleteSession(session.id);
                            // If deleting current session, switch to first available session or create new one
                            if (session.id === currentSessionId) {
                              const remainingSessions = chatSessions.filter(s => s.id !== session.id);
                              if (remainingSessions.length > 0) {
                                switchSession(remainingSessions[0].id);
                              } else {
                                createNewSession();
                              }
                            }
                          }
                        }}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 h-auto"
                        title="Delete Chat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-slate-200 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setHistoryOpen(false)}
              className="px-4 py-2 text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 font-medium"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                createNewSession();
                setShowChat(true);
                setHistoryOpen(false);
              }}
              className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white font-medium"
            >
              New Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Generator Modal */}
      {imageGeneratorData && (
        <Dialog open={!!imageGeneratorData} onOpenChange={() => setImageGeneratorData(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate Share Image</DialogTitle>
              <DialogDescription className="text-gray-900">
                Preview and generate share image for AI conversation
              </DialogDescription>
            </DialogHeader>
            <ImageGenerator
              userQuestion={imageGeneratorData.userQuestion}
              assistantResponse={imageGeneratorData.assistantResponse}
              timestamp={imageGeneratorData.timestamp}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Login Dialog */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="max-w-lg border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <DialogHeader className="sr-only">
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>Choose your sign-in method</DialogDescription>
          </DialogHeader>
          <div className="p-2">
            <AuthLogin onClose={() => setLoginOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}