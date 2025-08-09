import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIGS } from '@/lib/apiConfig';

// Usage limit configuration
const USAGE_LIMITS = {
  // Anonymous user limits
  ANONYMOUS_MESSAGES_PER_DAY: 3,     // Anonymous user daily message limit
  ANONYMOUS_MESSAGES_PER_HOUR: 2,    // Anonymous user hourly message limit
  ANONYMOUS_COOLDOWN_MINUTES: 3,     // Anonymous user cooldown time between messages (minutes)
  
  // Authenticated user limits (more generous)
  AUTHENTICATED_MESSAGES_PER_DAY: 7,   // Authenticated user daily message limit
  AUTHENTICATED_MESSAGES_PER_HOUR: 3,  // Authenticated user hourly message limit
  AUTHENTICATED_COOLDOWN_MINUTES: 0.5,    // Authenticated user cooldown time between messages (minutes)
};

// In-memory storage for user usage records (Redis or database recommended for production)
const userUsageMap = new Map<string, {
  dailyCount: number;
  hourlyCount: number;
  lastResetDaily: number;
  lastResetHourly: number;
  lastMessageTime: number;
}>();

// Get client identifier (simple hash of IP + User-Agent)
function getClientId(request: NextRequest): string {
  const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  // Simple hash function
  const hash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString();
  };
  return hash(ip + userAgent);
}

// Check user usage limits
function checkUsageLimit(clientId: string, isAuthenticated: boolean = false): { allowed: boolean; reason?: string; resetTime?: number } {
  const now = Date.now();
  const today = new Date().toDateString();
  const currentHour = new Date().getHours();
  
  // Select limit parameters based on authentication status
  const dailyLimit = isAuthenticated ? USAGE_LIMITS.AUTHENTICATED_MESSAGES_PER_DAY : USAGE_LIMITS.ANONYMOUS_MESSAGES_PER_DAY;
  const hourlyLimit = isAuthenticated ? USAGE_LIMITS.AUTHENTICATED_MESSAGES_PER_HOUR : USAGE_LIMITS.ANONYMOUS_MESSAGES_PER_HOUR;
  const cooldownMinutes = isAuthenticated ? USAGE_LIMITS.AUTHENTICATED_COOLDOWN_MINUTES : USAGE_LIMITS.ANONYMOUS_COOLDOWN_MINUTES;
  
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
  
  // Reset daily count
  const lastResetDate = new Date(usage.lastResetDaily).toDateString();
  if (lastResetDate !== today) {
    usage.dailyCount = 0;
    usage.lastResetDaily = now;
  }
  
  // Reset hourly count
  const lastResetHour = new Date(usage.lastResetHourly).getHours();
  if (lastResetHour !== currentHour) {
    usage.hourlyCount = 0;
    usage.lastResetHourly = now;
  }
  
  // Check cooldown time
  const timeSinceLastMessage = now - usage.lastMessageTime;
  const cooldownMs = cooldownMinutes * 60 * 1000;
  if (timeSinceLastMessage < cooldownMs) {
    const remainingCooldown = Math.ceil((cooldownMs - timeSinceLastMessage) / 1000);
    const userType = isAuthenticated ? 'Authenticated user' : 'Anonymous user';
    return {
      allowed: false,
      reason: `${userType}: Please wait ${remainingCooldown} seconds before sending another message`,
    };
  }
  
  // Check daily limit
  if (usage.dailyCount >= dailyLimit) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const userType = isAuthenticated ? 'Authenticated user' : 'Anonymous user';
    return {
      allowed: false,
      reason: `${userType}: Daily quota exhausted (${dailyLimit} messages), resets at midnight`,
      resetTime: tomorrow.getTime(),
    };
  }
  
  // Check hourly limit
  if (usage.hourlyCount >= hourlyLimit) {
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    const userType = isAuthenticated ? 'Authenticated user' : 'Anonymous user';
    return {
      allowed: false,
      reason: `${userType}: Hourly quota exhausted (${hourlyLimit} messages), resets next hour`,
      resetTime: nextHour.getTime(),
    };
  }
  
  return { allowed: true };
}

