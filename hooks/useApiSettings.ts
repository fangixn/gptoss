import { useState, useEffect } from 'react';
import { getBackendConfiguredModels } from '@/lib/chatApi';

interface ApiSettings {
  [key: string]: string;
}

const API_SETTINGS_KEY = 'econai_api_settings';

export function useApiSettings() {
  const [apiSettings, setApiSettings] = useState<ApiSettings>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [backendModels, setBackendModels] = useState<string[]>([]);

  // Load API settings and backend models
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load local API settings
        const savedSettings = localStorage.getItem(API_SETTINGS_KEY);
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setApiSettings(parsedSettings);
          console.log('API settings loaded:', Object.keys(parsedSettings).length, 'models configured');
        } else {
          console.log('No saved API settings found');
        }

        // Load backend configured models
        const backendResult = await getBackendConfiguredModels();
        if (backendResult.success && backendResult.availableModels) {
          const modelKeys = backendResult.availableModels.map(m => m.model);
          setBackendModels(modelKeys);
          console.log('Backend models loaded:', modelKeys.length, 'models available');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // If JSON parsing fails, clear corrupted data
        localStorage.removeItem(API_SETTINGS_KEY);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  // Save API settings
  const saveApiSettings = (newSettings: ApiSettings) => {
    try {
      localStorage.setItem(API_SETTINGS_KEY, JSON.stringify(newSettings));
      setApiSettings(newSettings);
      console.log('API settings saved:', Object.keys(newSettings).length, 'models configured');
      return true;
    } catch (error) {
      console.error('Error saving API settings:', error);
      return false;
    }
  };

  // Update single API setting
  const updateApiSetting = (modelKey: string, apiKey: string) => {
    const newSettings = {
      ...apiSettings,
      [modelKey]: apiKey
    };
    return saveApiSettings(newSettings);
  };

  // Delete API setting
  const removeApiSetting = (modelKey: string) => {
    const newSettings = { ...apiSettings };
    delete newSettings[modelKey];
    return saveApiSettings(newSettings);
  };

  // Clear all API settings
  const clearAllApiSettings = () => {
    try {
      localStorage.removeItem(API_SETTINGS_KEY);
      setApiSettings({});
      console.log('All API settings cleared');
      return true;
    } catch (error) {
      console.error('Error clearing API settings:', error);
      return false;
    }
  };

  // Check if API setting exists (including backend models)
  const hasApiKey = (modelKey: string) => {
    // Check if model is configured in backend
    if (backendModels.includes(modelKey)) {
      return true;
    }
    // Check if user has configured API key locally
    return !!apiSettings[modelKey];
  };

  // Get API key (returns 'backend' for backend models)
  const getApiKey = (modelKey: string) => {
    // If model is configured in backend, return special indicator
    if (backendModels.includes(modelKey)) {
      return 'backend';
    }
    // Return user's API key
    return apiSettings[modelKey] || '';
  };

  // Get count of configured models (including backend models)
  const getConfiguredModelsCount = () => {
    const localCount = Object.keys(apiSettings).filter(key => apiSettings[key]).length;
    return localCount + backendModels.length;
  };

  // Check if model is configured in backend
  const isBackendModel = (modelKey: string) => {
    return backendModels.includes(modelKey);
  };

  return {
    apiSettings,
    isLoaded,
    backendModels,
    saveApiSettings,
    updateApiSetting,
    removeApiSetting,
    clearAllApiSettings,
    hasApiKey,
    getApiKey,
    getConfiguredModelsCount,
    isBackendModel
  };
}