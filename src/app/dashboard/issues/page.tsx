'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/Toast';
import { AlertTriangle, CheckCircle, Calendar, User, Inbox, ShieldAlert } from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  student?: {
    name: string;
    email: string;
  };
}

export default function IssuesPage() {
  const { data: session } = useSession();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('WIFI');

  const user = session?.user as any;
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchIssues();
  }, []);

  async function fetchIssues() {
    try {
      const res = await fetch('/api/issues');
      const data = await res.json();
      if (Array.isArray(data)) {
        setIssues(data);
      }
    } catch (err) {
      console.error('Failed to fetch issues:', err);
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
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category }),
      });

      if (!res.ok) {
        throw new Error('Failed to raise issue');
      }

      toast.success('Complaint raised successfully!');
      setTitle('');
      setDescription('');
      fetchIssues();
    } catch (err) {
      toast.error('Could not submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch('/api/issues', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'RESOLVED' }),
      });

      if (!res.ok) {
        throw new Error('Failed to resolve issue');
      }

      toast.success('Complaint marked as RESOLVED.');
      fetchIssues();
    } catch (err) {
      toast.error('Could not resolve complaint.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Complaints & Issues Hub</h2>
        <p className="text-slate-500 text-sm font-medium">Raise support tickets for campus amenities, hosting, Wi-Fi, or classroom maintenance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint raising form (Students Only) */}
        {!isAdmin ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-fit space-y-4 lg:col-span-1">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              File a Complaint
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">COMPLAINT TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. WiFi outage on 3rd floor"
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">CATEGORY</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all text-sm font-medium"
                >
                  <option value="WIFI">WiFi & Networks</option>
                  <option value="HOSTEL">Hostel & Amenities</option>
                  <option value="CLASSROOM">Classroom Repairs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">DETAILED DESCRIPTION</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue with exact room numbers, blocks, etc..."
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-sm font-semibold text-white cursor-pointer shadow-md shadow-cyan-500/10 transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'File Complaint'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-fit space-y-3 lg:col-span-1">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-500" />
              Admin Portal
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              As an **ADMIN**, you have access to view all tickets registered by student users across college blocks. Verify complaints and mark them as resolved after physical inspections are finished.
            </p>
          </div>
        )}

        {/* Complaints Listing */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-4">
              <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
            </div>
          ) : issues.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {issues.map((i) => (
                <div
                  key={i.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                        i.status === 'RESOLVED'
                          ? 'bg-slate-100 text-slate-500 border border-slate-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200/40'
                      }`}>
                        {i.status}
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200/60 shrink-0">
                        {i.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-slate-350" />
                        {new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">{i.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium whitespace-pre-wrap">{i.description}</p>
                    {isAdmin && i.student && (
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 pt-1 border-t border-slate-50">
                        <User className="w-3.5 h-3.5 text-slate-350" />
                        Filed by student: <span className="text-slate-650 font-bold">{i.student.name} ({i.student.email})</span>
                      </span>
                    )}
                  </div>

                  {isAdmin && i.status === 'PENDING' && (
                    <button
                      onClick={() => handleResolve(i.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-bold text-white shrink-0 cursor-pointer shadow-sm transition-all duration-150 self-end md:self-center"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl text-slate-400 border border-slate-200/80 shadow-sm w-full">
              <Inbox className="w-12 h-12 mb-3 stroke-1 text-slate-300" />
              <p className="text-sm font-semibold">No issues raised yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
