"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WelcomePage() {
  return (
    <main className="relative min-h-screen flex items-end justify-center overflow-hidden pb-12 px-6">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-black/30" />
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 bg-white/30 backdrop-blur-md border border-white/20 p-8 pt-10 pb-16 rounded-[40px] text-center w-full max-w-sm shadow-2xl"
      >
        <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight leading-tight">Welcome to Bookmorestays</h1>
        <p className="text-white/90 text-sm font-medium leading-relaxed px-2">
          Discover luxury stays from reels and book directly to save on OTA commissions!
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
        className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2"
      >
        <Link 
          href="/profile" 
          className="flex items-center justify-center w-[72px] h-[72px] bg-primary rounded-full text-white shadow-xl hover:scale-105 transition-transform ring-4 ring-white/10"
        >
          <ArrowRight size={28} />
        </Link>
      </motion.div>
    </main>
  );
}
