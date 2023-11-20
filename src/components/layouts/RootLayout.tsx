import UnauthorizedModal from '@/components/auth/UnauthorizedModal';
import useAuthStore from '@/store/useAuthStore';
import { Outlet } from 'react-router-dom';

function RootLayout() {
  const { openUnauthorizedModal } = useAuthStore();
  return (
    <>
      <UnauthorizedModal open={openUnauthorizedModal} />
      <Outlet />
    </>
  );
}

export default RootLayout;
