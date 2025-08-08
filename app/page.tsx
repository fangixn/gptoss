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


interface ApiSettings {
  [key: string]: string;
}

export default function Home() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<string>('gpt-oss-120b');
  const [question, setQuestion] = useState<string>('');
  const [settingsOpen, setSettingsOpen] = useState(false);
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
        useBackendKey
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
          message: result.message || '使用限制已达到',
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
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <img src="/extension_icon.png" alt="GPT-OSS Blog" className="w-12 h-12 rounded-xl" />
              </div>
              <div>
                <span className="text-lg font-semibold text-slate-800">GPT-OSS Blog</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
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
                className="econai-button-primary px-6"
                onClick={() => router.push('/blog')}
              >
                Blog
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section id="features" className="text-center py-12">
          <div className="mb-4">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-3 w-3 mr-2" />
              Open Source GPT Models Tech Blog
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="econai-gradient-text">GPT-OSS Blog</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-slate-700 leading-tight">
            Explore Open Source GPT Models Unlimited Potential
          </h2>
          
          {/* GPT-OSS Specialization Areas */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">GPT-OSS Core Areas</h3>
            <p className="text-base text-slate-600 mb-6">Comprehensive coverage of all important aspects of open-source GPT models</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {gptOssAreas.map((area, index) => (
                <Card key={index} className="econai-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0">
                  <CardHeader className="pb-2 pt-4">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3">
                      <area.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-base text-slate-800">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-1 pb-4">
                    <CardDescription className="text-sm text-slate-600 leading-relaxed">{area.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center space-x-3 mt-6">
            <Button 
              onClick={() => scrollToSection('how-it-works')}
              className="econai-button-primary px-6 py-3 text-base h-auto"
            >
              Start Chatting
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

          </div>
        </section>

        {/* Unified Chat Interface */}
        <section id="how-it-works" className="mb-16">
          <Card className="econai-card border-0 max-w-6xl mx-auto p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {showChat ? `Chat with ${API_CONFIGS[selectedModel].name}` : 'Start Chatting'}
              </h2>
              <div className="flex flex-col items-center justify-center space-y-2 mt-2">
                <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  ⚠️ Each IP is limited to 2 uses
                </div>
                {!showChat && (
                  <p className="text-base text-slate-600">Select your preferred AI model and begin your GPT-OSS exploration</p>
                )}
              </div>
            </div>

            {/* AI Model Selection - Always visible */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-3">
                <h3 className="text-base font-semibold text-slate-800">Available AI Models</h3>
              </div>
              <div className="flex justify-center mb-4">
                <div className="flex flex-wrap gap-2 bg-slate-50 p-2.5 rounded-2xl border">
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
                      className={`min-w-[120px] h-10 text-sm transition-all duration-200 ${
                        selectedModel === key 
                          ? 'econai-button-primary shadow-lg' 
                          : 'hover:bg-white hover:shadow-md'
                      }`}
                    >
                      {config.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={exportChatHistory}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Save History
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setHistoryOpen(true)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <History className="w-4 h-4 mr-1" />
                    View History
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setShowChat(false);
                      createNewSession();
                    }}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Reset Chat
                  </Button>
                </div>
              </div>
            </div>

            {/* Chat Messages - Show when chat is active */}
            {showChat && (
              <div className="mb-6">
                <div className="bg-slate-50 rounded-lg p-4 max-h-[600px] overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>Start a conversation with {API_CONFIGS[selectedModel].name}</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          id={`message-${message.id}`}
                          className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white border shadow-sm'
                        }`}>
                          {message.type === 'ai' ? (
                            <div className="text-sm">
                              <MarkdownRenderer content={message.content} />
                            </div>
                          ) : (
                            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div className={`text-xs ${
                              message.type === 'user' ? 'text-blue-100' : 'text-slate-400'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                            {/* Action buttons for AI messages */}
                            {message.type === 'ai' && (
                              <div className="flex space-x-1">
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
                                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                                  title="Copy Content"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // 获取用户问题（从聊天历史中找到对应的用户消息）
                                    const rawUserQuestion = messages.find(m => m.type === 'user' && messages.indexOf(m) === messages.indexOf(message) - 1)?.content || 'User Question';
                                    
                                    setImageGeneratorData({
                                      userQuestion: rawUserQuestion,
                                      assistantResponse: message.content,
                                      timestamp: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')
                                    });
                                  }}
                                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                                  title="Generate Image"
                                >
                                  <Image className="w-3 h-3" />
                                </Button>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-slate-500">Share:</span>
                                  <button
                                    onClick={() => {
                                      const summary = message.content.length > 100 ? message.content.slice(0, 100) + '...' : message.content;
                                      const text = encodeURIComponent(`🤖 GPT-OSS AI Assistant Reply:\n\n"${summary}"\n\n💡 Explore more AI content at: https://gptoss.blog/`);
                                      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
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
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
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
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
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
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
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
                      <div className="bg-white border shadow-sm p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          <span className="text-sm text-slate-600">AI is thinking...</span>
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
                />
              </div>
            )}

            {/* Input Area - Always visible */}
            <div id="get-started" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-slate-700">
                  {showChat ? 'Continue the conversation' : 'Your GPT-OSS Question (Optional)'}
                </label>
                <Textarea
                  placeholder={showChat ? "Ask anything about GPT-OSS models..." : "e.g., Compare GPT-OSS-120B vs OpenAI GPT-4 performance..."}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  className="text-sm"
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
                  className="econai-button-primary py-4 text-lg h-auto px-12 min-w-[200px]"
                >
                  <MessageCircle className="h-5 w-5 mr-3" />
                  {isLoading ? 'Sending...' : (showChat ? 'Send Message' : (question.trim() ? 'Start Analysis Chat' : 'Start Chat'))}
                  <ArrowRight className="h-5 w-5 ml-3" />
                </Button>
              </div>

              {!showChat && question.trim() && (
                <div className="bg-slate-50 rounded-lg p-3 border">
                  <p className="text-xs text-slate-600 mb-1">
                    <strong>Preview:</strong> You will ask {API_CONFIGS[selectedModel].name}:
                  </p>
                  <p className="text-sm text-slate-700 italic">&ldquo;{question}&rdquo;</p>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Best Practices for GPT-OSS Research */}
        <section id="try-now" className="mb-20">
          <Card className="econai-card border-0 max-w-6xl mx-auto p-8">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Best Practices for GPT-OSS Research</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Effective Questions */}
              <div>
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-slate-800">Effective Questions to Ask</h3>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      &ldquo;Compare GPT-OSS-120B vs GPT-OSS-20B performance on coding tasks&rdquo;
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      &ldquo;What are the hardware requirements for running GPT-OSS-120B locally?&rdquo;
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      &ldquo;How does GPT-OSS compare to OpenAI GPT-4 in terms of accuracy and cost?&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions to Avoid */}
              <div>
                <div className="flex items-center mb-4">
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-semibold text-slate-800">Questions to Avoid</h3>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      &ldquo;Which model is the best?&rdquo; (Too vague, specify use case)
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      &ldquo;Help me generate harmful content&rdquo; (Against ethical guidelines)
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      Questions without specifying model version or specific requirements
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Tips */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-6">GPT-OSS Research Tips</h3>
              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Specify Model Version</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Always mention specific GPT-OSS model versions (20B, 120B) for accurate comparisons
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Include Use Cases</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Describe your specific use case (coding, writing, analysis) for better recommendations
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Consider Resources</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Factor in hardware requirements, costs, and performance trade-offs
                  </p>
                </div>
              </div>
            </div>

          </Card>
        </section>

        {/* Featured Blog Posts */}
        <section id="blog-posts" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Featured Articles</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Explore our latest insights on open-source GPT models, performance comparisons, and technical guides
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {featuredBlogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                <Card className="econai-card border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs text-slate-700 border-slate-300">{post.category}</Badge>
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-lg hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-sm leading-relaxed text-slate-800">
                      {post.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <span className="text-sm text-gray-600">{post.author}</span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm font-medium hover:text-blue-600 transition-colors">
                      <span>Read Article</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* View All Blog Posts Button */}
          <div className="text-center mt-12">
            <Button
              onClick={() => router.push('/blog')}
              variant="outline"
              className="px-8 py-3 text-base h-auto group"
            >
              View All Articles
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
        </section>

        {/* AI Knowledge Resources */}
        <section id="resources" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">AI Knowledge Resources</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Curated collection of free, high-quality AI resources to enhance your 
              research and understanding
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {resourceCategories.map((category, index) => (
              <Card key={index} className="econai-card border-0 p-8">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      category.iconColor === 'text-blue-600' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      <category.icon className={`h-5 w-5 ${category.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{category.title}</h3>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {category.resources.map((resource, resourceIndex) => (
                    <div 
                      key={resourceIndex} 
                      className="group cursor-pointer"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all duration-200">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                            {resource.name}
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {resource.desc}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 ml-4 flex-shrink-0" />
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
          <DialogContent className="econai-dialog econai-api-dialog max-w-2xl overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>API Key Configuration</DialogTitle>
              <DialogDescription>
                Configure API keys for each AI model. Click the links below to get API keys.
              </DialogDescription>
            </DialogHeader>
            
            {/* Scrollable area */}
            <div className="flex-1 api-scroll-area space-y-6 mt-6 pr-2">
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
                  <div key={key} className="econai-api-model-card space-y-3 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <label htmlFor={`api-key-${key}`} className="font-medium text-slate-800">
                        {config.name}
                      </label>
                      <a
                        href={getApiLink(key)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="econai-api-link text-sm text-blue-600 hover:text-blue-800 font-medium"
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
                      className="bg-white"
                    />
                    {hasApiKey(key) && !isBackendModel(key) && (
                      <div className="flex items-center text-xs text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        API Key Configured
                      </div>
                    )}
                    {isBackendModel(key) && (
                      <div className="flex items-center text-xs text-blue-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ready to Use
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Fixed button area at bottom */}
            <div className="flex-shrink-0 flex justify-end space-x-3 mt-6 pt-6 border-t econai-dialog-footer">
              <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setSettingsOpen(false)} className="econai-button-primary">
                Save Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-5 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">GPT-OSS Blog</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Technical blog focused on open-source GPT models, providing in-depth comparative analysis, usage guides, and AI chat functionality.
              </p>
              <div className="flex items-center text-sm text-slate-400">
                <Globe className="h-4 w-4 mr-2" />
                <span>Open Source AI Technology Sharing</span>
              </div>
            </div>

            {/* Platform and Resources Container */}
            <div className="md:col-span-7 grid md:grid-cols-2 gap-8">
              {/* Platform Links */}
              <div className="flex flex-col">
                <h4 className="font-semibold mb-4 text-slate-200">Platform</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#features" className="text-slate-300 hover:text-blue-400 transition-colors block">Core Areas</a></li>
                  <li><a href="#how-it-works" className="text-slate-300 hover:text-blue-400 transition-colors block">Chat</a></li>
                  <li><a href="#try-now" className="text-slate-300 hover:text-blue-400 transition-colors block">Best Practices</a></li>
                  <li><a href="#blog-posts" className="text-slate-300 hover:text-blue-400 transition-colors block">Articles</a></li>
                  <li><a href="#resources" className="text-slate-300 hover:text-blue-400 transition-colors block">Resources</a></li>
                </ul>
              </div>

              {/* Resources Links */}
              <div className="flex flex-col">
                <h4 className="font-semibold mb-4 text-slate-200">Resources</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-300">
                  <a href="https://huggingface.co/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Hugging Face</a>
                  <a href="https://github.com/topics/artificial-intelligence" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">GitHub AI</a>
                  <a href="https://paperswithcode.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Papers with Code</a>
                  <a href="https://modelscope.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">ModelScope</a>
                  <a href="https://arxiv.org/list/cs.AI/recent" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">arXiv AI/ML</a>
                  <a href="https://ai.google/research/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Google AI Research</a>
                  <a href="https://openai.com/research/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">OpenAI Research</a>
                  <a href="https://ai.meta.com/research/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Meta AI Research</a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-slate-400">
                  © 2025 GPT-OSS Blog. All rights reserved.
                </p>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-slate-400">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  <span>Secure & Confidential</span>
                </div>
                <div className="flex items-center">
                  <Brain className="h-4 w-4 mr-1" />
                  <span>AI-Powered Research</span>
                </div>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong>Disclaimer:</strong> GPT-OSS Blog provides technical analysis and research tools for open-source AI models. Generated information should be verified with original sources before making important decisions. This platform is for educational and research purposes only. Users are responsible for ensuring compliance with relevant copyright laws and academic integrity policies.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat History Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <History className="w-5 h-5 mr-2" />
              Chat History
            </DialogTitle>
            <DialogDescription className="text-slate-700">
              View and switch to previous chat sessions
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 space-y-3">
            {chatSessions.length === 0 ? (
              <div className="text-center py-8 text-slate-700">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p>No chat history</p>
              </div>
            ) : (
              chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
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
                            // 如果删除的是当前会话，切换到第一个可用会话或创建新会话
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
    </div>
  );
}