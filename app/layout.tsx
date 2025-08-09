import './globals.css';
import type { Metadata } from 'next';
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'GPT-OSS Blog - Open Source GPT Models Technical Blog',
  description: 'GPT-OSS Blog is a technical blog focused on open-source GPT models, providing model comparisons, usage guides, technical analysis, and AI chat functionality.',
  keywords: '',
  authors: [{ name: 'GPT-OSS Blog', url: 'https://gptoss.blog' }],
  creator: 'GPT-OSS Blog',
  metadataBase: new URL('https://gptoss.blog'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GPT-OSS Blog - Open Source GPT Models Technical Blog',
    description: 'GPT-OSS Blog focuses on open-source GPT model technology sharing, providing model comparisons, usage guides, and AI chat functionality',
    url: 'https://gptoss.blog',
    siteName: 'GPT-OSS Blog',
    images: [
      {
        url: '/extension_icon.png',
        width: 512,
        height: 512,
        alt: 'GPT-OSS Blog Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GPT-OSS Blog - Open Source GPT Models Technical Blog',
    description: 'GPT-OSS Blog focuses on open-source GPT model technology sharing and AI chat solutions',
    images: ['/extension_icon.png'],
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
        {/* Google tag (gtag.js) - Disabled in development to prevent fetch errors */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var script = document.createElement('script');
                  script.async = true;
                  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-W67X9XGTLV';
                  document.head.appendChild(script);
                  
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-W67X9XGTLV');
                  window.gtag = gtag;
                })();
              `,
            }}
          />
        )}
        
        {/* Favicon */}
        <link rel="icon" href="/extension_icon.png?v=2" sizes="any" />
        <link rel="icon" href="/extension_icon.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/extension_icon.png?v=2" />
        
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GPT-OSS Blog" />
        
        {/* Viewport for mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
