'use client';

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import MarkdownRenderer from './MarkdownRenderer';

interface ImageGeneratorProps {
  userQuestion: string;
  assistantResponse: string;
  timestamp: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  userQuestion,
  assistantResponse,
  timestamp
}) => {
  const imageRef = useRef<HTMLDivElement>(null);

  // Smart title extraction, remove instructional suffixes
  const cleanTitle = (title: string): string => {
    const instructionPatterns = [
      /[，,]?\s*answer in one sentence[。.]?$/i,
    /[，,]?\s*please answer briefly[。.]?$/i,
    /[，,]?\s*simple answer[。.]?$/i,
    /[，,]?\s*please answer[。.]?$/i,
    /[，,]?\s*answer this[。.]?$/i,
    /[，,]?\s*explain this[。.]?$/i,
    /[，,]?\s*describe this[。.]?$/i,
    /[，,]?\s*introduce this[。.]?$/i,
    /[，,]?\s*detailed explanation[。.]?$/i,
    /[，,]?\s*specific explanation[。.]?$/i
    ];
    
    let cleanedTitle = title.trim();
    for (const pattern of instructionPatterns) {
      cleanedTitle = cleanedTitle.replace(pattern, '');
    }
    
    return cleanedTitle.trim() || title;
  };

  const generateImage = async () => {
    if (!imageRef.current) return;

    try {
      // Wait for fonts to load
      await document.fonts.ready;
      
      // Wait briefly to ensure all styles are applied
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(imageRef.current, {
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        width: 800,
        logging: false,
        imageTimeout: 15000,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800,
        windowHeight: window.innerHeight,
        onclone: (clonedDoc: Document) => {
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            }
            .prose * {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            }
            
            /* MarkdownRenderer styles */
            .prose p {
              color: #334155 !important;
              line-height: 1.8 !important;
              margin-bottom: 16px !important;
              font-size: 16px !important;
              font-weight: normal !important;
            }
            
            .prose h1, .prose h2, .prose h3, .prose h4, .prose h5 {
              color: hsl(15, 23%, 42%) !important;
              font-weight: bold !important;
              line-height: 1.3 !important;
            }
            
            .prose h1 {
              font-size: 28px !important;
              margin-bottom: 24px !important;
              margin-top: 0 !important;
            }
            
            .prose h2 {
              font-size: 24px !important;
              margin-top: 48px !important;
              margin-bottom: 16px !important;
            }
            
            .prose h3 {
              font-size: 20px !important;
              margin-top: 32px !important;
              margin-bottom: 12px !important;
              font-weight: 600 !important;
            }
            
            .prose h4 {
              font-size: 18px !important;
              margin-top: 24px !important;
              margin-bottom: 8px !important;
              font-weight: 600 !important;
            }
            
            .prose h5 {
              font-size: 16px !important;
              margin-top: 16px !important;
              margin-bottom: 8px !important;
              font-weight: 600 !important;
            }
            
            .prose ul, .prose ol {
              color: #334155 !important;
              margin: 24px 0 !important;
              padding-left: 20px !important;
            }
            
            .prose li {
              color: #334155 !important;
              font-size: 16px !important;
              line-height: 1.8 !important;
              margin-bottom: 8px !important;
              margin-left: 20px !important;
              padding-left: 0 !important;
              list-style-type: disc !important;
              list-style-position: outside !important;
            }
            
            .prose table {
              margin: 24px 0 !important;
              border-collapse: collapse !important;
              border: 1px solid #fbbf24 !important;
              border-radius: 12px !important;
              font-size: 16px !important;
              background: white !important;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
            }
            
            .prose thead {
              background: linear-gradient(to right, #fef3c7, #fde68a) !important;
            }
            
            .prose th {
              border-bottom: 2px solid #f59e0b !important;
              text-align: left !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.05em !important;
              color: #92400e !important;
              padding: 16px 24px !important;
              font-size: 14px !important;
            }
            
            .prose td {
              border-bottom: 1px solid #fef3c7 !important;
              color: #334155 !important;
              padding: 16px 24px !important;
              font-size: 15px !important;
              line-height: 1.6 !important;
            }
            
            .prose tr:hover {
              background-color: #fffbeb !important;
            }
            
            .prose code {
              background-color: #fffbeb !important;
              color: #92400e !important;
              border-radius: 6px !important;
              border: 1px solid #fde68a !important;
              font-weight: 500 !important;
              padding: 4px 8px !important;
              font-size: 14px !important;
              font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace !important;
            }
            
            .prose pre {
              background-color: #0f172a !important;
              color: #e2e8f0 !important;
              border-radius: 12px !important;
              border: 1px solid #334155 !important;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
              padding: 24px !important;
              margin: 32px 0 !important;
              overflow-x: auto !important;
            }
            
            .prose pre code {
              background: none !important;
              color: inherit !important;
              border: none !important;
              padding: 0 !important;
              font-size: 14px !important;
              line-height: 1.5 !important;
              font-weight: normal !important;
            }
            
            .prose blockquote {
              border-left: 4px solid #fbbf24 !important;
              background: linear-gradient(to right, #fffbeb, #fef3c7, transparent) !important;
              color: #78350f !important;
              border-radius: 0 12px 12px 0 !important;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
              padding: 24px 24px 24px 32px !important;
              margin: 32px 0 !important;
              font-weight: 500 !important;
              font-style: italic !important;
              font-size: 17px !important;
              line-height: 1.8 !important;
            }
            
            .prose strong {
              font-weight: 700 !important;
              color: #92400e !important;
            }
            
            .prose a {
              color: #b45309 !important;
              text-decoration: underline !important;
              font-weight: 500 !important;
              text-decoration-color: #b45309 !important;
              text-decoration-thickness: 2px !important;
              text-underline-offset: 2px !important;
            }
            
            .prose hr {
              border: 0 !important;
              background: linear-gradient(to right, transparent, #cbd5e1, transparent) !important;
              height: 1px !important;
              margin: 48px 0 !important;
            }
            
            .prose em {
              font-style: italic !important;
              color: #475569 !important;
              font-weight: 500 !important;
            }
            
            /* Top title styles */
            .text-xl {
              font-size: 24px !important;
              line-height: 1.4 !important;
              font-weight: 600 !important;
              color: #111827 !important;
            }
          `;
          clonedDoc.head.appendChild(style);
          
          const targetElement = clonedDoc.querySelector('[data-html2canvas-ignore="false"]') || clonedDoc.body;
          if (targetElement) {
            (targetElement as HTMLElement).style.minHeight = 'auto';
            (targetElement as HTMLElement).style.height = 'auto';
          }
        }
      } as any);

      // Create download link
      const link = document.createElement('a');
      link.download = `chat-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Image generation failed:', error);
      alert('Image generation failed, please try again');
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview Area */}
      <div 
        ref={imageRef}
        className="bg-white border border-gray-200 rounded-lg shadow-sm"
        style={{
          width: '800px',
          minHeight: 'auto',
          height: 'auto',
          padding: '40px',
          paddingTop: '40px',
          paddingBottom: '40px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#1f2937',
          boxSizing: 'border-box',
          overflow: 'visible'
        }}
      >
        {/* Title Area */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex-1 min-w-0" style={{ minHeight: 'auto', height: 'auto' }}>
            <h1 
              className="text-xl font-semibold text-gray-900"
              style={{
                maxWidth: '500px',
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                lineHeight: '1.4',
                overflow: 'visible'
              }}
            >
              {cleanTitle(userQuestion)}
            </h1>
          </div>
          <div 
            className="text-sm text-gray-500 ml-4"
            style={{ 
              flexShrink: 0,
              alignSelf: 'flex-start',
              marginTop: '2px'
            }}
          >
            {timestamp}
          </div>
        </div>

        {/* Content */}
        <div 
          className="prose prose-slate max-w-none"
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#374151',
            fontFamily: 'inherit'
          }}
        >
          <MarkdownRenderer content={assistantResponse} />
        </div>

        {/* Footer URL */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <div 
            className="text-sm text-gray-600"
            style={{
              lineHeight: '1.2',
              fontSize: '14px'
            }}
          >
            gptoss.blog
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={generateImage}
          className="px-6 py-2 bg-accent text-accent-foreground border border-accent-foreground/20 hover:bg-accent/80 rounded-lg transition-colors"
        >
          Generate Image
        </button>
      </div>
    </div>
  );
};

export default ImageGenerator;
export { ImageGenerator };