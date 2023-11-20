import { TUser } from '@/service/types/user_type';
import { create } from 'zustand';

interface IAuthStore {
  accessToken?: string;
  user?: TUser;
  refreshToken?: string;
  openUnauthorizedModal: boolean;
  setAuth: (
    val: Partial<{
      accessToken: string;
      user: TUser;
      openUnauthorizedModal: boolean;
      refreshToken: string;
    }>,
  ) => void;
  reset: () => void;
}

const useAuthStore = create<IAuthStore>((set) => {
  const accessToken = localStorage.getItem('accessToken') ?? '';
  const refreshToken = localStorage.getItem('refreshToken') ?? '';

  return {
    accessToken,
    refreshToken,
    user: undefined,
    openUnauthorizedModal: false,
    setAuth: (val) => {
      set((state) => ({
        ...state,
        ...val,
      }));
    },
    reset: () => {
      set((state) => ({
        ...state,
        accessToken: undefined,
        user: undefined,
        openUnauthorizedModal: false,
      }));
    },
  };
});

export default useAuthStore;
