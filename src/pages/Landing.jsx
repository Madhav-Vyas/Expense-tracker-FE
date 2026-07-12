import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  IconActivity, 
  IconTrendingUp, 
  IconWallet, 
  IconServer, 
  IconDatabase, 
  IconMoon, 
  IconSun, 
  IconArrowRight, 
  IconCheck, 
  IconX, 
  IconChartPie,
  IconShield,
  IconArrowUpRight,
  IconArrowDownLeft
} from '@tabler/icons-react';
import { useAppStore } from '../store/useAppStore';

function Landing() {
  const { backendStatus, setBackendStatus, theme, toggleTheme } = useAppStore();

  // Query to fetch backend health status
  const { data, status } = useQuery({
    queryKey: ['backendStatus'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/status');
      if (!response.ok) {
        throw new Error('Backend failed');
      }
      return response.json();
    },
    refetchInterval: 5000,
  });

  // Sync query data to Zustand state
  useEffect(() => {
    if (status === 'success' && data) {
      setBackendStatus({
        connected: true,
        checkedAt: new Date().toLocaleTimeString(),
        details: data,
      });
    } else if (status === 'error') {
      setBackendStatus({
        connected: false,
        checkedAt: new Date().toLocaleTimeString(),
        details: null,
      });
    }
  }, [data, status, setBackendStatus]);

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-950'}`}>
      
      {/* Background Gradient Mesh */}
      <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[150px]"></div>
        <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]"></div>
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-500/10">
        <Link to="/" className="flex items-center gap-2 group focus:outline-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-600/20 group-hover:scale-105 transition-transform">
            <IconTrendingUp size={22} className="stroke-[2.5]" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            FinFlow
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-violet-400 transition-colors">Features</a>
          <a href="#connection-status" className="hover:text-violet-400 transition-colors flex items-center gap-1.5">
            Backend Status 
            <span className={`w-2 h-2 rounded-full ${backendStatus.connected ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-500/10 hover:bg-slate-500/5 transition-all text-slate-400 hover:text-slate-100"
            title="Toggle Theme"
          >
            {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>
          
          <Link 
            to="/login"
            className="hidden sm:inline-block text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link 
            to="/signup"
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-white/5"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 space-y-28">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-xs font-semibold tracking-wide">
              <IconActivity size={14} /> Next-Gen Finance Tracker
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Master Your Money.{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Effortlessly.
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Track expenses, set dynamic budgets, and scale your personal wealth with intuitive, real-time analytics powered by our robust full-stack infrastructure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/signup"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Get Started Free <IconArrowRight size={18} />
              </Link>
              <a 
                href="#connection-status"
                className="px-6 py-3.5 rounded-xl border border-slate-500/20 hover:bg-slate-500/5 text-slate-300 font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Check Integration Status
              </a>
            </div>

            {/* Tech Badges */}
            <div className="pt-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Our Core Stack</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {['ReactJS', 'TanStack Query', 'Zustand', 'Tailwind CSS', 'Express', 'Mongoose'].map((tech) => (
                  <span key={tech} className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-400 font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Right: Mockup Dashboard */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-60 pointer-events-none"></div>
            
            <div className="relative border border-slate-800 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-xs font-semibold text-slate-500">FinFlow Dashboard Mockup</span>
                <span className="w-4"></span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex justify-between items-start text-slate-400 mb-2">
                    <span className="text-xs font-medium">Total Balance</span>
                    <IconWallet size={16} className="text-cyan-400" />
                  </div>
                  <div className="text-xl font-bold text-white">$14,250.80</div>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5 mt-1">
                    <IconArrowUpRight size={10} /> +12.5% this month
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex justify-between items-start text-slate-400 mb-2">
                    <span className="text-xs font-medium">Monthly Expenses</span>
                    <IconChartPie size={16} className="text-violet-400" />
                  </div>
                  <div className="text-xl font-bold text-white">$3,124.50</div>
                  <span className="text-[10px] text-rose-400 font-medium flex items-center gap-0.5 mt-1">
                    <IconArrowDownLeft size={10} /> -4.2% from budget
                  </span>
                </div>
              </div>

              {/* Simulated Budget Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Food & Dining Budget</span>
                  <span className="text-slate-300 font-semibold">$380 / $500</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-400">Recent Activity</div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <IconArrowDownLeft size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Grocery Supermarket</div>
                      <div className="text-[10px] text-slate-500">Today, 2:40 PM • Card</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-white">-$84.20</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <IconArrowUpRight size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Salary Paycheck</div>
                      <div className="text-[10px] text-slate-500">Yesterday, 9:00 AM • Direct</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-emerald-400">+$4,800.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Integration Panel */}
        <section id="connection-status" className="border border-slate-800 bg-slate-900/50 backdrop-blur-md rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                <IconServer size={12} /> Live API Status Checker
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Front-End & Back-End Connectivity</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                This page dynamically polls the Express backend using TanStack Query to verify connection and database availability.
              </p>
            </div>

            <div className="md:col-span-5">
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">Backend Integration</span>
                  <span className="text-[10px] text-slate-500">Checked: {backendStatus.checkedAt || 'Never'}</span>
                </div>

                {backendStatus.connected ? (
                  <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <IconCheck size={12} className="stroke-[3]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Express Server Online</div>
                      <p className="text-[10px] text-emerald-500/80 mt-0.5">
                        {backendStatus.details?.message || 'Server successfully reached'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-300 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                      <IconX size={12} className="stroke-[3]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Express Server Offline</div>
                      <p className="text-[10px] text-rose-300/80 mt-0.5">
                        Could not connect to `http://localhost:5000`. Run backend using `npm run dev`.
                      </p>
                    </div>
                  </div>
                )}

                {backendStatus.connected && (
                  <div className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                    backendStatus.details?.database?.status === 'Connected'
                      ? 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400'
                      : 'border-amber-500/20 bg-amber-500/5 text-amber-300'
                  }`}>
                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      <IconDatabase size={12} />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Database: {backendStatus.details?.database?.status || 'Unknown'}</div>
                      <p className="text-[10px] opacity-80 mt-0.5">
                        DB Name: <code className="bg-slate-900 px-1 py-0.5 rounded text-[9px]">{backendStatus.details?.database?.name || 'N/A'}</code>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-white">Full-Stack Features Included</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Everything you need to develop robust personal finance tools is pre-wired and structured.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 hover:border-violet-500/30 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-violet-600/10 text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <IconWallet size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zustand State Store</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Global state management is initialized and synced, providing simple hooks to access UI status and user settings.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 hover:border-cyan-500/30 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-cyan-600/10 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <IconChartPie size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">TanStack Queries</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Network requests, loading states, and automatic cache updates are fully configured out-of-the-box.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-emerald-600/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <IconShield size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Tailwind CSS</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Styling systems preloaded with utility classes and modern layout controls.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-500/10 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>© 2026 FinFlow Expense Tracker. All rights reserved.</p>
        <p className="mt-1.5 font-medium">
          Built with React, Express, Mongoose, Tailwind, and TanStack Query.
        </p>
      </footer>

    </div>
  );
}

export default Landing;
