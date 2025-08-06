# GPT-OSS Blog

A modern AI-powered blog platform template with integrated multi-model AI chat functionality, focused on open-source GPT models and AI technology discussions.

## ✨ Features

### 🤖 Multi-AI Model Support
- **Multiple AI Providers**: OpenAI, Anthropic, Google Gemini, DeepSeek, and Alibaba Cloud Qwen
- **Real-time AI Chat**: Professional chat interface with conversation history
- **Model Switching**: Easy switching between different AI models
- **Local Storage**: API keys and chat history stored securely in browser

### 🎨 Modern Design
- **Next.js 13+ App Router**: Latest React framework with file-based routing
- **Radix UI Components**: Accessible, customizable UI component library
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **TypeScript**: Full type safety and better development experience

### 📝 Blog Features
- **Sample Blog Posts**: Three technical articles about GPT-OSS models
- **Dynamic Routing**: SEO-friendly URLs for individual blog posts
- **Content Management**: Easy-to-modify hardcoded blog content
- **Search & Filter**: Built-in search and category filtering
- **Responsive Design**: Mobile-first responsive layout

### 🔧 Technical Features
- **PWA Ready**: Progressive Web App with manifest.json
- **SEO Optimized**: Comprehensive meta tags, robots.txt, and sitemap.xml
- **API Status Indicator**: Real-time status monitoring for AI services
- **Type Safety**: Full TypeScript implementation
- **Modern Hooks**: Custom React hooks for state management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd gptoss_Blog
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Visit `http://localhost:3000`

5. **Configure AI Models** (Optional):
   - Click the gear icon in the top navigation
   - Add API keys for the AI models you want to use
   - Keys are stored locally in your browser

## 📁 Project Structure

```
gptoss_Blog/
├── app/                    # Next.js 13+ App Router
│   ├── page.tsx           # Homepage with AI model cards
│   ├── layout.tsx         # Root layout with metadata
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── blog/
│   │   ├── page.tsx       # Blog listing page
│   │   └── [slug]/
│   │       └── page.tsx   # Individual blog post pages
│   └── chat/
│       ├── page.tsx       # AI chat interface
│       └── layout.tsx     # Chat-specific layout
├── components/
│   ├── ApiStatusIndicator.tsx  # API status indicator component
│   └── ui/                     # Radix UI components
├── hooks/
│   ├── useApiSettings.ts       # API configuration management
│   ├── useChatSessions.ts      # Chat session management
│   └── use-toast.ts           # Toast notifications
├── lib/
│   ├── apiConfig.ts           # AI model configurations
│   └── utils.ts               # Utility functions
└── public/
    ├── icon.svg               # App icon
    ├── manifest.json          # PWA manifest
    ├── robots.txt             # Search engine directives
    └── sitemap.xml            # Site structure map
```

## 🔑 API Configuration

The application supports multiple AI providers. Get API keys from:

- **OpenAI**: [platform.openai.com](https://platform.openai.com)
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com)
- **Google Gemini**: [aistudio.google.com](https://aistudio.google.com)
- **DeepSeek**: [platform.deepseek.com](https://platform.deepseek.com)
- **Alibaba Cloud**: [dashscope.aliyuncs.com](https://dashscope.aliyuncs.com)

API keys are stored locally in browser localStorage - no server-side configuration required.

## 📖 Blog Content

The blog includes three sample articles:

1. **GPT-OSS-120B vs OpenAI o4-mini Comparison** - Technical analysis comparing open-source and proprietary models
2. **GPT-OSS-120B vs GPT-OSS-20B** - Guide for choosing between different model sizes
3. **What is GPT-OSS?** - Complete guide to open-source GPT models

All blog content is currently hardcoded in the respective page components and can be easily replaced with a CMS or database.

## 🛠️ Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript type checking
```

### Adding New Blog Posts

1. Add new post data to the `blogPosts` array in `/app/blog/page.tsx`
2. Update the `generateStaticParams` function in `/app/blog/[slug]/page.tsx`
3. Update `/public/sitemap.xml` with the new post URL

### Adding New AI Models

1. Add configuration to `/lib/apiConfig.ts`
2. Update the `useApiSettings` hook in `/hooks/useApiSettings.ts`
3. Add the model to the homepage cards in `/app/page.tsx`

### Customizing Styling

- Global styles: `/app/globals.css`
- Component styles: Modify Tailwind classes in components
- UI components: Customize in `/components/ui/`
- Theme configuration: `/tailwind.config.ts`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically - no configuration needed

### Alternative Deployments

- **Netlify**: Static hosting with automatic builds
- **Docker**: Container-based deployment
- **Static Export**: Generate static files with `npm run build`

## 🔧 Customization Ideas

- **CMS Integration**: Replace hardcoded blog posts with Contentful, Sanity, or Strapi
- **Database**: Add PostgreSQL/MongoDB for dynamic content
- **Authentication**: Add user accounts and personalized chat history
- **Comments**: Integrate comment system for blog posts
- **Analytics**: Add Google Analytics or Plausible
- **Search**: Implement full-text search with Algolia or similar
- **Newsletter**: Add email subscription functionality

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

**GPT-OSS Blog** - Exploring the frontier of open-source AI technology

*Last updated: August 6, 2025*