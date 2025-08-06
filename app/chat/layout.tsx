import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Chat - GPT-OSS Blog',
  description: 'AI Chat functionality for GPT-OSS Blog users',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Ensure not scraped by social media
  openGraph: {
    title: 'AI Chat - GPT-OSS Blog',
    description: 'AI Chat functionality',
  },
  twitter: {
    title: 'AI Chat - GPT-OSS Blog',
    description: 'AI Chat functionality',
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Additional meta tags for extra security */}
      <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      {children}
    </>
  );
}