import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchApi } from '../../api/fetchApi';
import { API_BASE_URL } from '../../config';

describe('fetchApi', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('network error retry', async () => {
    mock.onGet(`${API_BASE_URL}/network-error`).networkError();

    await expect(
      fetchApi({
        url: '/network-error',
        retryDelay: 0,
        retryTimes: 2,
      })
    ).rejects.toThrow();

    expect(mock.history.get.length).toBe(3);
  });

  it('5xx error retry', async () => {
    let callCount = 0;
    mock.onGet(`${API_BASE_URL}/500-error`).reply(() => {
      callCount++;
      console.log(`API called ${callCount} times`);
      return [500];
    });

    await expect(
      fetchApi({
        url: '/500-error',
        retryDelay: 0,
        retryTimes: 2,
      })
    ).rejects.toThrow();

    console.log(`Total API calls: ${callCount}`);
    console.log(`Mock history length: ${mock.history.get.length}`);

    expect(callCount).toBe(3); // We expect 3 calls: 1 initial + 2 retries
    expect(mock.history.get.length).toBe(3);
  });

  it('5xx error no retry by default', async () => {
    mock.onGet(`${API_BASE_URL}/500-error`).reply(500);

    await expect(
      fetchApi({
        url: '/500-error',
        retryDelay: 0,
      })
    ).rejects.toThrow();

    expect(mock.history.get.length).toBe(1);
  });

  it('4xx error no retry', async () => {
    mock.onGet(`${API_BASE_URL}/400-error`).reply(400);

    await expect(
      fetchApi({
        url: '/400-error',
        retryDelay: 0,
        retryTimes: 2,
      })
    ).rejects.toThrow();

    expect(mock.history.get.length).toBe(1);
  });

  it('successful request', async () => {
    const mockData = { data: [{ id: 1, name: 'Test' }] };
    mock.onGet(`${API_BASE_URL}/data`).reply(200, mockData);

    const result = await fetchApi({
      url: '/data',
    });

    expect(result).toEqual(mockData);
    expect(mock.history.get.length).toBe(1);
  });
});