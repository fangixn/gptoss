export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
}

export function getFeaturedBlogPosts(): BlogPost[] {
  return [
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
    }
  ];
}