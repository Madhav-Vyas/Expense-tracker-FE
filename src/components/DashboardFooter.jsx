import React from 'react';

export function DashboardFooter() {
  return (
    <footer className="relative z-10 border-t border-slate-500/10 bg-slate-950/40 py-6 text-center text-xs text-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 FinFlow App. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-slate-300">Privacy Policy</a>
          <a href="#terms" className="hover:text-slate-300">Terms of Use</a>
          <a href="#support" className="hover:text-slate-300">Help Center</a>
        </div>
      </div>
    </footer>
  );
}
