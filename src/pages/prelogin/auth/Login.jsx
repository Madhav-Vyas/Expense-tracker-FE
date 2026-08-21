import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconMail,
  IconArrowLeft,
  IconBrandGoogle,
  IconBrandGithub,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { useAppStore } from "../../../store/useAppStore";
import { loginSchema } from "../../../schemas/authSchema";
import {
  ControlledInput,
  ControlledPasswordInput,
} from "../../../components/controlled";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../../api/authAPIs";
import useAuthStore from "../../../hooks/useAuthStore";
import HisabLogo from "../../../components/HisabLogo";

function Login() {
  const { theme, toggleTheme } = useAppStore();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isDark = theme === "dark";
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data?.data?.user);
      navigate("/dashboard");
    },
  });

  const onSubmitHandler = (values) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* Background Gradient Mesh */}
      <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/10 dark:bg-violet-600/10 blur-[150px]"></div>
        <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/10 blur-[120px]"></div>
      </div>

      {/* Header Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md">
        <Link
          to="/"
          className="flex items-center group focus:outline-none cursor-pointer"
        >
          <HisabLogo size="md" />
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-xs"
            title="Toggle Theme"
          >
            {isDark ? <IconSun size={18} className="text-amber-400" /> : <IconMoon size={18} className="text-indigo-600" />}
          </button>

          <Link
            to="/"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <IconArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      {/* Login Form Container */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12">
        <div className="max-w-md mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-60 pointer-events-none"></div>

          <div className="relative border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl dark:shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Welcome Back
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Enter your credentials to access your dashboard.
              </p>
            </div>

            {loginMutation.isError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold text-center animate-fade-in">
                {loginMutation.error?.response?.data?.message ||
                  loginMutation.error?.message ||
                  "Login failed. Please check your credentials or try again."}
              </div>
            )}

            <FormProvider {...methods}>
              <form
                className="space-y-4"
                onSubmit={methods.handleSubmit(onSubmitHandler)}
              >
                {/* Email address */}
                <ControlledInput
                  name="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  icon={IconMail}
                  type="email"
                />

                {/* Password field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider block">
                      Password
                    </label>
                    <a
                      href="#forgot"
                      className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <ControlledPasswordInput
                    name="password"
                    placeholder="••••••••"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-md shadow-violet-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  {loginMutation.isPending ? "Signing in..." : "Log In"}
                </button>
              </form>
            </FormProvider>

            {/* Dividers */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Or Continue With
              </span>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-sm font-semibold cursor-pointer shadow-2xs">
                <IconBrandGoogle size={18} /> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-sm font-semibold cursor-pointer shadow-2xs">
                <IconBrandGithub size={18} /> GitHub
              </button>
            </div>

            {/* Form Footer */}
            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 font-medium">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Hisab. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Login;
