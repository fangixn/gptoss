# 用户使用限制功能指南

## 功能概述

为了防止用户过度使用免费的AI聊天服务，我们实现了一套完整的使用限制系统。该系统包括：

- **每日限制**: 每天最多10条消息
- **每小时限制**: 每小时最多5条消息  
- **冷却时间**: 消息间隔至少2分钟
- **智能识别**: 基于IP地址和浏览器指纹识别用户

## 功能特点

### 1. 多层限制机制
- **日限制**: 防止单个用户每天发送过多消息
- **时限制**: 防止短时间内大量请求
- **冷却机制**: 确保用户不会连续发送消息

### 2. 用户友好的界面
- **使用状态指示器**: 实时显示剩余额度
- **友好错误提示**: 清晰说明限制原因和重置时间
- **进度条显示**: 直观展示使用情况

### 3. 灵活的配置
```typescript
const USAGE_LIMITS = {
  FREE_MESSAGES_PER_DAY: 10,    // 每天免费消息数量
  FREE_MESSAGES_PER_HOUR: 5,   // 每小时免费消息数量
  COOLDOWN_MINUTES: 2,         // 消息间隔冷却时间（分钟）
};
```

## 技术实现

### 1. 后端API限制 (`/app/api/chat/route.ts`)
- 客户端识别：基于IP和User-Agent生成唯一标识
- 内存存储：使用Map存储用户使用记录
- 自动重置：按时间自动重置计数
- 错误响应：返回429状态码和详细限制信息

### 2. 前端组件

#### UsageLimitIndicator 组件
- 实时显示用户使用状态
- 自动更新剩余额度
- 冷却时间倒计时

#### UsageLimitError 组件
- 友好的错误提示界面
- 重置时间显示
- 使用规则说明

### 3. 客户端API (`/lib/chatApi.ts`)
- 特殊处理429错误
- 返回详细的限制信息
- 支持使用状态查询

## 使用方法

### 1. 用户体验流程
1. 用户访问网站开始聊天
2. 系统显示当前使用状态
3. 用户发送消息，系统更新计数
4. 达到限制时显示友好提示
5. 用户可以等待重置或使用自己的API密钥

### 2. 管理员配置
可以通过修改 `USAGE_LIMITS` 常量来调整限制参数：

```typescript
// 更严格的限制
const USAGE_LIMITS = {
  FREE_MESSAGES_PER_DAY: 5,
  FREE_MESSAGES_PER_HOUR: 2,
  COOLDOWN_MINUTES: 5,
};

// 更宽松的限制
const USAGE_LIMITS = {
  FREE_MESSAGES_PER_DAY: 20,
  FREE_MESSAGES_PER_HOUR: 10,
  COOLDOWN_MINUTES: 1,
};
```

## API接口

### 1. 聊天API
```
POST /api/chat
```

**请求体**:
```json
{
  "model": "gpt-oss-120b",
  "prompt": "用户消息",
  "useBackendKey": true
}
```

**成功响应**:
```json
{
  "success": true,
  "response": "AI回复",
  "model": "gpt-oss-120b",
  "usage": {
    "remainingDaily": 9,
    "remainingHourly": 4,
    "dailyLimit": 10,
    "hourlyLimit": 5,
    "cooldownMinutes": 2
  }
}
```

**限制错误响应** (429):
```json
{
  "error": "Usage limit exceeded",
  "message": "今日免费额度已用完（10条），明日0点重置",
  "resetTime": 1640995200000,
  "limits": {
    "dailyLimit": 10,
    "hourlyLimit": 5,
    "cooldownMinutes": 2
  }
}
```

### 2. 使用状态查询API
```
GET /api/chat?action=usage
```

**响应**:
```json
{
  "success": true,
  "usage": {
    "dailyUsed": 3,
    "hourlyUsed": 1,
    "remainingDaily": 7,
    "remainingHourly": 4,
    "dailyLimit": 10,
    "hourlyLimit": 5,
    "cooldownMinutes": 2,
    "remainingCooldown": 0,
    "canSendMessage": true
  }
}
```

## 生产环境建议

### 1. 数据持久化
当前实现使用内存存储，生产环境建议使用：
- Redis：高性能缓存
- 数据库：持久化存储
- 分布式缓存：多服务器部署

### 2. 安全增强
- IP白名单：允许特定IP绕过限制
- 用户认证：注册用户更高额度
- 反爬虫：检测和阻止自动化请求

### 3. 监控和分析
- 使用统计：分析用户使用模式
- 异常检测：识别异常使用行为
- 性能监控：监控API响应时间

## 故障排除

### 1. 常见问题
- **限制过于严格**: 调整 `USAGE_LIMITS` 参数
- **用户投诉**: 提供清晰的使用规则说明
- **绕过限制**: 加强客户端识别机制

### 2. 调试方法
- 查看浏览器控制台日志
- 检查API响应状态码
- 验证客户端标识符生成

## 总结

这套使用限制系统提供了：
- ✅ 有效的滥用防护
- ✅ 友好的用户体验
- ✅ 灵活的配置选项
- ✅ 完整的错误处理
- ✅ 实时状态显示

通过合理的限制策略，既保护了服务资源，又为用户提供了良好的使用体验。