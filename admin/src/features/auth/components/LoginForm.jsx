import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { useState } from "react";
import { loginUser, onAuthSuccess } from "../slice/authSlice";
import { loginSchema } from "../../../validation/auth";

function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      onAuthSuccess(user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="admin@example.com"
          className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${errors.email
            ? "border-red-400 bg-red-50"
            : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${errors.password
              ? "border-red-400 bg-red-50"
              : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        id="login-submit-btn"
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
      >
        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            <LogIn size={18} />
            Sign in
          </>
        )}
      </button>
    </form>
  );
}

export default LoginForm;
