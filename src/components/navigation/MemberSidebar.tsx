import {
  ROUTE_CATEGORY,
  ROUTE_DASHBOARD,
  ROUTE_LOGIN,
  ROUTE_TRANSACTION,
} from '@/config/routes';
import clsx from 'clsx';
import { useMemo } from 'react';
import Typography from '../common/Typography';
import useAuthStore from '@/store/useAuthStore';
import { Avatar, AvatarFallback } from '../ui/avatar';
import NavItem from './NavItem';
import useWrapInvalidToken from '@/utils/hooks/useWrapInvalidToken';
import AuthService from '@/service/auth_service';
import { useToast } from '../ui/use-toast';
import { parseErrorMessage } from '@/utils/api';
import { useNavigate } from 'react-router-dom';

interface MemberSidebarProps {
  open: boolean;
}

function MemberSidebar(props: Partial<MemberSidebarProps>) {
  const { open } = props;

  const { toast } = useToast();
  const navigate = useNavigate();

  const routes = useMemo(() => {
    return [
      { title: 'Dashboard', route: ROUTE_DASHBOARD },
      { title: 'Category', route: ROUTE_CATEGORY },
      { title: 'Transaction', route: ROUTE_TRANSACTION },
    ];
  }, []);

  const { user, reset, refreshToken } = useAuthStore();

  const wrappedLogout = useWrapInvalidToken((args) => AuthService.logout(args));

  const handleLogout = async () => {
    try {
      const response = await wrappedLogout(refreshToken);
      toast({
        title: 'Success',
        description: response?.message,
      });

      reset();
      navigate(ROUTE_LOGIN);
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: parseErrorMessage(error),
      });
    }
  };

  return (
    <aside
      className={clsx(
        'bg-white h-full lg:w-72 visible fixed z-10 overflow-hidden transition-all duration-300 shadow-md',
        [open && 'w-72'],
        [!open && 'w-0'],
      )}
    >
      <div className="flex justify-center items-center py-10 border-b border-b-gray-100">
        <Typography variant="h4" className="text-primary font-bold ml-2">
          CASH-FLOW TRACKER
        </Typography>
      </div>

      <div className="flex pl-6 items-center py-6">
        <Avatar>
          <AvatarFallback>{user?.fullName[0] ?? '-'}</AvatarFallback>
        </Avatar>
        <Typography className="ml-2 font-medium">
          {user?.fullName ?? '...'}
        </Typography>
      </div>

      <ul>
        {routes.map((item) => (
          <li key={item.route} className="flex items-center relative py-4 px-6">
            <NavItem title={item.title} route={item.route} />
          </li>
        ))}
        <li>
          <div
            className="flex items-center py-4 px-6 cursor-pointer"
            onClick={handleLogout}
          >
            <Typography variant="small" className={clsx('ml-2 font-normal')}>
              Logout
            </Typography>
          </div>
        </li>
      </ul>
    </aside>
  );
}

export default MemberSidebar;
