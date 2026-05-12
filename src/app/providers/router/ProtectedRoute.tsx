import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { AppRoutes } from "@/shared/config/routes";

type Props = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to={AppRoutes.AUTH} replace />;
  }

  return children;
};
