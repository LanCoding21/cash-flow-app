import LoginForm from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ROUTE_DASHBOARD, ROUTE_REGISTER } from '@/config/routes';
import AuthService from '@/service/auth_service';
import useAuthStore from '@/store/useAuthStore';
import { parseErrorMessage } from '@/utils/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (val: any) => {
    setLoading(true);
    try {
      const response = await AuthService.login(val);
      const { data } = response;

      const { accessToken, refreshToken } = data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setAuth({ accessToken, refreshToken });
      toast({
        title: 'Success!',
        description: 'Login success',
      });

      navigate(ROUTE_DASHBOARD);
    } catch (error) {
      toast({
        title: 'Error!',
        description: parseErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <Card className="sm:w-96">
        <CardHeader>
          <CardTitle>LogIn</CardTitle>
          <CardDescription>Please login to start your session</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSubmit={onSubmit} loading={loading} />
        </CardContent>
        <CardFooter className="justify-center">
          <p>Not registered?</p>
          <Button
            onClick={() => {
              navigate(ROUTE_REGISTER);
            }}
            variant="link"
          >
            Register
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;
