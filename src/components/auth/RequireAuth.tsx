import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }
  return <Outlet />;
}
