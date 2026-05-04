import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layouts/Layout';
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import PublicRoute from '../components/auth/PublicRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'auth',
        element: (
          <PublicRoute>
            <Auth />
          </PublicRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        index: true,
        element: <Dashboard />, // or redirect logic
      },
    ],
  },
]);

export default router;