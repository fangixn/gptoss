'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, CalendarDays, Clock, Search, Tag, Brain, Globe, Shield, MessageCircle } from 'lucide-react'
// Simple blog data definition
interface BlogPost {
  id: number
  slug: string
  title: string
  description: string
  author: string
  date: string
  readTime: string
  tags: string[]
  category: string
}

const categories = ['All', 'Technical Analysis', 'Usage Guide', 'Technical Tutorial']

// Simple blog data
const allPosts: BlogPost[] = [
  {
    id: 12,
    slug: 'gpt-5-aftershock',
    title: 'The GPT-5 Aftershock: A Strategic Re-evaluation of the AI Ecosystem',
    description: 'Comprehensive analysis of how GPT-5 release reshapes the entire AI landscape, examining the impact on GPT-OSS-120B, GPT-OSS-20B, GPT-o4-mini, and GPT-o3-mini, and the new strategic positioning required for survival.',
    author: 'AI Industry Analyst',
    date: '2025-08-08',
    readTime: '20 min read',
    tags: ['GPT-5', 'AI Ecosystem', 'Strategic Analysis', 'Market Impact', 'Open Source AI', 'Competition'],
    category: 'Technical Analysis'
  },
  {
    id: 11,
    slug: 'gpt-oss-120b-vs-o4-mini',
    title: 'GPT-OSS-120B vs GPT-o4-mini: Is Open Source Really Closing the Gap?',
    description: 'Strategic comparison between massive open-source GPT-OSS-120B and highly-optimized closed-source GPT-o4-mini, analyzing raw power vs polished precision, control vs simplicity, and the evolving AI landscape of 2025.',
    author: 'AI Strategy Consultant',
    date: '2025-08-08',
    readTime: '17 min read',
    tags: ['GPT-OSS', 'OpenAI', 'Open Source AI', 'Model Comparison', 'Enterprise AI', 'Sovereignty'],
    category: 'Technical Analysis'
  },
  {
    id: 10,
    slug: 'gpt-oss-20b-vs-o3-mini',
    title: 'GPT-OSS-20B vs GPT-o3-mini: Is Open Source Really Closing the Gap?',
    description: 'In-depth analysis comparing GPT-OSS-20B with GPT-o3-mini, exploring whether open-source models can compete with closed-source efficiency in 2025, covering performance, cost, customization, and strategic implications.',
    author: 'AI Research Analyst',
    date: '2025-08-08',
    readTime: '16 min read',
    tags: ['GPT-OSS', 'OpenAI', 'Open Source AI', 'Model Comparison', 'Performance Analysis', 'Cost Efficiency'],
    category: 'Technical Analysis'
  },
  {
    id: 9,
    slug: 'gpt-oss-vs-llama-comparison',
    title: 'GPT-OSS-20B/120B vs LLaMA: Which Open-Source Model Should You Bet On?',
    description: 'Comprehensive comparison between GPT-OSS-20B/120B and LLaMA open-source models, analyzing performance, ecosystem maturity, commercial licensing, deployment flexibility, and strategic considerations to help developers make informed decisions.',
    author: 'AI Technology Strategist',
    date: '2025-08-07',
    readTime: '18 min read',
    tags: ['GPT-OSS', 'LLaMA', 'Model Comparison', 'Open Source AI', 'Performance Analysis', 'Deployment Strategy'],
    category: 'Technical Analysis'
  },
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

export default function BlogPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(allPosts)

  const scrollToSection = (sectionId: string) => {
    // Navigate to home page with the section anchor
    router.push(`/#${sectionId}`)
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  // Filter blog posts
  const filterPosts = React.useCallback(() => {
    let filtered = allPosts

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredPosts(filtered)
  }, [searchTerm, selectedCategory, allPosts])

  // Listen for search and category changes
  React.useEffect(() => {
    filterPosts()
  }, [filterPosts])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center">
                <img src="/extension_icon.png" alt="GPT-OSS Blog" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
              </div>
              <div className="min-w-0">
                <span className="text-base sm:text-lg font-semibold text-slate-800">GPT-OSS Blog</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-3">
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3"
                onClick={() => handleNavigation('/#features')}
              >
                Core Areas
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3"
                onClick={() => handleNavigation('/#how-it-works')}
              >
                Chat
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3 hidden sm:inline-flex"
                onClick={() => handleNavigation('/#try-now')}
              >
                Best Practices
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3"
                onClick={() => handleNavigation('/#blog-posts')}
              >
                Articles
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3"
                onClick={() => handleNavigation('/#resources')}
              >
                Resources
              </Button>
              <Button 
                className="econai-button-primary px-3 sm:px-6 text-xs sm:text-sm"
                onClick={() => handleNavigation('/blog')}
              >
                Blog
              </Button>

          </div>
          </div>
        </div>
      </header>

      <main className="bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Back to Home Button */}
        <div className="mb-4 sm:mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-2 hover:bg-slate-100 transition-colors text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            GPT-OSS Blog
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Explore the latest technology, performance comparisons, and practical guides for open-source GPT models
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 text-sm sm:text-base">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block">
              <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer">
                <CardHeader className="flex-shrink-0 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="px-2 py-1 text-xs">{post.category}</Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-lg hover:opacity-80 transition-colors line-clamp-2 mb-3 leading-snug font-semibold h-14 flex items-start">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-slate-600 text-sm leading-relaxed h-16 flex items-start">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col pt-0 pb-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 4 && (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        +{post.tags.length - 4}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {new Date(post.date).toLocaleDateString('en-US')}
                    </div>
                    <span className="text-sm font-medium transition-colors hover:opacity-80">
                      Read More →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* No Search Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No matching articles found</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-5 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                  <img src="/extension_icon.png" alt="GPT-OSS Blog" className="w-8 h-8 rounded-lg" />
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
                  <li><a href="/#features" className="text-slate-300 hover:text-blue-400 transition-colors block">Core Areas</a></li>
                  <li><a href="/#how-it-works" className="text-slate-300 hover:text-blue-400 transition-colors block">Chat</a></li>
                  <li><a href="/#try-now" className="text-slate-300 hover:text-blue-400 transition-colors block">Best Practices</a></li>
                  <li><a href="/#blog-posts" className="text-slate-300 hover:text-blue-400 transition-colors block">Articles</a></li>
                  <li><a href="/#resources" className="text-slate-300 hover:text-blue-400 transition-colors block">Resources</a></li>
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
  )
}