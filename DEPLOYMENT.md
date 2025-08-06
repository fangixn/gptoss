# Deployment Guide

This guide covers deploying the GPT-OSS Blog to various platforms.

## 🚀 Quick Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy this Next.js application:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your repository
   - Click "Deploy"

3. **Done!** Your site will be live at `your-project.vercel.app`

## 🔧 Environment Setup

### No Environment Variables Required
This application stores API keys in browser localStorage, so no server-side environment variables are needed for basic deployment.

### Optional Environment Variables
If you want to add server-side features later:

```bash
# For analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# For error monitoring  
SENTRY_DSN=your-sentry-dsn

# For database (if adding dynamic content)
DATABASE_URL=your-database-url
```

## 🏗️ Build Process

### Production Build
```bash
npm run build
npm run start
```

### Static Export (Optional)
For static hosting platforms:

```bash
npm run build
npm run export
```

This generates a `out/` folder with static files.

## 🌐 Alternative Deployment Platforms

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Deploy

### Railway
1. Connect your GitHub repository
2. Railway will auto-detect Next.js
3. Deploy automatically

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t gptoss-blog .
docker run -p 3000:3000 gptoss-blog
```

## ✅ Post-Deployment Checklist

- [ ] Site loads correctly at your domain
- [ ] All pages are accessible (/, /blog, /chat)
- [ ] AI chat interface works (after adding API keys)
- [ ] Blog posts load individually
- [ ] Mobile responsive design works
- [ ] SEO meta tags are present
- [ ] PWA manifest loads correctly

## 🔍 Troubleshooting

### Build Errors
- Check TypeScript errors: `npm run type-check`
- Check ESLint errors: `npm run lint`
- Ensure all dependencies are installed: `npm install`

### Runtime Errors
- Check browser console for JavaScript errors
- Verify API keys are properly configured (if using chat)
- Check network requests in browser dev tools

### Performance Issues
- Enable Next.js Image Optimization
- Consider adding a CDN for static assets
- Monitor Core Web Vitals

## 📊 Monitoring & Analytics

### Performance Monitoring
- Use Vercel Analytics (built-in with Vercel deployments)
- Add Google Analytics or Plausible for traffic insights
- Monitor Core Web Vitals with web-vitals library

### Error Tracking
- Consider adding Sentry for error monitoring
- Use Vercel's built-in error reporting
- Monitor logs in your deployment platform

## 🚀 Advanced Deployment

### Custom Domain
1. Purchase a domain from your preferred registrar
2. In Vercel dashboard, go to your project
3. Go to Settings > Domains
4. Add your custom domain
5. Update DNS records as instructed

### Multiple Environments
Set up staging and production environments:

```bash
# Staging
git push origin staging

# Production  
git push origin main
```

Configure different domains for each environment in your deployment platform.

---

**Need help?** Check the platform-specific documentation or open an issue in the repository.
