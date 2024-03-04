import RegisterForm from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ROUTE_LOGIN } from '@/config/routes';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import AuthService from '@/service/auth_service';
import { parseErrorMessage } from '@/utils/api';

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (val: any) => {
    setLoading(true);
    try {
      await AuthService.register(val);
      toast({
        title: 'Success',
        description: 'Register success, please login to start your session',
      });
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

  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <Card className="sm:w-96">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Please fill forms below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm loading={loading} onSubmit={onSubmit} />
        </CardContent>
        <CardFooter className="justify-center">
          <p>Have an account?</p>
          <Button
            onClick={() => {
              navigate(ROUTE_LOGIN);
            }}
            variant="link"
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RegisterPage;
