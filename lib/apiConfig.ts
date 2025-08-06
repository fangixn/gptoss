export interface ApiConfig {
  name: string;
  apiUrl: string;
  timeout?: number;
  buildHeaders: (apiKey: string) => Record<string, string>;
  buildBody: (prompt: string) => any;
  parseResponse: (data: any) => string;
  getApiUrl?: (apiKey: string) => string;
}

export const API_CONFIGS: Record<string, ApiConfig> = {
  openai: {
    name: 'ChatGPT',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    timeout: 30000,
    buildHeaders: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    buildBody: (prompt: string) => ({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant with expertise in open-source AI models, particularly GPT-OSS and related technologies. Provide detailed, accurate information about AI models, their capabilities, deployment, and best practices. Help users understand technical concepts and make informed decisions about AI implementations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
    parseResponse: (data: any) => {
      return data.choices?.[0]?.message?.content || 'No response received';
    }
  },

  deepseek: {
    name: 'DeepSeek',
    apiUrl: 'https://api.deepseek.com/chat/completions',
    timeout: 30000,
    buildHeaders: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    buildBody: (prompt: string) => ({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an AI technology expert specializing in open-source language models and GPT-OSS implementations. Provide comprehensive technical guidance on model selection, deployment strategies, performance optimization, and practical implementation advice. Focus on helping users leverage open-source AI effectively.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
    parseResponse: (data: any) => {
      return data.choices?.[0]?.message?.content || 'No response received';
    }
  },

  gemini: {
    name: 'Gemini',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    timeout: 30000,
    getApiUrl: (apiKey: string) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    buildHeaders: (apiKey: string) => ({
      'Content-Type': 'application/json',
    }),
    buildBody: (prompt: string) => ({
      contents: [{
        parts: [{
          text: `As an AI technology specialist with deep knowledge of open-source language models, GPT-OSS, and AI deployment strategies, please provide a thorough analysis of the following technical question. Use your expertise in AI architecture, performance optimization, and implementation best practices to offer insights:\n\n${prompt}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      }
    }),
    parseResponse: (data: any) => {
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
    }
  },

  claude: {
    name: 'Claude',
    apiUrl: 'https://api.anthropic.com/v1/messages',
    timeout: 30000,
    buildHeaders: (apiKey: string) => ({
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    }),
    buildBody: (prompt: string) => ({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are an expert in AI technology and open-source language models with deep knowledge of GPT-OSS, model architectures, deployment strategies, and performance optimization. Please provide a comprehensive and analytical response to this technical question, drawing from current AI research and best practices:\n\n${prompt}`
        }
      ]
    }),
    parseResponse: (data: any) => {
      return data.content?.[0]?.text || 'No response received';
    }
  },

  qwen: {
    name: 'Qwen',
    apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    timeout: 30000,
    buildHeaders: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    buildBody: (prompt: string) => ({
      model: 'qwen-turbo',
      input: {
        messages: [
          {
            role: 'system',
            content: 'You are a leading AI researcher and technology analyst with expertise in both theoretical and applied machine learning. Your knowledge spans open-source AI models, GPT-OSS implementations, model optimization, and deployment strategies. Provide detailed, evidence-based responses to AI questions with clear explanations and practical insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      parameters: {
        max_tokens: 2000,
        temperature: 0.7,
      }
    }),
    parseResponse: (data: any) => {
      return data.output?.text || data.output?.choices?.[0]?.message?.content || 'No response received';
    }
  }
};

export const AVAILABLE_MODELS = [
  { id: 'openai', name: 'ChatGPT', description: 'OpenAI GPT-3.5', color: 'bg-green-500' },
  { id: 'deepseek', name: 'DeepSeek', description: 'DeepSeek AI Model', color: 'bg-blue-500' },
  { id: 'gemini', name: 'Gemini', description: 'Google Gemini', color: 'bg-purple-500' },
  { id: 'claude', name: 'Claude', description: 'Anthropic Claude', color: 'bg-orange-500' },
  { id: 'qwen', name: 'Qwen', description: 'Alibaba Cloud Qwen', color: 'bg-red-500' }
];

// API priority configuration (for intelligent analysis functionality)
export const ANALYSIS_API_PRIORITY = ['openai', 'claude', 'gemini', 'deepseek', 'qwen'];

// Performance settings
export const PERFORMANCE_SETTINGS = {
  DEFAULT_TIMEOUT: 30000,
  ANALYSIS_TIMEOUT: 45000,
  MAX_PARALLEL_REQUESTS: 3,
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000,
}; 