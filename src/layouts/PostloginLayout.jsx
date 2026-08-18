import React from "react";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { DashboardFooter } from "../components/DashboardFooter";
import { Outlet } from "react-router-dom";

const PostloginLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Ambient Glows - Fixed Position */}
      <div className="fixed top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-[140px]" />
        <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/5 blur-[120px]" />
      </div>

      {/* Navbar - Fixed Position at Top */}
      <DashboardNavbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Outlet />
      </main>

      {/* Footer - Fixed Position at Bottom */}
      <DashboardFooter />
    </div>
  );
};

export default PostloginLayout;
