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
          // Custom paragraph - responsive spacing
          p: ({ children }) => (
            <p className="text-slate-700 leading-[1.8] mb-4 sm:mb-6 text-sm sm:text-base md:text-[17px] font-normal tracking-normal">
              {children}
            </p>
          ),
          // Custom heading styles - improved typography
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-bold mt-0 mb-6 sm:mb-8 leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold mt-12 sm:mt-16 mb-4 sm:mb-6 leading-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-semibold mt-8 sm:mt-12 mb-3 sm:mb-4 leading-tight">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base sm:text-lg font-semibold mt-6 sm:mt-8 mb-2 sm:mb-3 leading-tight">
              {children}
            </h4>
          ),
          // Custom list styles - clear hierarchy
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
          // Custom table styles - modern design
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 sm:my-10 rounded-xl border border-slate-200 shadow-lg bg-white">
              <table className="min-w-full border-collapse text-sm sm:text-base">
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
          // Custom code styles - refined design
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
          // Custom blockquote styles - elegant design
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-slate-400 bg-gradient-to-r from-slate-50 via-slate-100 to-transparent pl-8 pr-6 py-6 my-8 text-slate-700 rounded-r-xl relative">
              <div className="text-[17px] leading-[1.8] font-medium italic">
                {children}
              </div>
            </blockquote>
          ),
          // Custom emphasis text
          strong: ({ children }) => (
            <strong className="font-semibold">
              {children}
            </strong>
          ),
          // Custom links - consistent with theme
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
          // Custom horizontal rule
          hr: ({ }) => (
            <hr className="border-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-12" />
          ),
          // Custom italic text
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
