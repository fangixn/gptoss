import fs from 'fs'
import path from 'path'

export interface BlogPost {
  id: number
  slug: string
  title: string
  description: string
  content: string
  author: string
  date: string
  readTime: string
  tags: string[]
  category: string
}

// 从文件名映射到博客文章数据
const blogPostsMap: Record<string, Omit<BlogPost, 'content'>> = {
  '20250806_GPT-OSS-120B ≈ o4-mini Why Open-Source Models Are Catching Up with OpenAI.md': {
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
  '20250806_GPT-OSS-120B vs GPT-OSS-20B Which One Should You Use.md': {
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
  '20250806_What is GPT-OSS？.md': {
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
}

export function getAllBlogPosts(): BlogPost[] {
  const contentDirectory = path.join(process.cwd(), 'content')
  const filenames = fs.readdirSync(contentDirectory)
  
  const posts: BlogPost[] = []
  
  filenames.forEach(filename => {
    if (filename.endsWith('.md') && blogPostsMap[filename]) {
      const fullPath = path.join(contentDirectory, filename)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      
      const post: BlogPost = {
        ...blogPostsMap[filename],
        content: fileContents
      }
      
      posts.push(post)
    }
  })
  
  // 按ID倒序排列（最新的在前面）
  return posts.sort((a, b) => b.id - a.id)
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const posts = getAllBlogPosts()
  return posts.find(post => post.slug === slug) || null
}

export function getFeaturedBlogPosts(): BlogPost[] {
  // 返回所有文章作为精选文章
  return getAllBlogPosts()
}
