'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeft, CalendarDays, Clock, Tag, Share2, BookOpen } from 'lucide-react'

// 示例博客数据 (在实际应用中，这应该从API或数据库获取)
const blogPosts = [
  {
    id: 1,
    title: 'AI 聊天机器人的未来发展趋势',
    description: '探讨人工智能聊天机器人技术的最新发展，以及它们如何改变我们的日常生活和工作方式。',
    content: `
# AI 聊天机器人的未来发展趋势

人工智能聊天机器人正在快速发展，成为现代数字生活的重要组成部分。从简单的客服助手到复杂的个人AI助理，这些智能系统正在重新定义人机交互的方式。

## 技术发展现状

当前的AI聊天机器人已经具备了强大的自然语言处理能力。主要的技术突破包括：

### 1. 大型语言模型 (LLM)
- **GPT系列**: OpenAI的GPT-3.5和GPT-4展现出令人印象深刻的对话能力
- **Claude**: Anthropic开发的AI助手，在安全性和有用性方面表现优异
- **Gemini**: Google的多模态AI模型，支持文本、图像和代码理解

### 2. 多模态能力
现代AI不仅能处理文本，还能理解：
- 图像和视觉内容
- 音频和语音
- 代码和技术文档
- 数据表格和图表

## 未来发展趋势

### 1. 个性化和定制化
AI聊天机器人将更好地适应个人用户的需求和偏好，提供高度个性化的体验。

### 2. 专业领域深入
- 医疗AI助手
- 法律咨询机器人
- 教育辅导系统
- 金融投资顾问

### 3. 情感智能提升
未来的AI将更好地理解和回应人类的情感需求，提供更有同理心的交互体验。

## 应用场景展望

AI聊天机器人的应用将越来越广泛：

1. **企业客服**: 24/7全天候智能客服支持
2. **教育辅助**: 个性化学习助手和导师
3. **创作伙伴**: 协助写作、设计和创意工作
4. **生活助理**: 日程管理、健康监测、购物建议

## 挑战与机遇

虽然前景光明，但AI聊天机器人的发展也面临挑战：

- **隐私保护**: 如何在提供个性化服务的同时保护用户隐私
- **伦理考量**: 确保AI的决策和建议符合伦理标准
- **技术可靠性**: 提高AI回答的准确性和可靠性
- **人机平衡**: 在效率和人情味之间找到平衡

## 结论

AI聊天机器人代表了人工智能技术的重要应用方向。随着技术的不断进步，我们可以期待更智能、更有用、更贴心的AI助手出现在我们的生活中。

关键是要以负责任的方式发展这些技术，确保它们真正为人类福祉服务，而不是取代人类的价值和尊严。
    `,
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
    content: `
# 如何选择适合的 AI 模型

在众多AI模型中选择合适的一个可能是一个挑战。本文将帮助您了解不同AI模型的特点，并根据您的具体需求做出明智的选择。

## 主流AI模型对比

### ChatGPT (OpenAI)
**优势:**
- 强大的对话能力和创意写作
- 广泛的知识覆盖面
- 良好的代码生成能力

**适用场景:**
- 创意写作和内容创作
- 编程辅助
- 通用问答

### Claude (Anthropic)
**优势:**
- 注重安全性和有用性
- 擅长分析和推理
- 良好的文档处理能力

**适用场景:**
- 文档分析和总结
- 复杂问题推理
- 安全敏感的应用

### Gemini (Google)
**优势:**
- 多模态能力强
- 与Google服务集成
- 实时信息访问

**适用场景:**
- 图像识别和分析
- 实时信息查询
- 多媒体内容处理

## 选择标准

选择AI模型时，考虑以下因素：

### 1. 任务类型
- **创意任务**: ChatGPT表现优异
- **分析任务**: Claude更适合
- **多媒体任务**: Gemini是首选

### 2. 安全要求
如果您的应用涉及敏感信息，Claude的安全机制可能更适合。

### 3. 成本考虑
不同模型的定价策略不同，需要根据使用频率和预算选择。

### 4. 集成需求
考虑与现有系统的集成难度和兼容性。

## 实际建议

1. **先试用**: 大多数平台提供免费试用，可以先测试效果
2. **明确需求**: 清楚定义您的具体使用场景
3. **考虑组合**: 对于复杂应用，可以考虑使用多个模型
4. **持续评估**: 定期评估模型表现，必要时调整选择

## 结论

选择合适的AI模型需要综合考虑多个因素。没有一个"万能"的模型，关键是找到最符合您需求的那个。
    `,
    author: 'AI 研究员',
    date: '2024-01-12',
    readTime: '8 分钟',
    tags: ['AI', '模型比较', '选择指南'],
    category: '使用指南'
  },
  // 其他文章数据...
]

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟API调用
    const postId = parseInt(params.id as string)
    const foundPost = blogPosts.find(p => p.id === postId)
    
    setTimeout(() => {
      setPost(foundPost)
      setLoading(false)
    }, 500)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">文章未找到</h1>
            <p className="text-gray-600 mb-6">抱歉，您要查找的文章不存在。</p>
            <Button asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回博客
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('分享失败:', err)
      }
    } else {
      // fallback: 复制链接到剪贴板
      await navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回博客
              </Link>
            </Button>
          </div>

          {/* 文章头部 */}
          <Card className="mb-8">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{post.category}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {post.readTime}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {post.description}
              </p>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {post.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{post.author}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {new Date(post.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  分享
                </Button>
              </div>

              <Separator className="mt-6" />
            </CardHeader>
          </Card>

          {/* 文章标签 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          {/* 文章内容 */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none">
                <div 
                  className="whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content.replace(/\n/g, '<br />') 
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* 文章底部操作 */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回博客列表
              </Link>
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                分享文章
              </Button>
              <Button asChild>
                <Link href="/chat">
                  <BookOpen className="mr-2 h-4 w-4" />
                  与AI讨论
                </Link>
              </Button>
            </div>
          </div>

          {/* 相关文章推荐 */}
          <Card className="mt-12">
            <CardHeader>
              <h3 className="text-xl font-semibold">相关文章</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogPosts
                  .filter(p => p.id !== post.id)
                  .slice(0, 2)
                  .map((relatedPost) => (
                    <Link 
                      key={relatedPost.id} 
                      href={`/blog/${relatedPost.id}`}
                      className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedPost.description}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {new Date(relatedPost.date).toLocaleDateString('zh-CN')}
                      </div>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}