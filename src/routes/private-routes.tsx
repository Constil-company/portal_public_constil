/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface PrivateRouteProps {
  children?: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  // @ts-ignore
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}
