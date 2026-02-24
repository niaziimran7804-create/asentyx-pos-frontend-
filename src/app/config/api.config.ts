/**
 * API Configuration
 * 
 * Loads configuration from JSON file at runtime
 */

interface ApiConfig {
  baseUrl: string;
  production?: {
    baseUrl: string;
  };
  development?: {
    baseUrl: string;
  };
}

class ApiConfigService {
  private config: ApiConfig | null = null;
  
  async loadConfig(): Promise<void> {
    if (this.config) return;
    
    try {
      const response = await fetch('/assets/config/api-config.json');
      const config = await response.json() as ApiConfig;
      
      // Determine environment and set appropriate baseUrl
      const isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
      
      if (isDevelopment && config.development) {
        this.config = { baseUrl: config.development.baseUrl };
      } else if (!isDevelopment && config.production) {
        this.config = { baseUrl: config.production.baseUrl };
      } else {
        this.config = { baseUrl: config.baseUrl };
      }
    } catch (error) {
      console.error('Failed to load API config, using fallback:', error);
      // Fallback configuration
      this.config = { baseUrl: '/api' };
    }
  }
  
  getBaseUrl(): string {
    if (!this.config) {
      console.warn('API config not loaded yet, using fallback');
      return '/api';
    }
    return this.config.baseUrl;
  }
}

const apiConfigService = new ApiConfigService();

export const API_CONFIG = {
  get baseUrl(): string {
    return apiConfigService.getBaseUrl();
  },
  
  async initialize(): Promise<void> {
    await apiConfigService.loadConfig();
  }
};
