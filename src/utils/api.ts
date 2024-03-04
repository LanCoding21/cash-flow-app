import axiosInstance from '@/config/axios';
import { AxiosResponse } from 'axios';

export async function sendAndHandleRequest(
  uri: string,
  method: 'post' | 'get' | 'put' | 'delete' | 'patch',
  payload: any = {},
) {
  const response: AxiosResponse = await axiosInstance.request({
    method,
    url: uri,
    data: payload,
  });

  const { data, message, page } = response.data;
  return { data, message, page };
}

export function parseErrorMessage(error: any): string {
  const errors = error?.response?.data?.errors || null;
  if (errors) {
    const keys = Object.keys(errors);
    return errors[keys[0]][0];
  }
  return error?.response?.data?.message || 'Something went wrong';
}

export function getURLSearchParams(payload: any) {
  const params = new URLSearchParams();
  const keys = Object.keys(payload);
  keys.forEach((key) => {
    const val = payload[key];
    if (Array.isArray(val)) {
      val.forEach((item) => {
        params.append(key, item);
      });
    } else {
      params.append(key, val);
    }
  });

  return params.toString();
}
