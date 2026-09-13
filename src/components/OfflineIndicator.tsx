'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.debug('ServiceWorker registration skipped or failed:', err);
      });
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !showRestored) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
      {isOffline ? (
        <div className="flex items-center gap-2.5 bg-amber-950/90 text-amber-200 border border-amber-800/80 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs font-semibold">
          <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>You are currently offline. Viewing cached stays.</span>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 bg-emerald-950/90 text-emerald-200 border border-emerald-800/80 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs font-semibold">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span>Internet connection restored!</span>
        </div>
      )}
    </div>
  );
}
