import axios, { AxiosError } from 'axios';
import { request } from './request';
import type { FetchApiConfig, HandlerConfig } from './types';
import { API_BASE_URL } from '../../config';

const customErrorHandler: HandlerConfig['customErrorHandler'] = (
  e,
  doDefaultHandling,
) => {
  return doDefaultHandling(e);
};

export async function fetchApi<T = any>(config: FetchApiConfig): Promise<T> {

  const handlerConfig: HandlerConfig = {
    ...config,
    baseURL: API_BASE_URL,
    instance: config.instance || axios.create(),
    customErrorHandler,
  };

  return request<T>(handlerConfig).catch((e: AxiosError) => {
    throw e;
  });
}

export default fetchApi;