// Update user usage records
function updateUsageCount(clientId: string) {
  const usage = userUsageMap.get(clientId);
  if (usage) {
    usage.dailyCount++;
    usage.hourlyCount++;
    usage.lastMessageTime = Date.now();
  }
}

// Decide whether to use dynamic rendering based on deployment environment
// Cannot use force-dynamic when static exporting
export const dynamic = process.env.DEPLOY_TARGET === 'static' ? 'auto' : 'force-dynamic';

// Backend configured API Keys - only keep GPT-OSS models
const BACKEND_API_KEYS: Record<string, string> = {
  'gpt-oss-120b': process.env.FIREWORKS_API_KEY || '',
  'gpt-oss-20b': process.env.FIREWORKS_API_KEY || '',
};

interface ChatRequest {
  model: string;
  prompt: string;
  useBackendKey?: boolean; // New field: whether to use backend configured key
  userApiKey?: string; // User provided API key (optional)
  isAuthenticated?: boolean; // New field: whether user is authenticated
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest & { checkBackendModels?: boolean } = await request.json();
    const { model, prompt, useBackendKey = false, userApiKey, checkBackendModels, isAuthenticated = false } = body;

    console.log('API Request:', { model, useBackendKey, hasUserApiKey: !!userApiKey, checkBackendModels, isAuthenticated });

    // Get client identifier
    const clientId = getClientId(request);
    
    // If not checking backend models, check usage limits
    if (!checkBackendModels) {
      const limitCheck = checkUsageLimit(clientId, isAuthenticated);
      if (!limitCheck.allowed) {
        // Return corresponding limit information based on authentication status
        const dailyLimit = isAuthenticated ? USAGE_LIMITS.AUTHENTICATED_MESSAGES_PER_DAY : USAGE_LIMITS.ANONYMOUS_MESSAGES_PER_DAY;
        const hourlyLimit = isAuthenticated ? USAGE_LIMITS.AUTHENTICATED_MESSAGES_PER_HOUR : USAGE_LIMITS.ANONYMOUS_MESSAGES_PER_HOUR;
        const cooldownMinutes = isAuthenticated ? USAGE_LIMITS.AUTHENTICATED_COOLDOWN_MINUTES : USAGE_LIMITS.ANONYMOUS_COOLDOWN_MINUTES;
        
        return NextResponse.json(
          { 
            error: 'Usage limit exceeded', 
            message: limitCheck.reason,
            resetTime: limitCheck.resetTime,
            limits: {
              dailyLimit,
              hourlyLimit,
              cooldownMinutes
            }
          },
          { status: 429 }
        );
      }
    }

    // If only checking backend model configuration, return model list
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

    // Validate if model exists
    if (!API_CONFIGS[model]) {
      console.log('Invalid model:', model);
      return NextResponse.json(
        { error: 'Invalid model specified' },
        { status: 400 }
      );
    }

    const config = API_CONFIGS[model];
    
    // Decide which API Key to use
    let apiKey = '';
    if (useBackendKey) {
      // Use backend configured API Key
      apiKey = BACKEND_API_KEYS[model] || '';
      if (!apiKey) {
        return NextResponse.json(
          { error: `Backend API key not configured for model: ${model}` },
          { status: 500 }
        );
      }
    } else {
      // Use user provided API Key
      apiKey = userApiKey || '';
      if (!apiKey) {
        return NextResponse.json(
          { error: 'API key is required' },
          { status: 400 }
        );
      }
    }

    // Build request
    const headers = config.buildHeaders(apiKey);
    const requestBody = config.buildBody(prompt);
    const url = config.getApiUrl ? config.getApiUrl(apiKey) : config.apiUrl;

