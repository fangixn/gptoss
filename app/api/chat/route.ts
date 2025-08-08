import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIGS } from '@/lib/apiConfig';

// 强制动态渲染
export const dynamic = 'force-dynamic';

// 后端配置的API Keys - 只保留GPT-OSS模型
const BACKEND_API_KEYS: Record<string, string> = {
  'gpt-oss-120b': process.env.FIREWORKS_API_KEY || '',
  'gpt-oss-20b': process.env.FIREWORKS_API_KEY || '',
};

interface ChatRequest {
  model: string;
  prompt: string;
  useBackendKey?: boolean; // 新增字段：是否使用后端配置的key
  userApiKey?: string; // 用户提供的API key（可选）
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest & { checkBackendModels?: boolean } = await request.json();
    const { model, prompt, useBackendKey = false, userApiKey, checkBackendModels } = body;

    console.log('API Request:', { model, useBackendKey, hasUserApiKey: !!userApiKey, checkBackendModels });

    // 如果只是检查后端模型配置，返回模型列表
    if (checkBackendModels) {
      const availableModels = Object.entries(BACKEND_API_KEYS)
        .filter(([_, key]) => key && key.length > 0)
        .map(([model, _]) => model);

      return NextResponse.json({
        success: true,
        backendModels: availableModels
      });
    }

    console.log('Backend API Keys:', Object.keys(BACKEND_API_KEYS).map(k => ({ [k]: !!BACKEND_API_KEYS[k] })));

    // 验证模型是否存在
    if (!API_CONFIGS[model]) {
      console.log('Invalid model:', model);
      return NextResponse.json(
        { error: 'Invalid model specified' },
        { status: 400 }
      );
    }

    const config = API_CONFIGS[model];
    
    // 决定使用哪个API Key
    let apiKey = '';
    if (useBackendKey) {
      // 使用后端配置的API Key
      apiKey = BACKEND_API_KEYS[model] || '';
      if (!apiKey) {
        return NextResponse.json(
          { error: `Backend API key not configured for model: ${model}` },
          { status: 500 }
        );
      }
    } else {
      // 使用用户提供的API Key
      apiKey = userApiKey || '';
      if (!apiKey) {
        return NextResponse.json(
          { error: 'API key is required' },
          { status: 400 }
        );
      }
    }

    // 构建请求
    const headers = config.buildHeaders(apiKey);
    const requestBody = config.buildBody(prompt);
    const url = config.getApiUrl ? config.getApiUrl(apiKey) : config.apiUrl;

    console.log('Making request to:', url);
    console.log('Request headers:', headers);
    console.log('Request body:', JSON.stringify(requestBody));

    // 调用第三方API
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(config.timeout || 30000),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
      
      return NextResponse.json(
        { error: `API request failed: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Response data:', data);
    const parsedResponse = config.parseResponse(data);

    return NextResponse.json({
      success: true,
      response: parsedResponse,
      model: model
    });

  } catch (error) {
    console.error('Chat API error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// 获取可用的后端配置模型列表
export async function GET() {
  const availableModels = Object.entries(BACKEND_API_KEYS)
    .filter(([_, key]) => key && key.length > 0)
    .map(([model, _]) => ({
      model,
      name: API_CONFIGS[model]?.name || model,
      backendConfigured: true
    }));

  return NextResponse.json({
    success: true,
    availableModels,
    totalConfigured: availableModels.length
  });
}
