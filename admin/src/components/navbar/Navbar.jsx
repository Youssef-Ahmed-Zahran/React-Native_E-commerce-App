import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bell, LogOut, Menu, User } from "lucide-react";
import {
  authKeys,
  getCurrentUser,
  logoutUser,
  onLogoutSuccess,
} from "../../features/auth/slice/authSlice";

function Navbar({ onToggle }) {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: authKeys.me,
    queryFn: getCurrentUser,
    retry: false,
  });

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      onLogoutSuccess();
      navigate("/login");
    },
  });

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Left – sidebar toggle (all screen sizes) + brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            id="navbar-menu-btn"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <Link
            to="/dashboard"
            className="text-lg font-bold text-indigo-600 tracking-tight"
          >
            AdminPanel
          </Link>
        </div>

        {/* Right – actions */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <button
            id="navbar-notifications-btn"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-gray-600" />
          </button>

          {/* User avatar */}
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-150">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <User size={16} className="text-indigo-600" />
              </div>
            )}
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {user?.name ?? "Admin"}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={() => logout()}
            disabled={isPending}
            id="navbar-logout-btn"
            className="ml-2 p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
            aria-label="Logout"
          >
            <LogOut size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
