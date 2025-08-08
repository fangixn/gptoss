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

// Map from filename to blog post data
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
  },
  '20250807_GPT-OSS-20B:120B vs LLaMA.md': {
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
  '20250808_GPT-OSS-20B vs GPT-o3-mini.md': {
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
  '20250808_GPT-OSS-120B vs GPT-o4-mini.md': {
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
  '20250808_The GPT-5 Aftershock.md': {
    id: 12,
    slug: 'gpt-5-aftershock',
    title: 'The GPT-5 Aftershock: A Strategic Re-evaluation of the AI Ecosystem',
    description: 'Comprehensive analysis of how GPT-5 release reshapes the entire AI landscape, examining the impact on GPT-OSS-120B, GPT-OSS-20B, GPT-o4-mini, and GPT-o3-mini, and the new strategic positioning required for survival.',
    author: 'AI Industry Analyst',
    date: '2025-08-08',
    readTime: '20 min read',
    tags: ['GPT-5', 'AI Ecosystem', 'Strategic Analysis', 'Market Impact', 'Open Source AI', 'Competition'],
    category: 'Technical Analysis'
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
  
  // Sort by ID in descending order (newest first)
  return posts.sort((a, b) => b.id - a.id)
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const posts = getAllBlogPosts()
  return posts.find(post => post.slug === slug) || null
}

export function getFeaturedBlogPosts(): BlogPost[] {
  // Return all articles as featured articles
  return getAllBlogPosts()
}
