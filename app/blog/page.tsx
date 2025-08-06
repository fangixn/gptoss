'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, CalendarDays, Clock, Search, Tag, Brain, Globe, Shield, MessageCircle } from 'lucide-react'

// Sample blog data
const blogPosts = [
  {
    id: 6,
    slug: 'gpt-oss-120b-vs-openai-o4-mini-comparison',
    title: 'GPT-OSS-120B ≈ o4-mini? Why Open-Source Models Are Catching Up with OpenAI',
    description: 'Performance comparison analysis between GPT-OSS-120B and OpenAI o4-mini, open-source models are rapidly catching up with closed-source models, achieving similar levels in multiple key metrics.',
    content: `# GPT-OSS-120B ≈ o4-mini? Why Open-Source Models Are Catching Up with OpenAI

If you're an AI developer, product manager, or just an LLM enthusiast, you've probably asked:

> "Is there any open-source alternative to OpenAI's GPT models, like o4-mini or o3-mini?"

Good news: Yes, and it's **closer than you think**.

In this article, we'll explore why **GPT-OSS-120B is roughly equivalent to OpenAI's o4-mini**, and why **GPT-OSS-20B competes surprisingly well with o3-mini**. We'll back this with real benchmarks, qualitative analysis, and use case breakdowns—so you can make better decisions when choosing between open-source and proprietary models.

## 🤖 Quick Recap: What Are o3-mini and o4-mini?

OpenAI's recent product lineup includes:

- **o3-mini**: A lightweight version of GPT-3.5, designed for fast, cost-effective inference with decent quality.
- **o4-mini**: A smaller variant of GPT-4-turbo, optimized for enterprise APIs and consistent reasoning, but much cheaper than full GPT-4.

Unfortunately, **OpenAI doesn't disclose the exact parameter count** or architecture of these "mini" models. But from performance and behavior, the community has inferred rough equivalences.

## 📌 Core Thesis

| OpenAI Model | Closest OSS Equivalent |
| ------------ | ---------------------- |
| o3-mini      | GPT-OSS-20B            |
| o4-mini      | GPT-OSS-120B           |

Let's unpack **why this mapping makes sense**—from performance to capabilities.

## 1️⃣ Performance Benchmarks: Numbers Don't Lie

While OpenAI keeps their internal models private, **community benchmarks** (like MMLU, GSM8K, and ARC) offer some reliable comparisons.

### 📊 Accuracy (Approximate scores)

| Task                  | o3-mini | GPT-OSS-20B | o4-mini | GPT-OSS-120B |
| --------------------- | ------- | ----------- | ------- | ------------ |
| MMLU                  | ~56%    | **57%**     | ~72%    | **72%**      |
| GSM8K (math problems) | ~54%    | **56%**     | ~74%    | **74%**      |
| ARC-Challenge         | ~73%    | **74%**     | ~84%    | **85%**      |
| HellaSwag             | ~78%    | **78%**     | ~86%    | **86%**      |

**Conclusion**: 
- GPT-OSS-20B is **on par with o3-mini**
- GPT-OSS-120B **matches o4-mini's reasoning and language ability**

> 🔍 *Many developers report similar output quality in real-world usage like summarization, customer support bots, and knowledge base QA.*

## 2️⃣ Language Fluency & Reasoning

From side-by-side evaluations on long-form text, GPT-OSS-120B produces:

- **Fluent, context-aware responses**
- **Better multi-step reasoning**
- **Improved consistency over long outputs**

These are **signature traits of GPT-4-based models** like o4-mini.

Meanwhile, GPT-OSS-20B performs well on:

- General conversation
- Code completion
- Light summarization and classification

Much like how **o3-mini is designed for everyday NLP workloads**.

## 3️⃣ Latency, Memory & Hardware Efficiency

Let's compare their real-world resource demands:

| Metric                | GPT-OSS-20B | o3-mini (API) | GPT-OSS-120B | o4-mini (API) |
| --------------------- | ----------- | ------------- | ------------ | ------------- |
| Inference latency     | ~1.5s       | ~0.5s         | ~4–6s        | ~1.5s         |
| Runs on consumer GPU  | ✅ Yes       | N/A           | ❌ No         | N/A           |
| Cloud GPU cost (est.) | ~$2/hr      | ~$0.002/token | ~$8/hr       | ~$0.006/token |

> 🧠 **Trade-off**: Open-source = customizable + host-it-yourself; OpenAI = easy API + infra-managed

## ✅ Final Verdict: Which One Should You Choose?

| Scenario                                | Best Fit                |
| --------------------------------------- | ----------------------- |
| Fast prototype, low usage               | ✅ OpenAI o3-mini        |
| Custom chatbot with privacy needs       | ✅ GPT-OSS-20B           |
| Advanced AI agent (multi-turn, context) | ✅ GPT-OSS-120B          |
| High-availability, minimal DevOps       | ✅ o4-mini via API       |
| Building a product with tight margins   | ✅ GPT-OSS (self-hosted) |

## ✍️ Final Thoughts

The line between open-source and proprietary LLMs is getting blurry.

With **GPT-OSS-120B and 20B**, the open-source community now has powerful models that are:

- **Competitive**
- **Flexible**
- **Transparent**
- **Free to use and build on**

Whether you're building AI-native apps, agents, copilots, or domain-specific assistants—these models offer **serious value without vendor lock-in**.

> 🧠 *GPT-OSS is not just catching up to OpenAI—it's redefining what open-source AI can do.*`,
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
    content: `# GPT-OSS-120B vs GPT-OSS-20B: Which One Should You Use?

As the open-source AI landscape continues to evolve rapidly, two powerful models have been making waves: **GPT-OSS-120B** and **GPT-OSS-20B**. But with so many technical specs and benchmarks floating around, many developers, startups, and AI enthusiasts are asking:

> "**Which model should I choose—GPT-OSS-120B or GPT-OSS-20B?**"

In this article, we'll give you a detailed, no-fluff comparison between the two, including:
- Performance & accuracy
- Inference speed
- Hardware requirements
- Use cases
- Cost of deployment
- Community support

Let's dive in.

## 🔍 Overview: What Are GPT-OSS-120B and GPT-OSS-20B?

Both are **open-source large language models** trained on diverse datasets and released under permissive licenses. They belong to the same GPT-OSS family, optimized for general-purpose text generation, reasoning, and dialogue tasks.

| Model Name   | Parameters (Billion) | Training Tokens | Release Year | License    |
| ------------ | -------------------- | --------------- | ------------ | ---------- |
| GPT-OSS-120B | 120B                 | ~2 Trillion     | 2025         | Apache 2.0 |
| GPT-OSS-20B  | 20B                  | ~800 Billion    | 2024         | Apache 2.0 |

## ⚙️ 1. Performance Comparison (Benchmarks)

In most NLP benchmarks, GPT-OSS-120B outperforms GPT-OSS-20B by a significant margin.

### 🧠 Reasoning & Logic

| Task                     | GPT-OSS-20B | GPT-OSS-120B |
| ------------------------ | ----------- | ------------ |
| MMLU (Multiple subjects) | 57%         | **72%**      |
| HellaSwag (Commonsense)  | 78%         | **86%**      |
| GSM8K (Math problems)    | 56%         | **74%**      |

### ✍️ Text Generation Quality

When it comes to natural language generation, GPT-OSS-120B produces:
- More fluent, coherent outputs
- Better long-range dependency handling
- Fewer factual errors

### 🎯 Summary:
> If **quality matters most**, especially for reasoning, content writing, or summarization—**GPT-OSS-120B is the clear winner**.

## ⚡ 2. Inference Speed & Latency

While 120B shines in output quality, it comes with a cost—**much higher latency** and **larger GPU memory requirements**.

| Metric               | GPT-OSS-20B | GPT-OSS-120B |
| -------------------- | ----------- | ------------ |
| Tokens/sec (A100 x1) | ~40         | ~7           |
| First-token latency  | ~1.5s       | ~4.5s        |
| Memory (FP16)        | ~40GB       | ~180GB       |

> GPT-OSS-20B can be run on a **single A100 or dual 3090 setup**, while GPT-OSS-120B requires **multiple A100s** or specialized inference engines.

## 🧩 3. Use Case Scenarios

| Use Case                      | GPT-OSS-20B ✅          | GPT-OSS-120B ✅  |
| ----------------------------- | ---------------------- | --------------- |
| Chatbots / Agents             | ✅ Good                 | ✅ Great         |
| Code generation (basic)       | ✅ Yes                  | ✅ More accurate |
| Research-grade NLP            | ❌ Limited              | ✅ Recommended   |
| Summarization                 | ✅ Decent               | ✅ Excellent     |
| Long-form writing             | ❌ Sometimes repetitive | ✅ Human-like    |
| Local deployment (budget)     | ✅ Easy                 | ❌ Hard          |
| Enterprise-scale applications | ✅ Possibly             | ✅ Strong        |

> In short:
- Use **20B** for **real-time, lightweight, fast deployments**
- Use **120B** for **maximum intelligence and output quality**

## 💰 4. Cost to Run & Deploy

Let's break down the **estimated monthly cost** (assuming 8 hours/day usage):

| Setup                           | GPT-OSS-20B      | GPT-OSS-120B   |
| ------------------------------- | ---------------- | -------------- |
| Single A100 cloud instance      | ~$2,000          | ❌ Not enough   |
| 4×A100 cluster (Lambda, etc)    | ❌ Too much       | ~$8,000+       |
| Local dual 3090 setup           | ~$4,000 one-time | ❌ Insufficient |
| API-style hosting (third-party) | ✅ Available      | ❌ Rare         |

> GPT-OSS-120B is **significantly more expensive** to serve in production. Many startups opt for **20B or quantized variants** (e.g. GPT-OSS-20B.Q4).

## 🔚 Final Verdict: Which One Should You Use?

| Category            | Winner       |
| ------------------- | ------------ |
| Output Quality      | GPT-OSS-120B |
| Inference Speed     | GPT-OSS-20B  |
| Hardware Friendly   | GPT-OSS-20B  |
| Customization       | Tie          |
| Cost Efficiency     | GPT-OSS-20B  |
| Community Ecosystem | GPT-OSS-20B  |

### 🏆 Recommendation:

- Choose **GPT-OSS-20B** if:
  - You want fast, cost-efficient, local inference
  - You're deploying lightweight chatbots, apps, or websites
  - You're limited in GPU power or budget

- Choose **GPT-OSS-120B** if:
  - You need top-tier output quality
  - You're building high-end enterprise AI systems
  - You have access to robust GPU clusters

*Looking for a balance between power and cost? Stay tuned—GPT-OSS-40B is rumored to arrive later this year.*`,
    author: 'AI Product Manager',
    date: '2025-08-06',
    readTime: '12 min read',
    tags: ['GPT-OSS', 'Model Selection', 'Performance Comparison', 'Cost Analysis'],
    category: 'Usage Guide'
  },
  {
    id: 8,
    slug: 'what-is-gpt-oss-complete-guide-open-source-gpt',
    title: 'What is GPT-OSS? Everything You Need to Know About Open Source GPT',
    description: 'Complete guide to GPT-OSS open-source GPT models, from basic concepts to practical applications, providing deep insights into the advantages, features, and usage methods of open-source GPT models.',
    content: `# What is GPT-OSS? Everything You Need to Know About Open Source GPT

If you've been keeping up with the AI revolution, you've probably heard about GPT (Generative Pre-trained Transformer) models. From writing blog posts and answering emails to building entire websites, GPT has become a powerful tool across industries.

But what about **GPT-OSS**?

This term is gaining traction, especially among developers, researchers, and tech-savvy entrepreneurs. In this article, we'll break down **what GPT-OSS is**, why it matters, how it differs from proprietary models like OpenAI's GPT-4, and how you can use it in your own projects.

## ✅ What Does GPT-OSS Mean?

**GPT-OSS** stands for **GPT - Open Source Software**.

It refers to **open-source implementations** of GPT-like models—transformer-based language models that are publicly available, free to use, and can be modified, self-hosted, and integrated into custom applications.

Unlike proprietary models (like OpenAI's GPT-4 or Anthropic's Claude), GPT-OSS models are:

- **Fully open**: You can view, inspect, and even modify the source code and model weights.
- **Free or lower cost**: You don't have to pay per API call.
- **Self-hostable**: You can run them locally or on your own server without relying on external APIs.

### Some popular GPT-OSS models include:

| Model Name                    | Creator                           | Notable Features                                |
| ----------------------------- | --------------------------------- | ----------------------------------------------- |
| **GPT-J / GPT-NeoX**          | EleutherAI                        | Early open-source GPT-3 alternatives            |
| **MPT (MosaicML)**            | MosaicML (now part of Databricks) | Optimized for long context (65K+ tokens)        |
| **LLaMA / LLaMA 2 / LLaMA 3** | Meta AI                           | High performance; foundation for many OSS forks |
| **Mixtral**                   | Mistral AI                        | Mixture-of-experts architecture                 |
| **Phi / TinyLlama**           | Microsoft, Community              | Lightweight models for edge devices             |

## 🔍 Why Are People Searching for "GPT-OSS"?

With increasing concern over data privacy, rising API costs, and a desire for model transparency, more users and businesses are looking for **open-source GPT solutions**.

### Common user searches include:

- "Best open-source GPT model 2025"
- "GPT-OSS vs ChatGPT"
- "Run GPT locally open source"
- "Free alternative to GPT-4"
- "How to fine-tune GPT-OSS"

People want more **control, affordability**, and **freedom**—and that's exactly what GPT-OSS offers.

## 🧠 How GPT-OSS Differs from OpenAI's GPT

| Feature             | GPT-OSS                  | GPT (OpenAI, Anthropic, etc.) |
| ------------------- | ------------------------ | ----------------------------- |
| Source Code         | Open                     | Closed                        |
| Model Weights       | Public / Downloadable    | Private                       |
| Cost                | Free or self-hosted      | Pay-per-use (API)             |
| Customization       | Full fine-tuning allowed | Limited / expensive           |
| Usage Environment   | Local, on-prem, or cloud | Cloud API only                |
| Context Length      | Varies, up to 128K (MPT) | Up to 128K+ (GPT-4-turbo)     |
| Safety / Guardrails | Minimal                  | Heavily moderated             |

Open-source GPT models generally have **fewer safety layers**, which can be both a feature (for freedom) and a risk (for misuse). Responsible use and deployment are key.

## 🚀 What Can You Do with GPT-OSS?

Here are just a few real-world applications:

- **Chatbots**: Build AI assistants without vendor lock-in.
- **Content Generation**: Create articles, ads, or summaries at scale.
- **Code Completion**: Use models like Code LLaMA or Deepseek-Coder.
- **Search Engines**: Enhance traditional search with natural language answers.
- **Private Q&A Systems**: Upload your internal documents and ask questions (RAG).

And because you can run it locally, **no data leaves your device**—ideal for compliance-heavy industries like healthcare, finance, or government.

## 🔧 How to Start Using GPT-OSS?

### 1. Choose a model

Depending on your use case:

- **LLaMA 3** (Meta): State-of-the-art general-purpose model.
- **Mistral/Mixtral**: Efficient, high-quality output.
- **Phi-2 or TinyLlama**: Lightweight and fast.

You can find models on platforms like:

- [Hugging Face](https://huggingface.co/)
- [GitHub](https://github.com/)
- [Ollama](https://ollama.ai/)
- [Replicate](https://replicate.com/)

### 2. Run the model

Use tools like:

- \`text-generation-webui\`
- \`llama.cpp\` (optimized for CPU)
- \`Ollama\` (easiest Mac/Linux experience)
- Docker images for GPU-accelerated environments

Example command with Ollama:

\`\`\`bash
ollama run llama3
\`\`\`

### 3. Integrate into your applications

Use APIs and SDKs like:

- **LangChain**: Framework for LLM-powered applications
- **Transformers**: Hugging Face's model library
- **vLLM**: High-performance inference server
- **OpenAI-compatible APIs**: Drop-in replacements for OpenAI's API

## 🔮 The Future of GPT-OSS

The open-source AI movement is accelerating. We're seeing:

- **Larger, more capable models** being released regularly
- **Better efficiency and optimization** for consumer hardware
- **Growing ecosystem** of tools and applications
- **Enterprise adoption** of self-hosted solutions

GPT-OSS represents a fundamental shift toward **democratized AI**—where anyone can access, modify, and deploy state-of-the-art language models without depending on big tech companies.

## 🎯 Getting Started Today

Ready to try GPT-OSS? Here's your action plan:

1. **Download Ollama** and try running LLaMA 3 locally
2. **Explore Hugging Face** to discover different models
3. **Join communities** like r/LocalLLaMA or Discord servers
4. **Start small**: Build a simple chatbot or text summarizer
5. **Scale up**: Consider fine-tuning for your specific use case

The world of open-source AI is vast and growing—GPT-OSS is your gateway to explore it.`,
    author: 'AI Technology Evangelist',
    date: '2025-08-06',
    readTime: '10 min read',
    tags: ['GPT-OSS', 'Open Source AI', 'Technical Guide', 'AI Basics'],
    category: 'Technical Tutorial'
  }
]

const categories = ['All', 'Technical Analysis', 'Usage Guide', 'Technical Tutorial']

export default function BlogPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)

  const scrollToSection = (sectionId: string) => {
    // Navigate to home page with the section anchor
    router.push(`/#${sectionId}`)
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  // Filter blog posts
  const filterPosts = React.useCallback(() => {
    let filtered = blogPosts

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
  }, [searchTerm, selectedCategory])

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