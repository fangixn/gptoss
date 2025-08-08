'use client';

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, Calendar, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UsageLimitErrorProps {
  message: string;
  resetTime?: number;
  limits?: {
    dailyLimit: number;
    hourlyLimit: number;
    cooldownMinutes: number;
  };
  onRetry?: () => void;
  className?: string;
}

export function UsageLimitError({ 
  message, 
  resetTime, 
  limits, 
  onRetry, 
  className 
}: UsageLimitErrorProps) {
  const formatResetTime = (timestamp: number) => {
    const resetDate = new Date(timestamp);
    const now = new Date();
    const diffMs = resetDate.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return 'Ready to retry';
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    if (diffHours > 0) {
      return `Resets in ${diffHours}h ${diffMinutes}m`;
    } else if (diffMinutes > 0) {
      return `Resets in ${diffMinutes}m ${diffSeconds}s`;
    } else {
      return `Resets in ${diffSeconds}s`;
    }
  };

  const isTemporaryLimit = message.includes('wait') || message.includes('before');
  const isDailyLimit = message.includes('daily') || message.includes('Daily');
  const isHourlyLimit = message.includes('hourly') || message.includes('Hourly');

  return (
    <Card className={`border-orange-200 bg-orange-50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-orange-800 flex items-center gap-2 text-base">
          <AlertTriangle className="h-5 w-5" />
          Usage Limit Notice
          <Badge variant="outline" className="text-orange-700 border-orange-300">
            {isTemporaryLimit ? 'Cooldown' : isDailyLimit ? 'Daily Limit' : isHourlyLimit ? 'Hourly Limit' : 'Limited'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            {message}
          </AlertDescription>
        </Alert>

        {resetTime && (
          <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-100 p-3 rounded-lg">
            <Clock className="h-4 w-4" />
            <span>{formatResetTime(resetTime)}</span>
          </div>
        )}

        {limits && (
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Free Usage Rules
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Daily message limit:</span>
                <span className="font-medium">{limits.dailyLimit} messages</span>
              </div>
              <div className="flex justify-between">
                <span>Hourly message limit:</span>
                <span className="font-medium">{limits.hourlyLimit} messages</span>
              </div>
              <div className="flex justify-between">
                <span>Message interval:</span>
                <span className="font-medium">{limits.cooldownMinutes} minutes</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          )}
          
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span>💡</span>
            <span>Tip: You can use your own API key to bypass these limits</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UsageLimitError;