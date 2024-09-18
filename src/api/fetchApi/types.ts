import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export interface FetchApiConfig extends AxiosRequestConfig {
  retryTimes?: number;
  retryDelay?: number; // ms
  instance?: AxiosInstance;
}

export interface HandlerConfig extends AxiosRequestConfig {
  retryTimes?: number;
  retryDelay?: number; // ms
  instance: AxiosInstance;
  customErrorHandler?: <T = unknown, E = unknown>(
    e: AxiosError<E>,
    defaultHandler: (error: AxiosError<E>) => Promise<T>
  ) => Promise<T> | void;
}