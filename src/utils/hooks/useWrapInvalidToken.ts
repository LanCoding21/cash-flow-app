import AuthService from '@/service/auth_service';
import useAuthStore from '@/store/useAuthStore';
import { useCallback } from 'react';

export default function useWrapInvalidToken(
  callback: (
    ...args: any
  ) => Promise<{ data: any; message: string; page: any }>,
) {
  const { refreshToken, setAuth } = useAuthStore();

  const wrappedCallback = useCallback(async (...args: any) => {
    try {
      const response = await callback(...args);
      return response;
    } catch (e: any) {
      if (![401, 403].includes(e.response.status)) {
        throw e;
      }

      try {
        const response = await AuthService.refreshToken({
          refreshToken: refreshToken!,
        });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        setAuth({ accessToken });
        const newResponse = await callback(...args);
        return newResponse;
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAuth({
          openUnauthorizedModal: true,
          accessToken: '',
          refreshToken: '',
        });
      }
    }
  }, []);

  return wrappedCallback;
}
