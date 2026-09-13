"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import ShareIntentListener from "@/components/ShareIntentListener";
import { Toaster } from 'react-hot-toast';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="w-full min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-sans">
        <Toaster position="top-right" toastOptions={{ className: 'font-semibold text-sm rounded-xl' }} />
        <ShareIntentListener />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white selection:bg-red-900 selection:text-white relative font-sans overflow-x-hidden">
      <Toaster position="top-center" toastOptions={{ className: 'font-semibold text-sm rounded-xl' }} />
      <ShareIntentListener />
      {children}
      <BottomNav />
    </div>
  );
}
