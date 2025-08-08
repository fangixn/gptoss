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

  // Fireworks AI API for GPT-OSS models
  'gpt-oss-20b': {
    name: 'GPT-OSS-20B',
    apiUrl: 'https://api.fireworks.ai/inference/v1/chat/completions',
    timeout: 30000,
    buildHeaders: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    buildBody: (prompt: string) => ({
      model: 'accounts/fireworks/models/gpt-oss-20b',
      max_tokens: 2000,
      top_p: 1,
      top_k: 40,
      presence_penalty: 0,
      frequency_penalty: 0,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant specializing in open-source AI models and GPT-OSS technologies. Provide detailed, accurate information about AI models, their capabilities, deployment, and best practices. Help users understand technical concepts and make informed decisions about AI implementations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    }),
    parseResponse: (data: any) => {
      return data.choices?.[0]?.message?.content || 'No response received';
    }
  },

  'gpt-oss-120b': {
    name: 'GPT-OSS-120B',
    apiUrl: 'https://api.fireworks.ai/inference/v1/chat/completions',
    timeout: 45000,
    buildHeaders: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    buildBody: (prompt: string) => ({
      model: 'accounts/fireworks/models/gpt-oss-120b',
      max_tokens: 2000,
      top_p: 1,
      top_k: 40,
      presence_penalty: 0,
      frequency_penalty: 0,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant specializing in open-source AI models and GPT-OSS technologies. Provide detailed, accurate information about AI models, their capabilities, deployment, and best practices. Help users understand technical concepts and make informed decisions about AI implementations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    }),
    parseResponse: (data: any) => {
      return data.choices?.[0]?.message?.content || 'No response received';
    }
  }
};

export const AVAILABLE_MODELS = [
  { id: 'gpt-oss-120b', name: 'GPT-OSS-120B', description: 'GPT-OSS 120B - Open Source AI Model', color: 'bg-cyan-500' },
  { id: 'gpt-oss-20b', name: 'GPT-OSS-20B', description: 'GPT-OSS 20B - Open Source AI Model', color: 'bg-sky-500' }
];

// API priority configuration (for intelligent analysis functionality)
export const ANALYSIS_API_PRIORITY = ['gpt-oss-120b', 'gpt-oss-20b'];

// Performance settings
export const PERFORMANCE_SETTINGS = {
  DEFAULT_TIMEOUT: 30000,
  ANALYSIS_TIMEOUT: 45000,
  MAX_PARALLEL_REQUESTS: 3,
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000,
};