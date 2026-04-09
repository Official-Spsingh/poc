import { BASE_URL } from '../constants/api';

interface RequestOptions extends RequestInit {
  data?: any;
  params?: Record<string, string>;
}

const getAuthToken = () => {
  return sessionStorage.getItem('access_token');
};

const makeRequestBase = async (endpoint: string, options: RequestOptions = {}, withAuth: boolean = false) => {
  const { data, params, headers, ...customOptions } = options;
  
  let url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const customHeaders: Record<string, string> = {
    'accept': 'application/json, text/plain, */*',
    'content-type': 'application/json',
    'device-details': 'eyJjb2xvckRlcHRoIjoiMjQiLCJoYXJkd2FyZUNvbmN1cnJlbmN5IjoiOCIsImRldmljZU1lbW9yeSI6IjgiLCJwbGF0Zm9ybSI6IkxpbnV4IHg4Nl82NCIsIm1heFRvdWNoUG9pbnRzIjoiMCJ9',
    'geo-location': '{"latitude":25.5983616,"longitude":85.0919424,"accuracy":191792.75104072498}',
    'time-zone': 'Asia/Calcutta',
    'x-lumenore-studio': 'true',
    ...(headers as Record<string, string> || {})
  };

  if (withAuth) {
    const token = getAuthToken();
    if (token) {
      customHeaders['authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...customOptions,
    headers: customHeaders,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    
    let responseData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      throw new Error((responseData && (responseData as any).message) || `HTTP Error ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error(`Request to ${endpoint} failed:`, error);
    throw error;
  }
};

export const makeRequest = {
  get: (endpoint: string, options?: RequestOptions) => makeRequestBase(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data?: any, options?: RequestOptions) => makeRequestBase(endpoint, { ...options, method: 'POST', data }),
  put: (endpoint: string, data?: any, options?: RequestOptions) => makeRequestBase(endpoint, { ...options, method: 'PUT', data }),
  delete: (endpoint: string, options?: RequestOptions) => makeRequestBase(endpoint, { ...options, method: 'DELETE' }),
  
  getAuth: (endpoint: string, options?: RequestOptions) => makeRequestBase(endpoint, { ...options, method: 'GET' }, true),
  postAuth: (endpoint: string, data?: any, options?: RequestOptions) => makeRequestBase(endpoint, { ...options, method: 'POST', data }, true),
  putAuth: (endpoint: string, data?: any, options?: RequestOptions) => makeRequestBase(endpoint, { ...options, method: 'PUT', data }, true),
  deleteAuth: (endpoint: string, options?: RequestOptions) => makeRequestBase(endpoint, { ...options, method: 'DELETE' }, true),
};
