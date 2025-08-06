'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定义段落 - 参考方馨博客的间距
          p: ({ children }) => (
            <p className="text-slate-700 leading-[1.8] mb-6 text-[17px] font-normal tracking-normal">
              {children}
            </p>
          ),
          // 自定义标题样式 - 参考方馨博客的颜色和间距
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-0 mb-8 leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mt-16 mb-6 leading-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-12 mb-4 leading-tight">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold mt-8 mb-3 leading-tight">
              {children}
            </h4>
          ),
          // 自定义列表样式 - 更清晰的层次
          ul: ({ children }) => (
            <ul className="my-6 space-y-2 pl-0 text-slate-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-6 space-y-2 pl-0 text-slate-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-700 leading-[1.8] mb-2 ml-6 relative before:content-['•'] before:text-amber-700 before:font-bold before:absolute before:-ml-4 before:text-lg">
              {children}
            </li>
          ),
          // 自定义表格样式 - 更现代的设计
          table: ({ children }) => (
            <div className="overflow-x-auto my-10 rounded-xl border border-slate-200 shadow-lg bg-white">
              <table className="min-w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border-b-2 border-slate-200 px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-slate-100 px-6 py-4 text-slate-700 text-[15px] leading-relaxed">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50 transition-colors duration-200">
              {children}
            </tr>
          ),
          // 自定义代码块样式 - 更精致的设计
          code: ({ children, className }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-amber-50 text-amber-800 px-2 py-1 rounded-md text-sm font-mono border border-amber-200 font-medium">
                  {children}
                </code>
              )
            }
            return (
              <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto my-8 border border-slate-700 shadow-lg">
                <code className="text-sm font-mono leading-6 font-normal">{children}</code>
              </pre>
            )
          },
          // 自定义引用样式 - 更优雅的设计
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-slate-400 bg-gradient-to-r from-slate-50 via-slate-100 to-transparent pl-8 pr-6 py-6 my-8 text-slate-700 rounded-r-xl relative">
              <div className="text-[17px] leading-[1.8] font-medium italic">
                {children}
              </div>
            </blockquote>
          ),
          // 自定义强调文本
          strong: ({ children }) => (
            <strong className="font-semibold">
              {children}
            </strong>
          ),
          // 自定义链接 - 与主题色保持一致
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-amber-700 hover:text-amber-800 underline decoration-amber-700 decoration-2 underline-offset-2 font-medium transition-all duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // 自定义分隔线
          hr: ({ }) => (
            <hr className="border-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-12" />
          ),
          // 自定义斜体
          em: ({ children }) => (
            <em className="italic text-slate-600 font-medium">
              {children}
            </em>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
