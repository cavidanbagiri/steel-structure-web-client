import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layouts/Layout';

import ProtectedRoute from '../components/auth/ProtectedRoute';
import PublicRoute from '../components/auth/PublicRoute';

import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import Combine from '../pages/Combine';
import Main from '../pages/Main';
import Transport from '../pages/Transport';
import Erected from '../pages/Erected'


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
        path: '/home',
        element: (
          <ProtectedRoute>
            <Combine />
          </ProtectedRoute>
        ),
      },
      {
        path: 'main',
        element: (
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transport',
        element: (
          <ProtectedRoute>
            <Transport />
          </ProtectedRoute>
        ),
      },
      {
        path: 'erected',
        element: (
          <ProtectedRoute>
            <Erected />
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