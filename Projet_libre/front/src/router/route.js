import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const PrivateRoute = () => {
  const user = useAuth();
  if (!user.token) return <Navigate to="/login" />;
  return <Outlet />;
};

const AdminRoute = () => {
  const user = useAuth();
  if (!user.token) return <Navigate to="/login" />;
  if (user.user?.role !== "ROLE_ADMIN") return <Navigate to="/dashboard" />;
  return <Outlet />;
};

export { PrivateRoute, AdminRoute };