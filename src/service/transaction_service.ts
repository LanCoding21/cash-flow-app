import { getURLSearchParams, sendAndHandleRequest } from '@/utils/api';

export default class TransactionService {
  static async getSummarizeDailyTransaction(payload: any) {
    return sendAndHandleRequest(
      `/transaction/summarize/daily?${getURLSearchParams(payload)}`,
      'get',
    );
  }

  static async gets(payload: any) {
    return sendAndHandleRequest(
      `/transaction?${getURLSearchParams(payload)}`,
      'get',
    );
  }

  static async getById(id: number) {
    return sendAndHandleRequest(`/transaction/${id}`, 'get');
  }

  static async create(payload: FormData) {
    return sendAndHandleRequest('/transaction', 'post', payload);
  }

  static async update(id: number, payload: FormData) {
    return sendAndHandleRequest(`/transaction/${id}`, 'put', payload);
  }

  static async delete(id: number) {
    return sendAndHandleRequest(`/transaction/${id}`, 'delete');
  }
}
