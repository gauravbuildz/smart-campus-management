'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Search, Megaphone, AlertCircle, HelpCircle, MapPin, Calendar, ArrowRight, Inbox } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

interface Issue {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
}

interface LostItem {
  id: string;
  itemName: string;
  type: string;
  location: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [noticesRes, issuesRes, lostRes] = await Promise.all([
          fetch('/api/notices'),
          fetch('/api/issues'),
          fetch('/api/lost-found'),
        ]);

        const [noticesData, issuesData, lostData] = await Promise.all([
          noticesRes.json(),
          issuesRes.json(),
          lostRes.json(),
        ]);

        if (Array.isArray(noticesData)) setNotices(noticesData);
        if (Array.isArray(issuesData)) setIssues(issuesData);
        if (Array.isArray(lostData)) setLostItems(lostData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingIssuesCount = issues.filter((i) => i.status === 'PENDING').length;
  const unresolvedLostCount = lostItems.filter((l) => l.status === 'REPORTED').length;

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-200 rounded-2xl" />
          <div className="h-32 bg-slate-200 rounded-2xl" />
          <div className="h-32 bg-slate-200 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-slate-200 rounded-2xl" />
          <div className="h-96 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Search and Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-500 text-sm font-medium">Get real-time updates and view latest campus activities.</p>
        </div>
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search notices & events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Analytics/Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-cyan-500/10 group-hover:text-cyan-500/20 transition-all duration-300">
            <Megaphone className="w-20 h-20" />
          </div>
          <p className="text-sm font-semibold text-slate-500">Notices & Events</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{notices.length}</p>
          <Link href="/dashboard/notices" className="text-cyan-600 hover:text-cyan-500 text-xs font-bold mt-4 inline-flex items-center gap-1 transition-all">
            View notice board <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-rose-500/10 group-hover:text-rose-500/20 transition-all duration-300">
            <AlertCircle className="w-20 h-20" />
          </div>
          <p className="text-sm font-semibold text-slate-500">Pending Complaints</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{pendingIssuesCount}</p>
          <Link href="/dashboard/issues" className="text-rose-600 hover:text-rose-500 text-xs font-bold mt-4 inline-flex items-center gap-1 transition-all">
            Raise or check issues <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-emerald-500/10 group-hover:text-emerald-500/20 transition-all duration-300">
            <HelpCircle className="w-20 h-20" />
          </div>
          <p className="text-sm font-semibold text-slate-500">Active Lost & Found</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{unresolvedLostCount}</p>
          <Link href="/dashboard/lost-found" className="text-emerald-600 hover:text-emerald-500 text-xs font-bold mt-4 inline-flex items-center gap-1 transition-all">
            Browse items gallery <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Notices Stream + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notices Board Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-[480px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
              Latest Announcements
            </h3>
            <Link href="/dashboard/notices" className="text-xs text-cyan-600 hover:underline font-bold">
              View All
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((n) => (
                <div key={n.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-cyan-500/20 hover:bg-white transition-all duration-200">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{n.title}</h4>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                      n.category === 'EVENT'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200/40'
                        : 'bg-cyan-100 text-cyan-800 border border-cyan-200/40'
                    }`}>
                      {n.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">{n.description}</p>
                  <span className="text-[10px] text-slate-400 mt-3 flex items-center gap-1 font-semibold">
                    <Calendar className="w-3 h-3 text-slate-350" />
                    {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Inbox className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
                <p className="text-sm font-semibold">No announcements found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Lost & Found Stream */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-[480px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              Lost & Found Feed
            </h3>
            <Link href="/dashboard/lost-found" className="text-xs text-emerald-600 hover:underline font-bold">
              Browse Gallery
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {lostItems.length > 0 ? (
              lostItems.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-4 hover:border-emerald-500/20 hover:bg-white transition-all duration-200">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    item.type === 'LOST'
                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                      : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {item.type === 'LOST' ? (
                      <HelpCircle className="w-5 h-5 shrink-0" />
                    ) : (
                      <Search className="w-5 h-5 shrink-0" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{item.itemName}</h4>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                        item.status === 'RESOLVED'
                          ? 'bg-slate-200 text-slate-600'
                          : item.type === 'LOST'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200/40'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200/40'
                      }`}>
                        {item.status === 'RESOLVED' ? 'CLAIMED' : item.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      Location: <span className="text-slate-700 font-bold">{item.location}</span>
                    </p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-semibold">
                      📅 Reported {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Inbox className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
                <p className="text-sm font-semibold">No items reported recently</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
