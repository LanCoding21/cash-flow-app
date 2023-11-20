import { getURLSearchParams, sendAndHandleRequest } from '@/utils/api';

export default class CategoryService {
  static async gets(payload: any) {
    return sendAndHandleRequest(
      `/category?${getURLSearchParams(payload)}`,
      'get',
    );
  }

  static async create(payload: any) {
    return sendAndHandleRequest('/category', 'post', payload);
  }

  static async getItem(id: number) {
    return sendAndHandleRequest(`/category/${id}`, 'get');
  }

  static async update(id: number, payload: any) {
    return sendAndHandleRequest(`/category/${id}`, 'put', payload);
  }

  static async delete(id: number) {
    return sendAndHandleRequest(`/category/${id}`, 'delete');
  }
}
