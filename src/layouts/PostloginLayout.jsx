import { DashboardNavbar } from "../components/DashboardNavbar";
import { DashboardFooter } from "../components/DashboardFooter";
import { Outlet } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

const PostloginLayout = () => {
  const { theme } = useAppStore();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-950"}`}
    >
      {/* Background Glow - Fixed Position */}
      <div className="fixed top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px]"></div>
        <div className="absolute -top-40 right-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]"></div>
      </div>

      {/* Navbar - Fixed Position at Top */}
      <DashboardNavbar />

      {/* Main Content Area - Relative Positioning */}
      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-6 py-10">
        <Outlet />
      </main>

      {/* Footer - Fixed Position at Bottom */}
      <DashboardFooter />
    </div>
  );
};

export default PostloginLayout;
