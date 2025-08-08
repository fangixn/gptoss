import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIGS } from '@/lib/apiConfig';

// 使用限制配置
const USAGE_LIMITS = {
  FREE_MESSAGES_PER_DAY: 2,     // 每天免费消息数量
  FREE_MESSAGES_PER_HOUR: 2,    // 每小时免费消息数量
  COOLDOWN_MINUTES: 5,          // 消息间隔冷却时间（分钟）
};

// 内存存储用户使用记录（生产环境建议使用Redis或数据库）
const userUsageMap = new Map<string, {
  dailyCount: number;
  hourlyCount: number;
  lastResetDaily: number;
  lastResetHourly: number;
  lastMessageTime: number;
}>();

// 获取客户端标识符（IP + User-Agent的简单hash）
function getClientId(request: NextRequest): string {
  const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  // 简单的hash函数
  const hash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString();
  };
  return hash(ip + userAgent);
}

// 检查用户使用限制
function checkUsageLimit(clientId: string): { allowed: boolean; reason?: string; resetTime?: number } {
  const now = Date.now();
  const today = new Date().toDateString();
  const currentHour = new Date().getHours();
  
  let usage = userUsageMap.get(clientId);
  
  if (!usage) {
    usage = {
      dailyCount: 0,
      hourlyCount: 0,
      lastResetDaily: now,
      lastResetHourly: now,
      lastMessageTime: 0,
    };
    userUsageMap.set(clientId, usage);
  }
  
  // 重置每日计数
  const lastResetDate = new Date(usage.lastResetDaily).toDateString();
  if (lastResetDate !== today) {
    usage.dailyCount = 0;
    usage.lastResetDaily = now;
  }
  
  // 重置每小时计数
  const lastResetHour = new Date(usage.lastResetHourly).getHours();
  if (lastResetHour !== currentHour) {
    usage.hourlyCount = 0;
    usage.lastResetHourly = now;
  }
  
  // 检查冷却时间
  const timeSinceLastMessage = now - usage.lastMessageTime;
  const cooldownMs = USAGE_LIMITS.COOLDOWN_MINUTES * 60 * 1000;
  if (timeSinceLastMessage < cooldownMs) {
    const remainingCooldown = Math.ceil((cooldownMs - timeSinceLastMessage) / 1000);
    return {
      allowed: false,
      reason: `请等待 ${remainingCooldown} 秒后再发送消息`,
    };
  }
  
  // 检查每日限制
  if (usage.dailyCount >= USAGE_LIMITS.FREE_MESSAGES_PER_DAY) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return {
      allowed: false,
      reason: `今日免费额度已用完（${USAGE_LIMITS.FREE_MESSAGES_PER_DAY}条），明日0点重置`,
      resetTime: tomorrow.getTime(),
    };
  }
  
  // 检查每小时限制
  if (usage.hourlyCount >= USAGE_LIMITS.FREE_MESSAGES_PER_HOUR) {
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    return {
      allowed: false,
      reason: `本小时免费额度已用完（${USAGE_LIMITS.FREE_MESSAGES_PER_HOUR}条），下小时重置`,
      resetTime: nextHour.getTime(),
    };
  }
  
  return { allowed: true };
}

// 更新用户使用记录
function updateUsageCount(clientId: string) {
  const usage = userUsageMap.get(clientId);
  if (usage) {
    usage.dailyCount++;
    usage.hourlyCount++;
    usage.lastMessageTime = Date.now();
  }
}

// 根据部署环境决定是否使用动态渲染
// 静态导出时不能使用 force-dynamic
export const dynamic = process.env.DEPLOY_TARGET === 'static' ? 'auto' : 'force-dynamic';

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

    // 获取客户端标识符
    const clientId = getClientId(request);
    
    // 如果不是检查后端模型，则检查使用限制
    if (!checkBackendModels) {
      const limitCheck = checkUsageLimit(clientId);
      if (!limitCheck.allowed) {
        return NextResponse.json(
          { 
            error: 'Usage limit exceeded', 
            message: limitCheck.reason,
            resetTime: limitCheck.resetTime,
            limits: {
              dailyLimit: USAGE_LIMITS.FREE_MESSAGES_PER_DAY,
              hourlyLimit: USAGE_LIMITS.FREE_MESSAGES_PER_HOUR,
              cooldownMinutes: USAGE_LIMITS.COOLDOWN_MINUTES
            }
          },
          { status: 429 }
        );
      }
    }

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

    // 更新用户使用计数
    updateUsageCount(clientId);
    
    // 获取当前用户剩余额度信息
    const usage = userUsageMap.get(clientId);
    const remainingDaily = Math.max(0, USAGE_LIMITS.FREE_MESSAGES_PER_DAY - (usage?.dailyCount || 0));
    const remainingHourly = Math.max(0, USAGE_LIMITS.FREE_MESSAGES_PER_HOUR - (usage?.hourlyCount || 0));

    return NextResponse.json({
      success: true,
      response: parsedResponse,
      model: model,
      usage: {
        remainingDaily,
        remainingHourly,
        dailyLimit: USAGE_LIMITS.FREE_MESSAGES_PER_DAY,
        hourlyLimit: USAGE_LIMITS.FREE_MESSAGES_PER_HOUR,
        cooldownMinutes: USAGE_LIMITS.COOLDOWN_MINUTES
      }
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

// 获取可用的后端配置模型列表和用户使用状态
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  // 如果请求用户使用状态
  if (action === 'usage') {
    const clientId = getClientId(request);
    const usage = userUsageMap.get(clientId);
    
    const now = Date.now();
    const today = new Date().toDateString();
    const currentHour = new Date().getHours();
    
    let dailyCount = 0;
    let hourlyCount = 0;
    let lastMessageTime = 0;
    
    if (usage) {
      // 检查是否需要重置计数
      const lastResetDate = new Date(usage.lastResetDaily).toDateString();
      const lastResetHour = new Date(usage.lastResetHourly).getHours();
      
      dailyCount = lastResetDate === today ? usage.dailyCount : 0;
      hourlyCount = lastResetHour === currentHour ? usage.hourlyCount : 0;
      lastMessageTime = usage.lastMessageTime;
    }
    
    const remainingDaily = Math.max(0, USAGE_LIMITS.FREE_MESSAGES_PER_DAY - dailyCount);
    const remainingHourly = Math.max(0, USAGE_LIMITS.FREE_MESSAGES_PER_HOUR - hourlyCount);
    
    // 计算冷却时间
    const timeSinceLastMessage = now - lastMessageTime;
    const cooldownMs = USAGE_LIMITS.COOLDOWN_MINUTES * 60 * 1000;
    const remainingCooldown = Math.max(0, Math.ceil((cooldownMs - timeSinceLastMessage) / 1000));
    
    return NextResponse.json({
      success: true,
      usage: {
        dailyUsed: dailyCount,
        hourlyUsed: hourlyCount,
        remainingDaily,
        remainingHourly,
        dailyLimit: USAGE_LIMITS.FREE_MESSAGES_PER_DAY,
        hourlyLimit: USAGE_LIMITS.FREE_MESSAGES_PER_HOUR,
        cooldownMinutes: USAGE_LIMITS.COOLDOWN_MINUTES,
        remainingCooldown,
        canSendMessage: remainingDaily > 0 && remainingHourly > 0 && remainingCooldown === 0
      }
    });
  }
  
  // 默认返回可用模型列表
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
