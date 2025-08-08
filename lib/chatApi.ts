// Chat API 调用工具函数

interface ChatApiRequest {
  model: string;
  prompt: string;
  useBackendKey?: boolean;
  userApiKey?: string;
}

interface ChatApiResponse {
  success: boolean;
  response?: string;
  model?: string;
  error?: string;
}

/**
 * 调用聊天API - 支持后端代理和前端直调两种模式
 */
export async function callChatApi({
  model,
  prompt,
  useBackendKey = false,
  userApiKey
}: ChatApiRequest): Promise<ChatApiResponse> {
  try {
    if (useBackendKey) {
      // 使用后端代理模式
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          useBackendKey: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: data.success,
        response: data.response,
        model: data.model
      };
    } else {
      // 使用前端直调模式（现有逻辑）
      if (!userApiKey) {
        throw new Error('API key is required for direct API calls');
      }

      // 这里保持原有的前端直调逻辑
      // 从 API_CONFIGS 导入配置
      const { API_CONFIGS } = await import('@/lib/apiConfig');
      const config = API_CONFIGS[model];
      
      if (!config) {
        throw new Error(`Invalid model: ${model}`);
      }

      const headers = config.buildHeaders(userApiKey);
      const body = config.buildBody(prompt);
      const url = config.getApiUrl ? config.getApiUrl(userApiKey) : config.apiUrl;

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(config.timeout || 30000),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const parsedResponse = config.parseResponse(data);

      return {
        success: true,
        response: parsedResponse,
        model
      };
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * 检查哪些模型在后端已配置
 */
export async function getBackendConfiguredModels(): Promise<{
  success: boolean;
  availableModels?: Array<{
    model: string;
    name: string;
    backendConfigured: boolean;
  }>;
  totalConfigured?: number;
  error?: string;
}> {
  try {
    const response = await fetch('/api/chat', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch backend models: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching backend models:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
