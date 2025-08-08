# GPT-OSS Blog 配置指南

## 🎯 概述

GPT-OSS Blog 现在支持**后端API代理**，您可以在后台配置API Key，让用户无需自己申请就能直接使用GPT-OSS模型！

## 🚀 快速开始

### 方法一：使用配置脚本（推荐）

1. 运行配置脚本：
```bash
./setup-backend-api.sh
```

2. 按提示输入您的API Keys

3. 重启开发服务器：
```bash
npm run dev
```

### 方法二：手动配置

1. 在项目根目录创建 `.env.local` 文件：
```bash
# Fireworks API Key (必需)
FIREWORKS_API_KEY=your_fireworks_api_key_here

# 其他API Keys (可选)
OPENAI_API_KEY=your_openai_key_here
DEEPSEEK_API_KEY=your_deepseek_key_here
GEMINI_API_KEY=your_gemini_key_here
CLAUDE_API_KEY=your_claude_key_here
QWEN_API_KEY=your_qwen_key_here
```

2. 重启服务器应用配置

## 🔑 获取API Keys

### Fireworks API Key（必需）
1. 访问 [https://fireworks.ai/api-keys](https://fireworks.ai/api-keys)
2. 注册或登录Fireworks AI账户
3. 创建新的API Key
4. 复制生成的API Key

### 其他API Keys（可选）
- **OpenAI**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **DeepSeek**: [https://platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)
- **Google Gemini**: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **Anthropic Claude**: [https://console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
- **Alibaba Qwen**: [https://dashscope.console.aliyun.com/api-key](https://dashscope.console.aliyun.com/api-key)

## 🎉 用户体验

### 配置后的效果
- ✅ GPT-OSS模型显示"Ready to Use"标识
- ✅ 用户无需配置API Key即可使用
- ✅ 即开即用的体验
- ✅ API Key安全存储在后端

### 前后对比

| 功能 | 配置前 | 配置后 |
|------|--------|--------|
| GPT-OSS使用 | ❌ 需要用户自己申请API Key | ✅ 直接使用，无需配置 |
| 安全性 | ❌ API Key暴露在前端 | ✅ 安全存储在后端 |
| 用户门槛 | ❌ 需要技术知识 | ✅ 零门槛使用 |
| 管理成本 | ❌ 用户各自管理 | ✅ 统一管理 |

## 🧪 测试配置

### 运行测试脚本
```bash
node test-backend-api.js
```

### 手动测试
1. 打开浏览器访问 `http://localhost:3000`
2. 选择 GPT-OSS-120B (HF) 或 GPT-OSS-20B (HF)
3. 查看是否显示"Ready to Use"标识
4. 直接开始对话测试

## 🏭 生产环境部署

### Vercel部署
1. 在Vercel项目设置中添加环境变量
2. 设置 `HUGGINGFACE_API_KEY`
3. 重新部署

### 其他平台
确保在生产环境中设置相应的环境变量。

## 🔧 API接口

### 获取后端配置模型
```javascript
GET /api/chat
```

响应：
```json
{
  "success": true,
  "availableModels": [
    {
      "model": "gpt-oss-120b-hf",
      "name": "GPT-OSS-120B (HF)",
      "backendConfigured": true
    }
  ],
  "totalConfigured": 2
}
```

### 发送聊天请求
```javascript
POST /api/chat
```

请求体：
```json
{
  "model": "gpt-oss-120b-hf",
  "prompt": "你好，这是一条测试消息",
  "useBackendKey": true
}
```

## 🔒 安全建议

- ✅ 不要将 `.env.local` 提交到git
- ✅ 定期更换API Key
- ✅ 监控API使用量和费用
- ✅ 在生产环境使用环境变量

## 🐛 故障排除

### 模型不显示"Ready to Use"标识
- 检查 `.env.local` 文件是否存在
- 确认 `FIREWORKS_API_KEY` 已设置
- 重启开发服务器

### API调用失败
- 检查API Key是否有效
- 确认网络连接正常
- 查看浏览器控制台错误信息
- 检查服务器日志

### 开发服务器问题
```bash
# 停止当前服务器
Ctrl+C

# 重新启动
npm run dev
```

## 📞 支持

如果遇到问题，请：
1. 查看浏览器控制台错误
2. 检查服务器日志
3. 确认环境变量配置正确
4. 测试API Key有效性
