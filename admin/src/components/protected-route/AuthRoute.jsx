import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, authKeys } from "../../features/auth/slice/authSlice";
import Loader from "../loader/Loader";

function AuthRoute() {
  const { data: user, isPending } = useQuery({
    queryKey: authKeys.me,
    queryFn: getCurrentUser,
    retry: false,
  });

  if (isPending) return <Loader />;

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default AuthRoute;
