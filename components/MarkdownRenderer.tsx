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
          // Custom paragraph - fixed spacing for consistent rendering
          p: ({ children }) => (
            <p className="text-slate-700 leading-[1.8] mb-4 text-base font-normal tracking-normal" style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '16px' }}>
              {children}
            </p>
          ),
          // Custom heading styles - fixed typography for consistent rendering
          h1: ({ children }) => (
            <h1 className="font-bold mt-0 mb-6 leading-tight" style={{ fontSize: '28px', marginBottom: '24px', lineHeight: '1.3', color: 'hsl(15 23 42)' }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-bold mt-12 mb-4 leading-tight" style={{ fontSize: '24px', marginTop: '48px', marginBottom: '16px', lineHeight: '1.3', color: 'hsl(15 23 42)' }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-semibold mt-8 mb-3 leading-tight" style={{ fontSize: '20px', marginTop: '32px', marginBottom: '12px', lineHeight: '1.3', color: 'hsl(15 23 42)' }}>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-semibold mt-6 mb-2 leading-tight" style={{ fontSize: '18px', marginTop: '24px', marginBottom: '8px', lineHeight: '1.3', color: 'hsl(15 23 42)' }}>
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="font-semibold mt-4 mb-2 leading-tight" style={{ fontSize: '16px', marginTop: '16px', marginBottom: '8px', lineHeight: '1.3', color: 'hsl(15 23 42)' }}>
              {children}
            </h5>
          ),
          // Custom list styles - fixed hierarchy for consistent rendering
          ul: ({ children }) => (
            <ul className="text-slate-700" style={{ margin: '24px 0', paddingLeft: '20px' }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="text-slate-700" style={{ margin: '24px 0', paddingLeft: '20px' }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-700" style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '8px', marginLeft: '20px', paddingLeft: '0px', listStyleType: 'disc', listStylePosition: 'outside' }}>
              {children}
            </li>
          ),
          // Custom table styles - fixed amber theme design
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-xl shadow-lg bg-white" style={{ margin: '24px 0' }}>
              <table className="min-w-full border-collapse border border-amber-200 rounded-xl" style={{ fontSize: '16px' }}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-amber-100 to-amber-200">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border-b-2 border-amber-300 text-left font-semibold uppercase tracking-wider text-amber-800" style={{ padding: '16px 24px', fontSize: '14px' }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-amber-100 text-slate-700" style={{ padding: '16px 24px', fontSize: '15px', lineHeight: '1.6' }}>
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-amber-50 transition-colors duration-200">
              {children}
            </tr>
          ),
          // Custom code styles - fixed design for consistent rendering
          code: ({ children, className }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-amber-50 text-amber-800 rounded-md font-mono border border-amber-200 font-medium" style={{ padding: '4px 8px', fontSize: '14px' }}>
                  {children}
                </code>
              )
            }
            return (
              <pre className="bg-slate-900 text-slate-100 rounded-xl overflow-x-auto border border-slate-700 shadow-lg" style={{ padding: '24px', margin: '32px 0' }}>
                <code className="font-mono font-normal" style={{ fontSize: '14px', lineHeight: '1.5' }}>{children}</code>
              </pre>
            )
          },
          // Custom blockquote styles - fixed elegant amber design
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 via-amber-100 to-transparent text-amber-900 rounded-r-xl relative shadow-sm" style={{ padding: '24px 24px 24px 32px', margin: '32px 0' }}>
              <div className="font-medium italic" style={{ fontSize: '17px', lineHeight: '1.8' }}>
                {children}
              </div>
            </blockquote>
          ),
          // Custom emphasis text - fixed styling
          strong: ({ children }) => (
            <strong className="font-bold text-amber-800" style={{ fontWeight: '700' }}>
              {children}
            </strong>
          ),
          // Custom links - fixed consistent theme
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-amber-700 underline font-medium"
              style={{ color: '#b45309', textDecorationColor: '#b45309', textDecorationThickness: '2px', textUnderlineOffset: '2px' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // Custom horizontal rule - fixed styling
          hr: ({ }) => (
            <hr className="border-0 bg-gradient-to-r from-transparent via-slate-300 to-transparent" style={{ height: '1px', margin: '48px 0' }} />
          ),
          // Custom italic text - fixed styling
          em: ({ children }) => (
            <em className="italic text-slate-600 font-medium" style={{ fontStyle: 'italic', fontWeight: '500' }}>
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
