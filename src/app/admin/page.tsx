/* eslint-disable @next/next/no-img-element */
"use client";

import Link from 'next/link';
import { Crown, Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPortalGateway() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center py-12 px-4 font-sans">
      <div className="max-w-2xl w-full space-y-8">
        
        {/* Title & Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-primary text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
            <ShieldCheck size={14} /> Bookmorestays Administration
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Select Admin Portal
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
            Choose your role to access dedicated tools, analytics, and property management systems.
          </p>
        </div>

        {/* 2 Dedicated Admin Portals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Card 1: Master Admin (For You / Owner) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border-2 border-amber-300 hover:border-amber-400 rounded-3xl p-6 sm:p-7 shadow-lg shadow-amber-500/5 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4">
              <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Full Access
              </span>
            </div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
                <Crown size={28} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-amber-700 transition">
                  Master Admin
                </h2>
                <span className="text-xs font-semibold text-amber-600 block mt-0.5">
                  For Platform Owner & Founder
                </span>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  Full control over all listings, platform GMV analytics, 4K videographer shoot pipeline, verification moderation, and team permissions.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <span className="text-amber-600 font-bold">✓</span> Global Inventory & Moderation
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-amber-600 font-bold">✓</span> 4K Shoot Production Queue
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-amber-600 font-bold">✓</span> Total OTA Savings & GMV
                </li>
              </ul>
            </div>

            <Link
              href="/admin/master"
              className="mt-6 w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold rounded-2xl transition flex items-center justify-center gap-2 text-xs shadow-md shadow-amber-500/20"
            >
              <span>Enter Master Admin</span>
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Card 2: Property Team Portal (For Hotel Partners) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-3xl p-6 sm:p-7 shadow-lg shadow-blue-500/5 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4">
              <span className="text-[10px] font-black text-primary bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Partner Portal
              </span>
            </div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shadow-sm">
                <Building2 size={28} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-primary transition">
                  Property Team Admin
                </h2>
                <span className="text-xs font-semibold text-primary block mt-0.5">
                  For Resort Managers & Hosts
                </span>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  Dedicated interface for property owners to manage their rooms, respond directly to WhatsApp booking leads, and request on-site 4K video shoots.
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <span className="text-primary font-bold">✓</span> Manage My Listings & Rates
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-primary font-bold">✓</span> Direct WhatsApp Guest Leads
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-primary font-bold">✓</span> 1-Tap 4K Shoot Request
                </li>
              </ul>
            </div>

            <Link
              href="/admin/property"
              className="mt-6 w-full py-3.5 bg-primary hover:bg-blue-700 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 text-xs shadow-md shadow-primary/20"
            >
              <span>Enter Property Portal</span>
              <ArrowRight size={15} />
            </Link>
          </motion.div>

        </div>

        {/* Bottom Quick Tools Link */}
        <div className="pt-4 text-center">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-900 transition font-medium"
          >
            ← Return to Main App
          </Link>
        </div>

      </div>
    </div>
  );
}