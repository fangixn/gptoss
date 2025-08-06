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
// 简单的博客数据定义
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

// 简单的博客数据
const allPosts: BlogPost[] = [
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
                onClick={() => handleNavigation('/#features')}
              >
                Features
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium bg-slate-100"
              >
                Blog
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium"
                onClick={() => handleNavigation('/#blog-posts')}
              >
                Articles
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium"
                onClick={() => handleNavigation('/chat')}
              >
                AI Chat
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium"
                onClick={() => handleNavigation('/')}
              >
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GPT-OSS Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the latest technology, performance comparisons, and practical guides for open-source GPT models
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3 text-slate-800">
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    {new Date(post.date).toLocaleDateString('zh-CN')}
                  </div>
                  <span className="text-sm text-gray-600">{post.author}</span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="h-2 w-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button asChild className="w-full">
                  <Link href={`/blog/${post.slug}`}>
                    Read More
                  </Link>
                </Button>
              </CardContent>
            </Card>
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
                  <li><a href="/#blog-posts" className="text-slate-300 hover:text-blue-400 transition-colors block">Featured Articles</a></li>
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