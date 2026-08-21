import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconMail,
  IconUser,
  IconArrowLeft,
  IconBrandGoogle,
  IconBrandGithub,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { useAppStore } from "../../../store/useAppStore";
import { signupSchema } from "../../../schemas/authSchema";
import {
  ControlledInput,
  ControlledPasswordInput,
} from "../../../components/controlled";
import useAuthStore from "../../../hooks/useAuthStore";
import { signup } from "../../../api/authAPIs";
import HisabLogo from "../../../components/HisabLogo";

function Signup() {
  const { theme, toggleTheme } = useAppStore();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      setToken(response.token);
      setUser(response?.data?.user);
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Signup failed:", error);
    },
  });

  const { isPending } = signupMutation;
  const onSubmitHandler = (values) => {
    signupMutation.mutate(values);
  };

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 font-sans relative overflow-hidden transition-colors duration-200">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-0"></div>

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

      {/* Signup Form Container */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12">
        <div className="max-w-md mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-60 pointer-events-none"></div>

          <div className="relative border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl dark:shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Create your Account
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Get started with your personal finance dashboard.
              </p>
            </div>

            {signupMutation.isError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold text-center animate-fade-in">
                {signupMutation.error?.response?.data?.message ||
                  signupMutation.error?.message ||
                  "Signup failed. Please check your information or try again."}
              </div>
            )}

            <FormProvider {...methods}>
              <form
                className="space-y-4"
                onSubmit={methods.handleSubmit(onSubmitHandler)}
              >
                {/* Name */}
                <ControlledInput
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                  icon={IconUser}
                />

                {/* Email */}
                <ControlledInput
                  name="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  icon={IconMail}
                  type="email"
                />

                {/* Password */}
                <ControlledPasswordInput
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                />

                {/* Confirm Password */}
                <ControlledPasswordInput
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="••••••••"
                />

                {/* Submit button */}
                <button
                  disabled={isPending}
                  type="submit"
                  className="w-full mt-4 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-md shadow-violet-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </FormProvider>

            {/* Dividers */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Or Register With
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
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Hisab. Smart Khata & Analytics. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Signup;
