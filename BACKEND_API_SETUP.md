# 后端API配置说明

## 概述

现在您可以在后端配置API Key，让用户无需自己申请就能使用GPT-OSS模型！

## 配置步骤

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# Fireworks API Key (用于GPT-OSS模型)
FIREWORKS_API_KEY=your_fireworks_api_key_here

# 其他API Keys（可选）
OPENAI_API_KEY=your_openai_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CLAUDE_API_KEY=your_claude_api_key_here
QWEN_API_KEY=your_qwen_api_key_here
```

### 2. 获取Fireworks API Key

1. 访问 [https://fireworks.ai/api-keys](https://fireworks.ai/api-keys)
2. 注册或登录Fireworks AI账户
3. 创建新的API Key
4. 复制生成的API Key

### 3. 重启开发服务器

```bash
npm run dev
```

## 功能说明

### 用户体验

- **GPT-OSS-120B (HF)** 和 **GPT-OSS-20B (HF)** 模型会显示 "Ready to Use" 标识
- 用户无需配置API Key即可使用这些模型
- 其他模型仍需用户自己配置API Key

### 技术实现

- **后端代理**: 通过 `/api/chat` 端点代理API调用
- **智能路由**: 自动检测使用后端key还是用户key
- **安全存储**: API Key安全存储在服务器环境变量中

### API端点

- `POST /api/chat` - 发送聊天请求
- `GET /api/chat` - 获取后端配置的模型列表

## 部署到生产环境

### Vercel部署

1. 在Vercel项目设置中添加环境变量
2. 设置 `FIREWORKS_API_KEY` 等变量
3. 重新部署

### 其他平台

确保在生产环境中设置相应的环境变量。

## 故障排除

### 模型不显示"Ready to Use"标识

- 检查 `.env.local` 文件是否存在
- 确认 `FIREWORKS_API_KEY` 已设置
- 重启开发服务器

### API调用失败

- 检查API Key是否有效
- 确认网络连接正常
- 查看浏览器控制台错误信息

## 安全提醒

- 不要将 `.env.local` 文件提交到git
- 定期更换API Key
- 监控API使用量和费用
