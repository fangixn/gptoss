# AI 博客模板

一个现代化的 AI 聊天博客平台模板，支持多个 AI 模型集成。

## 功能特性

### 🤖 多 AI 模型支持
- 支持集成多个主流 AI 模型
- 实时 AI 对话功能
- 灵活的模型切换
- 专业的聊天界面

### 🎨 现代化设计
- 基于 Next.js 13+ 和 App Router
- Radix UI + Tailwind CSS 组件库
- 响应式设计，支持多设备
- 优雅的用户界面

### 📱 核心功能
- 聊天历史管理
- API 设置配置
- 实时状态指示器
- 主题切换支持

## 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. 下载或克隆此模板：
```bash
git clone <your-repository-url>
cd ai-blog-template
```

2. 安装依赖：
```bash
npm install
```

3. 配置 API 密钥：
   - 启动应用
   - 点击头部的 "API 设置"
   - 输入你要使用的 AI 模型的 API 密钥

4. 启动开发服务器：
```bash
npm run dev
```

访问 `http://localhost:3000` 查看你的应用。

## API 密钥配置

根据需要获取以下 AI 模型的 API 密钥：

- **OpenAI (ChatGPT)**: [OpenAI Platform](https://platform.openai.com)
- **Anthropic (Claude)**: [Anthropic Console](https://console.anthropic.com)
- **Google (Gemini)**: [Google AI Studio](https://aistudio.google.com)
- **DeepSeek**: [DeepSeek Platform](https://platform.deepseek.com)
- **阿里云 (通义千问)**: [DashScope](https://dashscope.aliyuncs.com)

## 部署

### 部署到 Vercel

1. Fork 此仓库到你的 GitHub 账户
2. 在 Vercel 中连接你的 GitHub 账户
3. 导入你的 Fork 仓库
4. 部署（Vercel 会自动检测 Next.js 项目）

### 环境变量
基础部署无需环境变量。API 密钥在浏览器中配置并本地存储。

## 技术栈

- **框架**: Next.js 13+ with App Router
- **UI 组件**: Radix UI + Tailwind CSS
- **图标**: Lucide React
- **部署**: Vercel
- **语言**: TypeScript

## 项目结构

```
├── app/
│   ├── page.tsx          # 首页
│   ├── chat/
│   │   └── page.tsx      # 聊天界面
│   ├── layout.tsx        # 根布局
│   └── globals.css       # 全局样式
├── components/
│   ├── ApiStatusIndicator.tsx  # API状态指示器
│   └── ui/               # 可复用 UI 组件
├── hooks/                # 自定义 React Hooks
├── lib/
│   ├── apiConfig.ts      # AI 模型配置
│   └── utils.ts          # 工具函数
└── public/               # 静态资源
```

## 自定义开发

### 添加新的 AI 模型
1. 在 `lib/apiConfig.ts` 中添加模型配置
2. 更新 `hooks/useApiSettings.ts` 以包含新模型
3. 在聊天界面中添加模型选择选项

### 自定义样式
- 编辑 `app/globals.css` 修改全局样式
- 在 `tailwind.config.ts` 中自定义主题
- 修改 `components/ui/` 中的组件样式

### 添加新功能
- 在 `app/` 目录下创建新页面
- 在 `components/` 中添加新组件
- 使用 `hooks/` 目录管理状态逻辑

## 贡献指南

1. Fork 这个仓库
2. 创建你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

此项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 支持

如有问题或需要支持，请在 GitHub 仓库中创建 issue。

---

**AI 博客模板** - 现代化的 AI 聊天平台解决方案