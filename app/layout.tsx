import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI 博客模板 - 现代化的AI聊天平台',
  description: '现代化的AI博客模板，支持多个AI模型集成，包含聊天功能、博客系统和响应式设计。基于Next.js构建的完整解决方案。',
  keywords: 'AI, 博客, 模板, Next.js, React, TypeScript, 聊天机器人, AI模型, 现代化设计',
  authors: [{ name: 'AI Blog Template', url: '#' }],
  creator: 'AI Blog Template',
  metadataBase: new URL('https://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI 博客模板 - 现代化的AI聊天平台',
    description: '现代化的AI博客模板，支持多个AI模型集成，包含聊天功能、博客系统和响应式设计',
    url: 'https://localhost:3000',
    siteName: 'AI 博客模板',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'AI 博客模板 Logo',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 博客模板 - 现代化的AI聊天平台',
    description: '现代化的AI博客模板，完整的AI聊天解决方案',
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EconAI" />
        
        {/* Viewport for mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WTG8PRNPZQ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WTG8PRNPZQ');
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
