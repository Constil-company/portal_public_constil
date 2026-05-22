/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  children: ReactNode;
}

export function UnauthenticatedRoute({ children }: Props) {
  // @ts-ignore
  const { token } = useSelector((state) => state.auth);

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
