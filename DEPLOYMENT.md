# AI 博客模板 - 部署指南

## ✅ 部署前检查清单

### 代码质量
- [ ] 代码编译无错误
- [ ] TypeScript 类型检查通过
- [ ] 构建过程成功完成
- [ ] 所有依赖正确安装

### 配置文件
- [ ] `package.json` - 项目配置正确
- [ ] `next.config.js` - 生产环境优化
- [ ] `vercel.json` - Vercel 部署配置
- [ ] `.gitignore` - 正确的文件排除
- [ ] `tsconfig.json` - TypeScript 配置

### 应用结构
- [ ] 首页 (`/`) - 功能展示和介绍
- [ ] 聊天页面 (`/chat`) - AI 对话界面
- [ ] API 配置 - AI 模型正确配置
- [ ] 响应式设计 - 多设备适配

### UI 组件
- [ ] Radix UI 组件正确导入
- [ ] Tailwind CSS 样式正确应用
- [ ] 图标 (Lucide React) 正常工作
- [ ] 主题切换功能正常

### 功能性
- [ ] AI 模型选择功能
- [ ] 聊天历史持久化 (localStorage)
- [ ] API 密钥配置界面
- [ ] 实时消息界面
- [ ] 错误处理机制

## 🚀 部署步骤

### 方案 1: Vercel (推荐)

1. **准备 GitHub 仓库**
   ```bash
   git add .
   git commit -m "初始化 AI 博客模板"
   git push origin main
   ```

2. **Vercel 部署**
   - 访问 [vercel.com](https://vercel.com)
   - 连接 GitHub 账户
   - 导入你的仓库
   - 自动部署

### 方案 2: 手动构建

1. **本地测试**
   ```bash
   npm run build
   npm run start
   ```

2. **生产构建**
   ```bash
   npm run build
   npm run export  # 如需静态导出
   ```

## 🔧 环境配置

### API 密钥设置 (部署后配置)
用户需要在浏览器中配置以下 API 密钥：

- **OpenAI API 密钥**: [platform.openai.com](https://platform.openai.com)
- **Anthropic API 密钥**: [console.anthropic.com](https://console.anthropic.com)  
- **Google API 密钥**: [aistudio.google.com](https://aistudio.google.com)
- **DeepSeek API 密钥**: [platform.deepseek.com](https://platform.deepseek.com)
- **阿里云 API 密钥**: [dashscope.aliyuncs.com](https://dashscope.aliyuncs.com)

### 性能优化
- [ ] 静态页面生成
- [ ] 组件懒加载
- [ ] 图片优化处理
- [ ] 打包大小最小化

## 📊 部署后验证

### 功能测试
- [ ] 首页正确加载
- [ ] 所有 AI 模型按钮功能正常
- [ ] 聊天页面导航正常
- [ ] API 密钥配置对话框功能正常
- [ ] 聊天历史持久化正常
- [ ] 移动端响应式设计验证

### 性能测试
- [ ] 页面加载时间可接受
- [ ] 打包大小优化
- [ ] 无控制台错误
- [ ] SEO 元数据正确

## 🐛 故障排除

### 常见问题

1. **构建失败**
   - 检查 TypeScript 错误: `npm run type-check`
   - 验证所有导入正确
   - 确保所有依赖已安装

2. **运行时错误**  
   - 检查浏览器控制台错误
   - 验证 API 配置
   - 测试 localStorage 功能

3. **性能问题**
   - 检查打包分析器输出
   - 检查大型依赖
   - 优化图片和资源

## 📚 文档链接

- [Next.js 部署](https://nextjs.org/docs/deployment)
- [Vercel 文档](https://vercel.com/docs)
- [Radix UI 组件](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎯 自定义开发建议

### 添加新功能
1. 在 `app/` 目录下创建新页面
2. 在 `components/` 中添加新组件
3. 使用 `hooks/` 目录管理状态逻辑

### 样式自定义
1. 编辑 `app/globals.css` 修改全局样式
2. 在 `tailwind.config.ts` 中自定义主题
3. 修改 `components/ui/` 中的组件样式

### AI 模型集成
1. 在 `lib/apiConfig.ts` 中添加新模型配置
2. 更新 `hooks/useApiSettings.ts` 包含新模型
3. 在聊天界面添加模型选择选项

---

**状态**: ✅ 模板准备就绪，可用于生产部署