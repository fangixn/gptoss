import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeft, CalendarDays, Clock, Tag, BookOpen, Brain, Globe, Shield } from 'lucide-react'
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/markdown'
import MarkdownRenderer from '../../../components/MarkdownRenderer'
import ScrollToTop from '../../../components/ScrollToTop'

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  const currentSlugs = posts.map((post) => ({
    slug: post.slug,
  }))
  
  // Add legacy slug for backward compatibility
  const legacySlugs = [
    { slug: 'what-is-gpt-oss-complete-guide-open-source-gpt' }
  ]
  
  return [...currentSlugs, ...legacySlugs]
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  // Handle legacy URL redirect
  if (params.slug === 'what-is-gpt-oss-complete-guide-open-source-gpt') {
    redirect('/blog/what-is-gpt-oss')
  }
  
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">Sorry, the article you{"'"}re looking for doesn{"'"}t exist.</p>
            <Button asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center">
                <img src="/extension_icon.png" alt="GPT-OSS Blog" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
              </div>
              <div className="min-w-0">
                <span className="text-base sm:text-lg font-semibold">GPT-OSS Blog</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-3">
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3"
                asChild
              >
                <Link href="/#features">Core Areas</Link>
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3"
                asChild
              >
                <Link href="/#how-it-works">Chat</Link>
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3 hidden sm:inline-flex"
                asChild
              >
                <Link href="/#try-now">Best Practices</Link>
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3"
                asChild
              >
                <Link href="/#blog-posts">Articles</Link>
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium text-xs sm:text-sm px-2 sm:px-3"
                asChild
              >
                <Link href="/#resources">Resources</Link>
              </Button>
              <Button 
                className="econai-button-primary px-3 sm:px-6 text-xs sm:text-sm"
                asChild
              >
                <Link href="/blog">Blog</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-3xl mx-auto">
          {/* Navigation */}
          <div className="mb-8 sm:mb-12">
            <Link href="/blog" className="inline-flex items-center text-slate-600 hover:text-amber-700 transition-colors text-xs sm:text-sm font-medium">
                <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Back
              </Link>
          </div>

          {/* Article Header */}
          <header className="mb-12 sm:mb-16">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Badge variant="outline" className="text-xs text-amber-700 border-amber-200 bg-amber-50">
                {post.category}
              </Badge>
              <div className="flex items-center text-xs sm:text-sm text-slate-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {post.readTime}
                </div>
              </div>
              
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
                {post.title}
              </h1>
              
            <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                {post.description}
              </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center text-sm text-slate-500">
                <CalendarDays className="h-4 w-4 mr-2" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
              <span className="text-slate-300">•</span>
              <span className="text-sm text-slate-600 font-medium">{post.author}</span>
              </div>

          {/* Article Tags */}
            <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                {tag}
                </span>
            ))}
          </div>
          </header>

          {/* Article Content */}
          <div className="prose-container">
            <MarkdownRenderer content={post.content} />
                      </div>

          {/* Article Bottom Navigation */}
          <div className="mt-20 pt-12 border-t border-slate-200">
            <div className="flex justify-center gap-6">
              <Link 
                href="/blog" 
                className="inline-flex items-center px-4 py-2 text-slate-600 hover:text-amber-700 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Articles
              </Link>
              
              <Link 
                href="/#how-it-works" 
                className="inline-flex items-center px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Discuss with AI
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold mb-8 text-center">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {getAllBlogPosts()
                  .filter(p => p.id !== post.id)
                  .slice(0, 2)
                  .map((relatedPost) => (
                    <Link 
                      key={relatedPost.id} 
                      href={`/blog/${relatedPost.slug}`}
                    className="group block p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-amber-700 font-medium">{relatedPost.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{relatedPost.readTime}</span>
                    </div>
                    <h4 className="font-semibold mb-3 hover:text-amber-700 transition-colors line-clamp-2 leading-tight">
                        {relatedPost.title}
                      </h4>
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {relatedPost.description}
                      </p>
                    <div className="flex items-center text-xs text-slate-500">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {new Date(relatedPost.date).toLocaleDateString('zh-CN')}
                      </div>
                    </Link>
                  ))}
              </div>
          </div>
        </div>
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

      {/* Floating back to top button */}
      <ScrollToTop />
    </div>
  )
}