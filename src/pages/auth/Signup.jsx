import React from "react";
import { Link } from "react-router-dom";
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
import { useAppStore } from "../../store/useAppStore";
import { signupSchema } from "../../schemas/authSchema";
import {
  ControlledInput,
  ControlledPasswordInput,
} from "../../components/controlled";
import useAuthStore from "../../hooks/useAuthStore";
import { signup } from "../../api/authAPIs";

function Signup() {
  const { theme, toggleTheme } = useAppStore();
  const setToken = useAuthStore((state) => state.setToken);
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
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const { isError, isPending, isSuccess } = signupMutation;
  const onSubmitHandler = (values) => {
    signupMutation.mutate(values);
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-950"}`}
    >
      {/* Background Gradient Mesh */}
      <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[150px]"></div>
        <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]"></div>
      </div>

      {/* Header Bar */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-500/10">
        <Link
          to="/"
          className="flex items-center gap-2 group focus:outline-none"
        >
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            FinFlow
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-500/10 hover:bg-slate-500/5 transition-all text-slate-400 hover:text-slate-100"
            title="Toggle Theme"
          >
            {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>

          <Link
            to="/"
            className="text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <IconArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      {/* Signup Form Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-md mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/25 to-cyan-500/20 rounded-3xl blur-2xl opacity-60 pointer-events-none"></div>

          <div className="relative border border-slate-800 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-white">
                Create your Account
              </h2>
              <p className="text-slate-400 text-sm">
                Join FinFlow and take charge of your budget today.
              </p>
            </div>

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
                  className="w-full mt-4 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </FormProvider>

            {/* Dividers */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-slate-900 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Or Register With
              </span>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-all text-sm font-semibold cursor-pointer">
                <IconBrandGoogle size={18} /> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-all text-sm font-semibold cursor-pointer">
                <IconBrandGithub size={18} /> GitHub
              </button>
            </div>

            {/* Form Footer */}
            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-800">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-violet-400 hover:text-violet-300 hover:underline"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-500/10 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>© 2026 FinFlow Expense Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Signup;
