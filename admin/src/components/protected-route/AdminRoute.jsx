import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, authKeys } from "../../features/auth/slice/authSlice";
import Loader from "../loader/Loader";

function AdminRoute() {
  const { data: user, isPending } = useQuery({
    queryKey: authKeys.me,
    queryFn: getCurrentUser,
    retry: false,
  });

  if (isPending) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  return user.role === "admin" ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

export default AdminRoute;
