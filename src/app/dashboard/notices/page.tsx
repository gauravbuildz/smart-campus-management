'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/Toast';
import { Megaphone, Trash2, Calendar, User, Inbox, PlusCircle } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
}

export default function NoticesPage() {
  const { data: session } = useSession();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('NOTICE');

  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    try {
      const res = await fetch('/api/notices');
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotices(data);
      }
    } catch (err) {
      console.error('Failed to fetch notices:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please fill in all fields.');
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category }),
      });

      if (!res.ok) {
        throw new Error('Failed to create announcement');
      }

      toast.success('Notice published successfully!');
      setTitle('');
      setDescription('');
      fetchNotices();
    } catch (err) {
      toast.error('Could not publish notice.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const res = await fetch(`/api/notices?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete');
      }

      toast.success('Notice deleted successfully.');
      fetchNotices();
    } catch (err) {
      toast.error('Could not delete notice.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notices & Events Board</h2>
        <p className="text-slate-500 text-sm font-medium">Stay informed with college announcements, seminars, and events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notice creation form for Admins */}
        {isAdmin && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-fit space-y-4 lg:col-span-1">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-cyan-500" />
              Publish Announcement
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. WiFi Maintenance Schedule"
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">CATEGORY</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('NOTICE')}
                    className={`py-2.5 px-3 rounded-xl border font-semibold text-xs transition-all cursor-pointer ${
                      category === 'NOTICE'
                        ? 'bg-cyan-500 border-cyan-500 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    General Notice
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('EVENT')}
                    className={`py-2.5 px-3 rounded-xl border font-semibold text-xs transition-all cursor-pointer ${
                      category === 'EVENT'
                        ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Campus Event
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">DESCRIPTION</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed description here..."
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-sm font-semibold text-white cursor-pointer shadow-md shadow-cyan-500/10 transition-all disabled:opacity-50"
              >
                {submitting ? 'Publishing...' : 'Publish Announcement'}
              </button>
            </form>
          </div>
        )}

        {/* Notices Board Stream */}
        <div className={`lg:col-span-${isAdmin ? '2' : '3'} space-y-4`}>
          {loading ? (
            <div className="space-y-4">
              <div className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
            </div>
          ) : notices.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative group hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                          n.category === 'EVENT'
                            ? 'bg-amber-100 text-amber-850 border border-amber-200/40'
                            : 'bg-cyan-100 text-cyan-850 border border-cyan-200/40'
                        }`}>
                          {n.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-350" />
                          {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-800 mt-2">{n.title}</h3>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-rose-50 border border-rose-100 hover:bg-rose-500 text-rose-500 hover:text-white transition-all cursor-pointer self-start"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed whitespace-pre-wrap font-medium">{n.description}</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-450 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-350" />
                      Published by: <span className="text-slate-600 font-bold">{n.author?.name || 'Admin'}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl text-slate-400 border border-slate-200/80 shadow-sm">
              <Inbox className="w-12 h-12 mb-3 stroke-1 text-slate-300" />
              <p className="text-sm font-semibold">No notices published yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
