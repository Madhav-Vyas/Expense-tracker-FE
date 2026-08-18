import React from "react";

export function DashboardFooter() {
  return (
    <footer className="relative z-10 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/40 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 Hisab. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Use</a>
          <a href="#support" className="hover:text-slate-900 dark:hover:text-white transition-colors">Help Center</a>
        </div>
      </div>
    </footer>
  );
}

export default DashboardFooter;
