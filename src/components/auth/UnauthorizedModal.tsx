import useAuthStore from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { ROUTE_LOGIN } from '@/config/routes';

interface IUnauthorizedModalProps {
  open: boolean;
}

function UnauthorizedModal(props: Partial<IUnauthorizedModalProps>) {
  const { open } = props;

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleClose = () => {
    localStorage.removeItem('accessToken');
    navigate(ROUTE_LOGIN);
    setAuth({
      openUnauthorizedModal: false,
      accessToken: undefined,
      user: undefined,
    });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unauthorized</AlertDialogTitle>
          <AlertDialogDescription>
            Your session has expired, please do re-login to access these
            content.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction type="button" onClick={handleClose}>
            Sign In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UnauthorizedModal;
