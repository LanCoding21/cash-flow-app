import { sendAndHandleRequest } from '@/utils/api';

export default class AuthService {
  static async register(payload: {
    email: string;
    password: string;
    fullName: string;
  }) {
    return sendAndHandleRequest('/user', 'post', payload);
  }

  static async login(payload: { password: string }) {
    return sendAndHandleRequest('/auth/session', 'post', payload);
  }

  static async refreshToken(payload: { refreshToken: string }) {
    return sendAndHandleRequest('/auth/session/refresh', 'post', payload);
  }

  static async fetchMe() {
    return sendAndHandleRequest('/user/me', 'get');
  }

  static async logout(refreshToken: string) {
    return sendAndHandleRequest('/auth/session', 'delete', { refreshToken });
  }
}
