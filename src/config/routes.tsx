import { createBrowserRouter, redirect } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import useAuthStore from '@/store/useAuthStore';
import RootLayout from '@/components/layouts/RootLayout';
import MemberLayout from '@/components/layouts/MemberLayout';
import DashboardPage from '@/pages/DashboardPage';
import TransactionListPage from '@/pages/transaction/TransactionListPage';
import TransactionCreatePage from '@/pages/transaction/TransactionCreatePage';
import TransactionItemPage from '@/pages/transaction/TransactionItemPage';
import TransactionUpdatePage from '@/pages/transaction/TransactionUpdatePage';
import CategoryListPage from '@/pages/category/CategoryListPage';
import CategoryCreatePage from '@/pages/category/CategoryCreatePage';
import CategoryUpdatePage from '@/pages/category/CategoryUpdatePage';

export const ROUTE_LOGIN = '/login';
export const ROUTE_REGISTER = '/register';
export const ROUTE_DASHBOARD = '/dashboard';
export const ROUTE_TRANSACTION = '/transaction';
export const ROUTE_CATEGORY = '/category';

function AppRouter() {
  const { accessToken } = useAuthStore();

  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        {
          path: '/',
          loader: () => {
            if (!accessToken) return redirect(ROUTE_LOGIN);
            return redirect(ROUTE_DASHBOARD);
          },
        },
        {
          path: ROUTE_LOGIN,
          element: <LoginPage />,
        },
        {
          path: ROUTE_REGISTER,
          element: <RegisterPage />,
        },
        {
          element: <MemberLayout />,
          children: [
            {
              path: ROUTE_DASHBOARD,
              element: <DashboardPage />,
            },
            {
              path: ROUTE_TRANSACTION,
              element: <TransactionListPage />,
            },
            {
              path: `${ROUTE_TRANSACTION}/create`,
              element: <TransactionCreatePage />,
            },
            {
              path: `${ROUTE_TRANSACTION}/:id`,
              element: <TransactionItemPage />,
            },
            {
              path: `${ROUTE_TRANSACTION}/:id/edit`,
              element: <TransactionUpdatePage />,
            },
            {
              path: ROUTE_CATEGORY,
              element: <CategoryListPage />,
            },
            {
              path: `${ROUTE_CATEGORY}/create`,
              element: <CategoryCreatePage />,
            },
            {
              path: `${ROUTE_CATEGORY}/:id/edit`,
              element: <CategoryUpdatePage />,
            },
          ],
        },
      ],
    },
  ]);

  return router;
}

export default AppRouter;
