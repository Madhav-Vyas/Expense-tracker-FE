import React from "react";
import { DashboardNavbar } from "../../../components/DashboardNavbar";
import { DashboardFooter } from "../../../components/DashboardFooter";
import { useAppStore } from "../../../store/useAppStore";

const Dashboard = () => {
  const { theme } = useAppStore();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-950"}`}
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px]"></div>
        <div className="absolute -top-40 right-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]"></div>
      </div>

      {/* Render the Navbar at the top */}
      <DashboardNavbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-6 py-10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm">
            Welcome to your Expense Tracker Dashboard.
          </p>
        </div>
      </main>

      {/* Render the Footer at the bottom */}
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
