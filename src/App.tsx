import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { Toaster } from './components/ui/toaster';
import useAuthStore from './store/useAuthStore';
import AuthService from './service/auth_service';
import AppRouter from './config/routes';
import useWrapInvalidToken from './utils/hooks/useWrapInvalidToken';

function App() {
  const { accessToken, setAuth } = useAuthStore();

  const wrappedFetchUser = useWrapInvalidToken(() => AuthService.fetchMe());

  useEffect(() => {
    if (accessToken) {
      (async () => {
        const response = await wrappedFetchUser();
        setAuth({ user: response!.data.user });
      })();
    }
  }, [accessToken]);

  return (
    <>
      <RouterProvider router={AppRouter()} />
      <Toaster />
    </>
  );
}

export default App;
