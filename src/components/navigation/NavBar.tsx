import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import useAuthStore from '@/store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTE_DASHBOARD, ROUTE_LOGIN } from '@/config/routes';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import useWrapInvalidToken from '@/utils/hooks/useWrapInvalidToken';
import AuthService from '@/service/auth_service';
import { parseErrorMessage } from '@/utils/api';
import { useToast } from '../ui/use-toast';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface INavBarProps {
  onHamburgerMenuClick: () => void;
}

function NavBar(props: INavBarProps) {
  const { onHamburgerMenuClick } = props;
  const { user, reset, refreshToken } = useAuthStore();

  const wrappedLogout = useWrapInvalidToken((args) => AuthService.logout(args));

  const { toast } = useToast();
  const navigate = useNavigate();

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
    <nav className="fixed top-0 z-50 w-full bg-primary-500 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <Button
              variant="ghost"
              className="lg:hidden text-white hover:bg-transparent hover:text-white"
              onClick={onHamburgerMenuClick}
            >
              <HamburgerMenuIcon />
            </Button>
            <Link to={ROUTE_DASHBOARD}>
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white">
                CF - Tracker
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <Popover>
                <PopoverTrigger>
                  <Avatar>
                    <AvatarFallback>{user?.fullName[0] ?? '-'}</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 p-0">
                  <div className="px-4 py-3" role="none">
                    <p
                      className="text-sm text-gray-900 dark:text-white"
                      role="none"
                    >
                      {user?.fullName}
                    </p>
                    <p
                      className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                      role="none"
                    >
                      {user?.email}
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white text-left"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
