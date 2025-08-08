#!/bin/bash

# GPT-OSS Blog 后端API配置脚本

echo "🚀 GPT-OSS Blog 后端API配置助手"
echo "=================================="
echo ""

# 检查.env.local是否已存在
if [ -f ".env.local" ]; then
    echo "⚠️  发现已存在的 .env.local 文件"
    read -p "是否要备份现有文件？(y/n): " backup_choice
    if [ "$backup_choice" = "y" ] || [ "$backup_choice" = "Y" ]; then
        cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
        echo "✅ 已备份到 .env.local.backup.$(date +%Y%m%d_%H%M%S)"
    fi
fi

echo ""
echo "请输入您的API Keys (直接回车跳过可选项):"
echo ""

# Fireworks API Key (必需)
while true; do
    read -p "🔥 Fireworks API Key (必需): " FIREWORKS_API_KEY
    if [ -n "$FIREWORKS_API_KEY" ]; then
        break
    else
        echo "❌ Fireworks API Key是必需的，请输入有效的key"
    fi
done

# 可选的API Keys
read -p "🤖 OpenAI API Key (可选): " OPENAI_API_KEY
read -p "🧠 DeepSeek API Key (可选): " DEEPSEEK_API_KEY  
read -p "💎 Google Gemini API Key (可选): " GEMINI_API_KEY
read -p "🤵 Anthropic Claude API Key (可选): " CLAUDE_API_KEY
read -p "🇨🇳 Alibaba Qwen API Key (可选): " QWEN_API_KEY

# 创建.env.local文件
echo "# GPT-OSS Blog 后端API配置" > .env.local
echo "# 生成时间: $(date)" >> .env.local
echo "" >> .env.local

echo "# Fireworks API Key (用于GPT-OSS模型)" >> .env.local
echo "FIREWORKS_API_KEY=$FIREWORKS_API_KEY" >> .env.local
echo "" >> .env.local

if [ -n "$OPENAI_API_KEY" ]; then
    echo "# OpenAI API Key" >> .env.local
    echo "OPENAI_API_KEY=$OPENAI_API_KEY" >> .env.local
    echo "" >> .env.local
fi

if [ -n "$DEEPSEEK_API_KEY" ]; then
    echo "# DeepSeek API Key" >> .env.local
    echo "DEEPSEEK_API_KEY=$DEEPSEEK_API_KEY" >> .env.local
    echo "" >> .env.local
fi

if [ -n "$GEMINI_API_KEY" ]; then
    echo "# Google Gemini API Key" >> .env.local
    echo "GEMINI_API_KEY=$GEMINI_API_KEY" >> .env.local
    echo "" >> .env.local
fi

if [ -n "$CLAUDE_API_KEY" ]; then
    echo "# Anthropic Claude API Key" >> .env.local
    echo "CLAUDE_API_KEY=$CLAUDE_API_KEY" >> .env.local
    echo "" >> .env.local
fi

if [ -n "$QWEN_API_KEY" ]; then
    echo "# Alibaba Qwen API Key" >> .env.local
    echo "QWEN_API_KEY=$QWEN_API_KEY" >> .env.local
    echo "" >> .env.local
fi

echo "✅ .env.local 文件已创建成功！"
echo ""
echo "🔄 请重启开发服务器以使配置生效:"
echo "   npm run dev"
echo ""
echo "🎉 配置完成！用户现在可以直接使用GPT-OSS模型，无需配置API Key。"
echo ""
echo "📝 提示:"
echo "   - GPT-OSS模型将显示'Ready to Use'标识"
echo "   - 用户无需自己申请Fireworks API Key"
echo "   - 配置的API Key安全存储在服务器端"
