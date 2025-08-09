// lib/api.ts

import axios, { AxiosRequestConfig } from "axios";

type QueryParams = Record<string, string | number | boolean>;

/**
 * Builds a full URL with query parameters appended.
 * @param url - The base URL (e.g., /api/users)
 * @param queryParams - Optional key-value pairs for query params
 * @returns A string URL with query parameters (e.g., /api/users?active=true)
 */
function buildUrl(url: string, queryParams?: QueryParams): string {
  if (!queryParams) return url;
  const query = new URLSearchParams(
    Object.entries(queryParams).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString();
  return `${url}?${query}`;
}

/**
 * Handles the fetch response by parsing JSON and throwing errors if not OK.
 * @param res - The fetch Response object
 * @returns Parsed JSON data of generic type T
 * @throws Error if response is not OK
 */
/**
 * Handles axios response, throwing error if not OK.
 */
function handleResponse<T>(res: { data: T }): T {
  return res.data;
}

/**
 * Fetches data from the given URL using GET method.
 * @param url - The API endpoint
 * @param queryParams - Optional query parameters to append
 * @returns The parsed JSON response of type T
 */
export async function getData<T>(
  url: string,
  queryParams?: QueryParams,
  config?: AxiosRequestConfig
): Promise<T> {
  const fullUrl = buildUrl(url, queryParams);
  const res = await axios.get<T>(fullUrl, config);
  return handleResponse<T>(res);
}

/**
 * Sends a POST request with a JSON body.
 * @param url - The API endpoint
 * @param data - The payload to send in the request body
 * @param queryParams - Optional query parameters to append
 * @returns The parsed JSON response of type TResponse
 */
export async function postData<TResponse, TBody extends object>(
  url: string,
  data: TBody,
  queryParams?: QueryParams,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const fullUrl = buildUrl(url, queryParams);
  const res = await axios.post<TResponse>(fullUrl, data, config);
  return handleResponse<TResponse>(res);
}

/**
 * Sends a PUT request to update an existing resource.
 * @param url - The API endpoint
 * @param data - The payload to send in the request body
 * @param queryParams - Optional query parameters to append
 * @returns The parsed JSON response of type TResponse
 */
export async function putData<TResponse, TBody extends object>(
  url: string,
  data: TBody,
  queryParams?: QueryParams,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const fullUrl = buildUrl(url, queryParams);
  const res = await axios.put<TResponse>(fullUrl, data, config);
  return handleResponse<TResponse>(res);
}

/**
 * Sends a PATCH request to partially update an existing resource.
 * @param url - The API endpoint
 * @param data - The payload to send in the request body
 * @param queryParams - Optional query parameters to append
 * @returns The parsed JSON response of type TResponse
 */
export async function patchData<TResponse, TBody extends object>(
  url: string,
  data: TBody,
  queryParams?: QueryParams,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const fullUrl = buildUrl(url, queryParams);
  const res = await axios.patch<TResponse>(fullUrl, data, config);
  return handleResponse<TResponse>(res);
}

/**
 * Sends a DELETE request to remove a resource.
 * @param url - The API endpoint
 * @param queryParams - Optional query parameters to append
 * @returns The parsed JSON response of type TResponse (e.g., status or message)
 */
export async function deleteData<TResponse>(
  url: string,
  queryParams?: QueryParams,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  const fullUrl = buildUrl(url, queryParams);
  const res = await axios.delete<TResponse>(fullUrl, config);
  return handleResponse<TResponse>(res);
}
