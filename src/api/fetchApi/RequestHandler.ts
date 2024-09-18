import { AxiosError } from 'axios';
import type { HandlerConfig } from './types';

export class RequestHandler {
  private retryCount: number = 0;
  private config: HandlerConfig;

  constructor(config: HandlerConfig) {
    this.config = {
      baseURL: '',
      retryDelay: 0,
      retryTimes: 0,
      ...config
    };
  }

  async run<T>(): Promise<T> {
    try {
      const { data } = await this.config.instance.request(this.config);
      return data;
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }

  private async handleError<T>(error: AxiosError): Promise<T> {
    if (this.shouldRetry(error)) {
      return this.retry<T>();
    }

    if (this.config.customErrorHandler) {
      const customResult = await this.config.customErrorHandler<T>(
        error, 
        (e) => this.defaultErrorHandler<T>(e)
      );
      if (customResult !== undefined) return customResult as T;
    }
  
    return this.defaultErrorHandler<T>(error);
  }

  private shouldRetry(error: AxiosError): boolean {
    return (this.retryCount < this.config.retryTimes!) && 
           (!error.response || error.response.status >= 500);
  }

  private async retry<T>(): Promise<T> {
    this.retryCount++;
    await this.delay(this.getRetryDelay());
    return this.run<T>();
  }

  private async defaultErrorHandler<T>(e: AxiosError): Promise<T> {
    const httpStatus = e?.response?.status;

    // no retry for 4xx error, which is correct server response
    if (httpStatus && httpStatus >= 400) throw e;

    // meet retryTimes, throw error.
    if (this.retryCount >= this.config.retryTimes!) throw e;

    this.retryCount += 1;

    await this.delay(this.getRetryDelay());
    return this.run<T>();
  }

  private getRetryDelay(): number {
    if (typeof this.config.retryDelay === 'number') return this.config.retryDelay;
    // delay based on tried times
    const n = 3 ** (this.retryCount + 1) + Math.random();
    return Math.round(n * 1000);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}