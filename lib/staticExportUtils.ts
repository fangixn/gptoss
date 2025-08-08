// 静态导出模式检测和处理工具

/**
 * 检测当前是否为静态导出模式
 * 在静态导出模式下，API路由不可用
 */
export function isStaticExport(): boolean {
  // 在构建时，DEPLOY_TARGET 环境变量会被设置
  // 在运行时，我们可以通过检查是否有服务器端功能来判断
  if (typeof window === 'undefined') {
    // 服务器端：检查环境变量
    return process.env.DEPLOY_TARGET === 'static';
  } else {
    // 客户端：检查是否能访问API路由
    // 这是一个简单的启发式检测
    return window.location.protocol === 'file:' || 
           (window.location.hostname.includes('github.io') && !window.location.pathname.includes('/api/'));
  }
}

/**
 * 获取静态导出模式下的功能限制信息
 */
export function getStaticExportLimitations() {
  return {
    chatDisabled: true,
    apiRoutesDisabled: true,
    serverFunctionsDisabled: true,
    message: '当前为静态部署模式，聊天功能不可用。请使用本地开发环境或服务器部署来体验完整功能。'
  };
}

/**
 * 检查特定功能是否在静态导出模式下可用
 */
export function isFeatureAvailable(feature: 'chat' | 'api' | 'server'): boolean {
  if (!isStaticExport()) {
    return true;
  }
  
  // 在静态导出模式下，所有服务器端功能都不可用
  return false;
}

/**
 * 为静态导出模式提供替代方案的建议
 */
export function getAlternativeSuggestions() {
  return {
    chat: {
      title: '聊天功能替代方案',
      suggestions: [
        '使用本地开发环境 (npm run dev)',
        '部署到支持服务器端渲染的平台 (Vercel, Netlify Functions)',
        '直接使用API密钥调用第三方服务'
      ]
    },
    deployment: {
      title: '推荐部署方案',
      suggestions: [
        'Vercel - 支持完整的Next.js功能',
        'Netlify - 支持函数和API路由',
        '自托管服务器 - 完全控制'
      ]
    }
  };
}