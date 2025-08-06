'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarDays, Clock, Search, Tag } from 'lucide-react'

// 示例博客数据
const blogPosts = [
  {
    id: 1,
    title: 'AI 聊天机器人的未来发展趋势',
    description: '探讨人工智能聊天机器人技术的最新发展，以及它们如何改变我们的日常生活和工作方式。',
    content: '人工智能聊天机器人正在快速发展...',
    author: 'AI 专家',
    date: '2024-01-15',
    readTime: '5 分钟',
    tags: ['AI', '聊天机器人', '技术趋势'],
    category: '技术分析'
  },
  {
    id: 2,
    title: '如何选择适合的 AI 模型',
    description: '比较不同AI模型的特点和优势，帮助用户根据需求选择最适合的AI助手。',
    content: '在众多AI模型中选择合适的一个...',
    author: 'AI 研究员',
    date: '2024-01-12',
    readTime: '8 分钟',
    tags: ['AI', '模型比较', '选择指南'],
    category: '使用指南'
  },
  {
    id: 3,
    title: '构建现代化的 Web 应用',
    description: '使用Next.js、React和TypeScript构建高性能的现代Web应用程序的最佳实践。',
    content: '现代Web开发需要考虑很多因素...',
    author: '前端开发者',
    date: '2024-01-10',
    readTime: '12 分钟',
    tags: ['Next.js', 'React', 'TypeScript', 'Web开发'],
    category: '技术教程'
  },
  {
    id: 4,
    title: 'AI 在内容创作中的应用',
    description: '探索人工智能如何协助内容创作者提高效率，创造更优质的内容。',
    content: 'AI技术正在革命性地改变内容创作...',
    author: '内容策略师',
    date: '2024-01-08',
    readTime: '6 分钟',
    tags: ['AI', '内容创作', '效率提升'],
    category: '应用案例'
  },
  {
    id: 5,
    title: '部署AI应用的最佳实践',
    description: '从开发到生产环境，全面介绍AI应用部署的关键步骤和注意事项。',
    content: '将AI应用成功部署到生产环境...',
    author: 'DevOps 工程师',
    date: '2024-01-05',
    readTime: '10 分钟',
    tags: ['部署', 'DevOps', 'AI应用', '最佳实践'],
    category: '技术运维'
  }
]

const categories = ['全部', '技术分析', '使用指南', '技术教程', '应用案例', '技术运维']

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)

  // 过滤博客文章
  const filterPosts = () => {
    let filtered = blogPosts

    // 按分类过滤
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // 按搜索词过滤
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredPosts(filtered)
  }

  // 监听搜索和分类变化
  React.useEffect(() => {
    filterPosts()
  }, [searchTerm, selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI 博客
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            探索人工智能的最新趋势、技术洞察和实用指南
          </p>
        </div>

        {/* 搜索和过滤器 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="搜索文章..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="选择分类" />
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

        {/* 博客文章网格 */}
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
                  <Link href={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
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
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="h-2 w-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button asChild className="w-full">
                  <Link href={`/blog/${post.id}`}>
                    阅读全文
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 无搜索结果 */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">未找到匹配的文章</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('全部')
              }}
              className="mt-4"
            >
              清除筛选条件
            </Button>
          </div>
        )}

        {/* 分页 (示例) */}
        {filteredPosts.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <Button variant="outline" disabled>
                上一页
              </Button>
              <Button variant="outline" className="bg-blue-600 text-white">
                1
              </Button>
              <Button variant="outline">
                2
              </Button>
              <Button variant="outline">
                下一页
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}