    console.log('Making request to:', url);
    console.log('Request headers:', headers);
    console.log('Request body:', JSON.stringify(requestBody));

    // Call third-party API
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

    // Update user usage count
    updateUsageCount(clientId);
    
    // Get current user remaining quota information
    const usage = userUsageMap.get(clientId);
    const dailyLimit = isAuthenticated ? USAGE_LIMITS.AUTHENTICATED_MESSAGES_PER_DAY : USAGE_LIMITS.ANONYMOUS_MESSAGES_PER_DAY;
    const hourlyLimit = isAuthenticated ? USAGE_LIMITS.AUTHENTICATED_MESSAGES_PER_HOUR : USAGE_LIMITS.ANONYMOUS_MESSAGES_PER_HOUR;
    const cooldownMinutes = isAuthenticated ? USAGE_LIMITS.AUTHENTICATED_COOLDOWN_MINUTES : USAGE_LIMITS.ANONYMOUS_COOLDOWN_MINUTES;
    const remainingDaily = Math.max(0, dailyLimit - (usage?.dailyCount || 0));
    const remainingHourly = Math.max(0, hourlyLimit - (usage?.hourlyCount || 0));

    return NextResponse.json({
      success: true,
      response: parsedResponse,
      model: model,
      usage: {
        remainingDaily,
        remainingHourly,
        dailyLimit,
        hourlyLimit,
        cooldownMinutes
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

// Get available backend configured model list and user usage status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  // If requesting user usage status
  if (action === 'usage') {
    const clientId = getClientId(request);
    const isAuthenticated = searchParams.get('isAuthenticated') === 'true';
    const usage = userUsageMap.get(clientId);
    
    const now = Date.now();
    const today = new Date().toDateString();
    const currentHour = new Date().getHours();
    
    let dailyCount = 0;
    let hourlyCount = 0;
    let lastMessageTime = 0;
    
    if (usage) {
      // Check if counts need to be reset
      const lastResetDate = new Date(usage.lastResetDaily).toDateString();
      const lastResetHour = new Date(usage.lastResetHourly).getHours();
      
      dailyCount = lastResetDate === today ? usage.dailyCount : 0;
      hourlyCount = lastResetHour === currentHour ? usage.hourlyCount : 0;
      lastMessageTime = usage.lastMessageTime;
    }
    
    // Select corresponding limits based on authentication status
    const dailyLimit = isAuthenticated ? USAGE_LIMITS.AUTHENTICATED_MESSAGES_PER_DAY : USAGE_LIMITS.ANONYMOUS_MESSAGES_PER_DAY;
    const hourlyLimit = isAuthenticated ? USAGE_LIMITS.AUTHENTICATED_MESSAGES_PER_HOUR : USAGE_LIMITS.ANONYMOUS_MESSAGES_PER_HOUR;
    const cooldownMinutes = isAuthenticated ? USAGE_LIMITS.AUTHENTICATED_COOLDOWN_MINUTES : USAGE_LIMITS.ANONYMOUS_COOLDOWN_MINUTES;
    
    const remainingDaily = Math.max(0, dailyLimit - dailyCount);
    const remainingHourly = Math.max(0, hourlyLimit - hourlyCount);
    
    // Calculate cooldown time
    const timeSinceLastMessage = now - lastMessageTime;
    const cooldownMs = cooldownMinutes * 60 * 1000;
    const remainingCooldown = Math.max(0, Math.ceil((cooldownMs - timeSinceLastMessage) / 1000));
    
    return NextResponse.json({
      success: true,
      usage: {
        dailyUsed: dailyCount,
        hourlyUsed: hourlyCount,
        remainingDaily,
        remainingHourly,
        dailyLimit,
        hourlyLimit,
        cooldownMinutes,
        remainingCooldown,
        canSendMessage: remainingDaily > 0 && remainingHourly > 0 && remainingCooldown === 0
      }
    });
  }
  
  // Default return available model list
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
