'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageCircle, Calendar, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UsageData {
  dailyUsed: number;
  hourlyUsed: number;
  remainingDaily: number;
  remainingHourly: number;
  dailyLimit: number;
  hourlyLimit: number;
  cooldownMinutes: number;
  remainingCooldown: number;
  canSendMessage: boolean;
}

interface UsageLimitIndicatorProps {
  onUsageUpdate?: (canSend: boolean) => void;
  className?: string;
}

export function UsageLimitIndicator({ onUsageUpdate, className }: UsageLimitIndicatorProps) {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsageData = async () => {
    try {
      const response = await fetch('/api/chat?action=usage');
      if (!response.ok) {
        throw new Error('Failed to fetch usage data');
      }
      const data = await response.json();
      if (data.success) {
        setUsageData(data.usage);
        onUsageUpdate?.(data.usage.canSendMessage);
        setError(null);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageData();
    
    // Update usage status every 30 seconds
    const interval = setInterval(fetchUsageData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // If there's cooldown time, update every second
  useEffect(() => {
    if (usageData?.remainingCooldown && usageData.remainingCooldown > 0) {
      const interval = setInterval(fetchUsageData, 1000);
      return () => clearInterval(interval);
    }
  }, [usageData?.remainingCooldown]);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Unable to fetch usage status: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!usageData) return null;

  const dailyProgress = Math.min(100, Math.max(0, (usageData.dailyUsed / usageData.dailyLimit) * 100 || 0));
  const hourlyProgress = Math.min(100, Math.max(0, (usageData.hourlyUsed / usageData.hourlyLimit) * 100 || 0));

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Free Usage Quota
          {!usageData.canSendMessage && (
            <Badge variant="destructive" className="text-xs">
              Limited
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cooldown reminder */}
        {usageData.remainingCooldown > 0 && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Please wait {formatTime(usageData.remainingCooldown)} before sending another message
            </AlertDescription>
          </Alert>
        )}

        {/* Daily limit */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Daily Quota</span>
            </div>
            <span className="font-medium">
              {usageData.remainingDaily}/{usageData.dailyLimit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all" 
              style={{ width: `${dailyProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Hourly limit */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Hourly Quota</span>
            </div>
            <span className="font-medium">
              {usageData.remainingHourly}/{usageData.hourlyLimit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all" 
              style={{ width: `${hourlyProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Usage rules description */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>• Maximum {usageData.dailyLimit} messages per day</div>
          <div>• Maximum {usageData.hourlyLimit} messages per hour</div>
          <div>• {usageData.cooldownMinutes} minute interval between messages</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UsageLimitIndicator;