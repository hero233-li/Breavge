import { Environment, ApiRecord } from '../types';

// In a real app, these would be real domains
const BASE_URLS: Record<Environment, string> = {
  DEV: 'https://api-dev.finance-debug.internal/v1',
  TEST: 'https://api-test.finance-debug.internal/v1',
  PROD: 'https://api-prod.finance-debug.internal/v1',
};

class ApiService {
  private currentEnv: Environment = 'DEV';

  setEnvironment(env: Environment) {
    this.currentEnv = env;
    console.log(`[API] Environment switched to ${env}: ${BASE_URLS[env]}`);
  }

  getEnvironment(): Environment {
    return this.currentEnv;
  }

  getBaseUrl(): string {
    return BASE_URLS[this.currentEnv];
  }

  /**
   * Mock execution of a financial process.
   * In a real app, this would use fetch/axios to call the actual backend.
   */
  async executeProcess(endpoint: string, method: string, data: any): Promise<ApiRecord> {
    const startTime = Date.now();
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1000));

    const isSuccess = Math.random() > 0.1; // 10% chance of failure for demo
    const endTime = Date.now();

    // Mock Response Generation
    const mockResponse = isSuccess
      ? { code: 200, message: 'Process executed successfully', transactionId: `TXN-${Date.now()}`, data: { ...data, processedAt: new Date().toISOString() } }
      : { code: 500, message: 'Internal System Error: Downstream service timeout', errorId: `ERR-${Date.now()}` };

    return {
      id: crypto.randomUUID(),
      status: isSuccess ? 'SUCCESS' : 'ERROR',
      timestamp: new Date().toISOString(),
      summary: isSuccess ? 'Transaction Completed' : 'Transaction Failed',
      requestPayload: data,
      responsePayload: mockResponse,
      environment: this.currentEnv,
      latencyMs: endTime - startTime,
    };
  }
}

export const apiService = new ApiService();
