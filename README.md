# GPT-OSS Blog

A modern AI-powered blog platform template with integrated multi-model AI chat functionality, focused on open-source GPT models.

## Features

### 🤖 Multi-AI Model Support
- Integration with multiple mainstream AI models
- Real-time AI conversation functionality
- Flexible model switching
- Professional chat interface

### 🎨 Modern Design
- Built with Next.js 13+ and App Router
- Radix UI + Tailwind CSS component library
- Responsive design for all devices
- Elegant user interface

### 📱 Core Functionality
- Blog content management
- Chat history management
- API settings configuration
- Real-time status indicators
- SEO optimization

## Quick Start

### System Requirements
- Node.js 18+ 
- npm or yarn

### Installation Steps

1. Clone this repository:
```bash
git clone https://github.com/your-username/gptoss-blog
cd gptoss-blog
```

2. Install dependencies:
```bash
npm install
```

3. Configure API keys:
   - Start the application
   - Click "API Settings" in the header
   - Enter API keys for the AI models you want to use

4. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to view your application.

## API Key Configuration

Get API keys for the following AI models as needed:

- **OpenAI (GPT-4, GPT-3.5)**: [OpenAI Platform](https://platform.openai.com)
- **Anthropic (Claude)**: [Anthropic Console](https://console.anthropic.com)
- **Google (Gemini)**: [Google AI Studio](https://aistudio.google.com)
- **DeepSeek**: [DeepSeek Platform](https://platform.deepseek.com)
- **Alibaba Cloud (Qwen)**: [DashScope](https://dashscope.aliyuncs.com)

## Deployment

### Deploy to Vercel

1. Fork this repository to your GitHub account
2. Connect your GitHub account in Vercel
3. Import your forked repository
4. Deploy (Vercel will automatically detect the Next.js project)

### Environment Variables
No environment variables required for basic deployment. API keys are configured in the browser and stored locally.

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **UI Components**: Radix UI + Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Language**: TypeScript

## Project Structure

```
├── app/
│   ├── page.tsx              # Homepage
│   ├── blog/
│   │   ├── page.tsx          # Blog listing page
│   │   └── [slug]/
│   │       └── page.tsx      # Individual blog posts
│   ├── chat/
│   │   ├── page.tsx          # Chat interface
│   │   └── layout.tsx        # Chat-specific layout
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ApiStatusIndicator.tsx # API status indicator
│   └── ui/                   # Reusable UI components
├── hooks/                    # Custom React Hooks
├── lib/
│   ├── apiConfig.ts          # AI model configurations
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
    ├── robots.txt            # Search engine crawling rules
    └── sitemap.xml           # Site structure for SEO
```

## Custom Development

### Adding New AI Models
1. Add model configuration in `lib/apiConfig.ts`
2. Update `hooks/useApiSettings.ts` to include the new model
3. Add model selection options in the chat interface

### Customizing Styles
- Edit `app/globals.css` to modify global styles
- Customize themes in `tailwind.config.ts`
- Modify component styles in `components/ui/`

### Adding New Features
- Create new pages in the `app/` directory
- Add new components in `components/`
- Manage state logic using `hooks/` directory

## Blog Content

The blog includes sample articles about:
- GPT-OSS model comparisons with OpenAI models
- Performance benchmarks and analysis
- Usage guides for open-source GPT models
- Technical tutorials and implementation guides

## SEO & Performance

- Optimized robots.txt for search engine crawling
- Comprehensive sitemap.xml for better indexing
- Mobile-responsive design
- Fast loading times with Next.js optimizations

## Contributing

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or support, please create an issue in the GitHub repository.

---

**GPT-OSS Blog** - A modern AI chat and blog platform solution

*Last updated: August 6, 2025*