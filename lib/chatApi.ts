// Chat API utility functions
import { isStaticExport, getStaticExportLimitations } from './staticExportUtils';

interface ChatApiRequest {
  model: string;
  prompt: string;
  useBackendKey?: boolean;
  userApiKey?: string;
  isAuthenticated?: boolean;
}

interface UsageInfo {
  remainingDaily: number;
  remainingHourly: number;
  dailyLimit: number;
  hourlyLimit: number;
  cooldownMinutes: number;
}

interface ChatApiResponse {
  success: boolean;
  response?: string;
  model?: string;
  error?: string;
  message?: string;
  resetTime?: number;
  limits?: {
    dailyLimit: number;
    hourlyLimit: number;
    cooldownMinutes: number;
  };
  usage?: UsageInfo;
}

interface UsageStatusResponse {
  success: boolean;
  usage?: {
    dailyUsed: number;
    hourlyUsed: number;
    remainingDaily: number;
    remainingHourly: number;
    dailyLimit: number;
    hourlyLimit: number;
    cooldownMinutes: number;
    remainingCooldown: number;
    canSendMessage: boolean;
  };
  error?: string;
}

/**
 * Call chat API - supports both backend proxy and frontend direct call modes
 */
export async function callChatApi({
  model,
  prompt,
  useBackendKey = false,
  userApiKey,
  isAuthenticated = false
}: ChatApiRequest): Promise<ChatApiResponse> {
  try {
    // Check if in static export mode
    if (isStaticExport() && useBackendKey) {
      const limitations = getStaticExportLimitations();
      return {
        success: false,
        error: limitations.message
      };
    }

    if (useBackendKey) {
      // Use backend proxy mode
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          useBackendKey: true,
          isAuthenticated
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Special handling for usage limit errors (429 status code)
        if (response.status === 429) {
          return {
            success: false,
            error: errorData.error || 'Usage limit exceeded',
            message: errorData.message,
            resetTime: errorData.resetTime,
            limits: errorData.limits
          };
        }
        
        throw new Error(errorData.error || `API request failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: data.success,
        response: data.response,
        model: data.model,
        usage: data.usage
      };
    } else {
      // Use frontend direct call mode (existing logic)
      if (!userApiKey) {
        throw new Error('API key is required for direct API calls');
      }

      // Keep original frontend direct call logic here
      // Import configuration from API_CONFIGS
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
 * Get user's current usage status
 */
export async function getUserUsageStatus(isAuthenticated: boolean = false): Promise<UsageStatusResponse> {
  try {
    // Check if in static export mode
    if (isStaticExport()) {
      return {
        success: true,
        usage: {
          dailyUsed: 0,
          hourlyUsed: 0,
          remainingDaily: 10,
          remainingHourly: 5,
          dailyLimit: 10,
          hourlyLimit: 5,
          cooldownMinutes: 2,
          remainingCooldown: 0,
          canSendMessage: true
        }
      };
    }

    const response = await fetch(`/api/chat?action=usage&isAuthenticated=${isAuthenticated}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch usage status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching usage status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Check which models are configured on the backend
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
    // Check if in static export mode
    if (isStaticExport()) {
      return {
        success: true,
        availableModels: [],
        totalConfigured: 0
      };
    }

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
