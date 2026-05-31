'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bell, AlertTriangle, Search, LogOut, Menu, X, Calendar } from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);

  // Prevent infinite loading — if session takes more than 3s, continue rendering
  useEffect(() => {
    if (status === 'loading') {
      const timer = setTimeout(() => setLoadingTimedOut(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const navigation: SidebarItem[] = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Notices & Events',
      href: '/dashboard/notices',
      icon: <Bell className="w-5 h-5" />,
    },
    {
      name: 'Complaints Hub',
      href: '/dashboard/issues',
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    {
      name: 'Lost & Found',
      href: '/dashboard/lost-found',
      icon: <Search className="w-5 h-5" />,
    },
  ];

  if (status === 'loading' && !loadingTimedOut) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <svg className="animate-spin h-8 w-8 text-cyan-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  const user = session?.user as any;

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col shrink-0 border-r border-slate-800 bg-[#0f172a]">
        <div className="flex h-16 items-center px-6 border-b border-slate-800">
          <span className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm" />
            Campus Hub
          </span>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto py-4 gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 border-l-4 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 border-l-cyan-400 text-cyan-400'
                    : 'border-l-transparent text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 font-bold text-sm shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-200 truncate">{user?.name || 'User'}</p>
              <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                user?.role === 'ADMIN'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              }`}>
                {user?.role || 'STUDENT'}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-800 hover:border-rose-500/30 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-all cursor-pointer bg-slate-900/30"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between px-8 border-b border-slate-200 bg-white shadow-sm z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:block">
            <h1 className="text-sm font-semibold text-slate-500">
              Welcome back, <span className="text-slate-800 font-bold">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 font-semibold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/40 backdrop-blur-sm">
            <div className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col p-4 animate-slide-in">
              <div className="flex h-12 items-center justify-between mb-6">
                <span className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Campus Hub
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:bg-slate-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col flex-1 gap-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 border-l-4 text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-cyan-500/10 border-l-cyan-400 text-cyan-400'
                          : 'border-l-transparent text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-auto pt-4 border-t border-slate-800 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 font-bold text-sm">
                    {user?.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200 truncate">{user?.name}</p>
                    <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/login' })}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-rose-400 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Child Pages Stream */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
