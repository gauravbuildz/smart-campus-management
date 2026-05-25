'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/Toast';
import { Search, MapPin, Calendar, User, Trash2, Inbox, PlusCircle, AlertCircle, HelpCircle } from 'lucide-react';

interface Item {
  id: string;
  itemName: string;
  description: string;
  type: string;
  status: string;
  location: string;
  createdAt: string;
  reporterId: string;
  reporter: {
    name: string;
    email: string;
  };
}

export default function LostFoundPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('FOUND'); // LOST or FOUND
  const [location, setLocation] = useState('');

  // Filtering State
  const [filterType, setFilterType] = useState('ALL'); // ALL, LOST, FOUND
  const [search, setSearch] = useState('');

  const currentUser = session?.user as any;

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch('/api/lost-found');
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !description || !location) {
      toast.error('Please fill in all fields.');
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch('/api/lost-found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName, description, type, location }),
      });

      if (!res.ok) {
        throw new Error('Failed to report item');
      }

      toast.success('Item reported successfully!');
      setItemName('');
      setDescription('');
      setLocation('');
      fetchItems();
    } catch (err) {
      toast.error('Could not report item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this item listing?')) return;

    try {
      const res = await fetch(`/api/lost-found?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete item');
      }

      toast.success('Listing removed successfully.');
      fetchItems();
    } catch (err) {
      toast.error('Could not delete listing.');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filterType === 'ALL' || item.type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lost & Found Hub</h2>
        <p className="text-slate-500 text-sm font-medium">Post things you lost or found on campus and help fellow students claim their items.</p>
      </div>

      {/* Global Gallery Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex gap-2">
          {['ALL', 'LOST', 'FOUND'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`py-2 px-4 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {t} Items
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search items by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all text-xs font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report form (Left column) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-fit space-y-4 lg:col-span-1">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-cyan-500" />
            Report an Item
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">ITEM NAME</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Blue Water Bottle"
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">REPORT TYPE</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('FOUND')}
                  className={`py-2.5 px-3 rounded-xl border font-semibold text-xs transition-all cursor-pointer ${
                    type === 'FOUND'
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Found It
                </button>
                <button
                  type="button"
                  onClick={() => setType('LOST')}
                  className={`py-2.5 px-3 rounded-xl border font-semibold text-xs transition-all cursor-pointer ${
                    type === 'LOST'
                      ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Lost It
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">LOCATION</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Science Lab B, Library"
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">DESCRIPTION</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe details like brand, color, or tags. Provide contact info if wanted..."
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-sm font-semibold text-white cursor-pointer shadow-md shadow-cyan-500/10 transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Post Item Report'}
            </button>
          </form>
        </div>

        {/* Gallery stream (Right column) */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-44 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-44 bg-slate-200 rounded-2xl animate-pulse" />
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const canDelete = currentUser?.role === 'ADMIN' || item.reporterId === currentUser?.id;
                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-48 relative group hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                          item.type === 'LOST'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200/40'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200/40'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-slate-350" />
                          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 mt-2 line-clamp-1">{item.itemName}</h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">{item.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 truncate font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-slate-350 shrink-0" />
                          Location: <span className="text-slate-700 font-bold truncate">{item.location}</span>
                        </span>
                        <span className="text-[9px] text-slate-400 flex items-center gap-1 truncate font-semibold mt-0.5">
                          <User className="w-3 h-3 text-slate-350 shrink-0" />
                          Reported by: <span className="text-slate-650 font-bold truncate">{item.reporter?.name || 'Student'}</span>
                        </span>
                      </div>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-rose-50 border border-rose-100 hover:bg-rose-500 text-rose-500 hover:text-white transition-all cursor-pointer shrink-0"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl text-slate-400 border border-slate-200/80 shadow-sm w-full">
              <Inbox className="w-12 h-12 mb-3 stroke-1 text-slate-300" />
              <p className="text-sm font-semibold">No items matched your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
