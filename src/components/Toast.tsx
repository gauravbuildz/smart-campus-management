'use client';

import React, { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: Array<(msg: ToastMessage) => void> = [];

export const toast = {
  success: (msg: string) => {
    toastListeners.forEach((l) => l({ id: Math.random().toString(), message: msg, type: 'success' }));
  },
  error: (msg: string) => {
    toastListeners.forEach((l) => l({ id: Math.random().toString(), message: msg, type: 'error' }));
  },
  info: (msg: string) => {
    toastListeners.forEach((l) => l({ id: Math.random().toString(), message: msg, type: 'info' }));
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (newToast: ToastMessage) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };

    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border-y border-r border-l-4 animate-slide-in duration-300 bg-white/90 backdrop-blur-md ${
            t.type === 'success'
              ? 'text-slate-800 border-slate-200/80 border-l-cyan-500'
              : t.type === 'error'
              ? 'text-slate-800 border-slate-200/80 border-l-rose-500'
              : 'text-slate-800 border-slate-200/80 border-l-cyan-500'
          }`}
        >
          {t.type === 'success' && (
            <svg className="w-5 h-5 shrink-0 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {t.type === 'error' && (
            <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {t.type === 'info' && (
            <svg className="w-5 h-5 shrink-0 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-sm font-semibold text-slate-700">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
