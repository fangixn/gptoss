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
import { Settings, MessageCircle, Brain, TrendingUp, DollarSign, BarChart3, PieChart, ExternalLink, BookOpen, Building, Globe, ArrowRight, Sparkles, Upload, CheckCircle, XCircle, FileText, MessageSquare, Shield, Clock, CalendarDays, Tag } from 'lucide-react';
import { API_CONFIGS } from '@/lib/apiConfig';
import { useApiSettings } from '@/hooks/useApiSettings';
import { ApiStatusIndicator } from '@/components/ApiStatusIndicator';


interface ApiSettings {
  [key: string]: string;
}

export default function Home() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<string>('openai');
  const [question, setQuestion] = useState<string>('');
  const [settingsOpen, setSettingsOpen] = useState(false);


  // Use custom hook to manage API settings
  const { 
    apiSettings, 
    isLoaded: apiSettingsLoaded, 
    saveApiSettings, 
    hasApiKey, 
    getApiKey, 
    getConfiguredModelsCount 
  } = useApiSettings();

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

  const handleStartChat = () => {
    if (!question.trim()) {
      router.push(`/chat?model=${selectedModel}`);
      return;
    }
    
    const apiKey = getApiKey(selectedModel);
    if (!apiKey) {
      alert('Please configure API key first');
      setSettingsOpen(true);
      return;
    }

    // API settings are automatically saved through hook, no manual saving needed
    
    const params = new URLSearchParams({
      model: selectedModel,
      initialQuestion: question
    });
    router.push(`/chat?${params.toString()}`);
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-7 w-7 text-white" />
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
                Features
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium"
                onClick={() => router.push('/blog')}
              >
                Blog
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
                onClick={() => router.push('/chat')}
              >
                AI Chat
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
                onClick={handleGetStarted}
              >
                Get Started
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
              onClick={handleGetStarted}
              className="econai-button-primary px-6 py-3 text-base h-auto"
            >
              Start Exploring
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => scrollToSection('how-it-works')}
              className="px-6 py-3 text-base h-auto border-2 hover:bg-slate-50"
            >
              Try AI Chat
            </Button>
          </div>
        </section>

        {/* AI Expert Selection & Quick Start Chat */}
        <section id="how-it-works" className="mb-16">
          <Card className="econai-card border-0 max-w-4xl mx-auto p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Choose Your AI Assistant & Start Chatting</h2>
              <p className="text-base text-slate-600">Select your preferred AI model and begin your GPT-OSS exploration</p>
            </div>

            {/* AI Model Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-3 space-x-3">
                <h3 className="text-base font-semibold text-slate-800">Available AI Models</h3>
                <ApiStatusIndicator 
                  configuredCount={getConfiguredModelsCount()} 
                  totalCount={Object.keys(API_CONFIGS).length}
                />
              </div>
              <div className="flex justify-center">
                <div className="flex flex-wrap gap-2 bg-slate-50 p-2.5 rounded-2xl border">
                  {Object.entries(API_CONFIGS).map(([key, config]) => (
                    <Button
                      key={key}
                      variant={selectedModel === key ? "default" : "ghost"}
                      onClick={() => setSelectedModel(key)}
                      className={`min-w-[120px] h-10 text-sm transition-all duration-200 ${
                        selectedModel === key 
                          ? 'econai-button-primary shadow-lg' 
                          : 'hover:bg-white hover:shadow-md'
                      }`}
                    >
                      {config.name}
                      {hasApiKey(key) && <Badge variant="secondary" className="ml-1.5 text-xs bg-green-100 text-green-700">✓</Badge>}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Expert Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
              <div className="flex items-center justify-center mb-2">
                <Brain className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="text-lg font-semibold text-slate-800">
                  Current Expert: {API_CONFIGS[selectedModel].name}
                </h4>
              </div>
              <p className="text-sm text-slate-600 text-center">
                {hasApiKey(selectedModel) 
                  ? "✅ API configured and ready for advanced analysis" 
                  : "⚠️ API key required for full functionality"}
              </p>
              {!hasApiKey(selectedModel) && (
                <div className="text-center mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSettingsOpen(true)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 text-sm h-8"
                  >
                    <Settings className="h-3 w-3 mr-1.5" />
                    Configure API Key
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Start Chat */}
            <div id="get-started" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-slate-700">
                  Your GPT-OSS Question (Optional)
                </label>
                <Textarea
                  placeholder="e.g., Compare GPT-OSS-120B vs OpenAI GPT-4 performance..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                <Button 
                  onClick={handleStartChat} 
                  className="econai-button-primary py-3 text-base h-auto"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {question.trim() ? 'Start Analysis Chat' : 'Enter Chat Page'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setSettingsOpen(true)}
                  className="py-3 text-base h-auto border-2 hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage API Settings
                </Button>
              </div>

              {question.trim() && (
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
                      &ldquo;What are the key findings in the latest Fed monetary policy report?&rdquo;
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      &ldquo;How does Adam Smith explain the role of specialization in The Wealth of Nations?&rdquo;
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      &ldquo;What is the World Bank&apos;s 2024 global growth forecast?&rdquo;
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
                      &ldquo;What does Chapter 3 of Mankiw&apos;s textbook say?&rdquo; (Copyright protected)
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      &ldquo;Help me do my homework&rdquo; (Focus on understanding concepts)
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      Vague questions without specific context or documents
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Tips */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Research Tips</h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Ask Specific Questions</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Frame clear, specific questions and request comparisons between sources
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Verify Information</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Always verify AI responses with original sources for important decisions
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
              {Object.entries(API_CONFIGS).map(([key, config]) => {
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
                    {hasApiKey(key) && (
                      <div className="flex items-center text-xs text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        API Key Configured
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
                  <li><a href="/" className="text-slate-300 hover:text-blue-400 transition-colors block">Home</a></li>
                  <li><a href="/blog" className="text-slate-300 hover:text-blue-400 transition-colors block">Blog</a></li>
                  <li><a href="/chat" className="text-slate-300 hover:text-blue-400 transition-colors block">AI Chat</a></li>
                  <li><a href="#blog-posts" className="text-slate-300 hover:text-blue-400 transition-colors block">Featured Articles</a></li>
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
    </div>
  );
} 