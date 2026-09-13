/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabaseClient';
import { analytics } from '@/lib/analytics';
import { TRAITORS_COORG_MEDIA, TRAITORS_COORG_SLIDES } from '@/lib/propertyMedia';
import { 
  Heart, 
  ChevronLeft, ChevronRight, Send, CheckCircle2, 
  Calendar, Users, Trophy, Flame,
  Maximize2, X, ArrowRight, ExternalLink,
  MapPin, Coffee, Trees, Skull, MessageCircle, Phone,
  Sparkles, Waves, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface CommentItem {
  id: string;
  author: string;
  text: string;
  time: string;
  verified?: boolean;
  reply?: string;
}

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    author: 'Aarav Nair',
    text: 'How does the "Winner Takes It All" prize refund work?',
    time: '2h ago',
    verified: true,
    reply: 'If you uncover all the Traitors or survive as a Traitor to win the final trial on Day 2, your entire 2-day trip cost is 100% refunded by Bookmore Stays on the spot!'
  },
  {
    id: 'c2',
    author: 'Sneha Kulkarni',
    text: 'Are roundtrip transfers from Bengaluru and all meals included in the ₹14,999 pass?',
    time: '4h ago',
    verified: true,
    reply: 'Yes! Luxury AC coach transfer from Bengaluru to Coorg, private luxury estate stay at Nirjhara Coorg, waterfall access, chocolate factory tour & all gourmet meals are fully covered.'
  },
  {
    id: 'c3',
    author: 'basvanth_rao',
    text: 'I want to join solo! Can I apply for an invite?',
    time: '1d ago',
    verified: false,
    reply: 'Absolutely! Most players join solo. Hit "Request Invite" or join our WhatsApp community at +91 - 9738397933.'
  }
];

export default function TraitorsShowcase() {
  const { currentUser } = useStore();
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'day1' | 'day2'>('day1');

  // Modals
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  
  // Forms
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpCity, setRsvpCity] = useState('Bengaluru');
  const [rsvpType, setRsvpType] = useState<'solo' | 'duo'>('solo');
  const [rsvpIg, setRsvpIg] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentItem[]>(DEFAULT_COMMENTS);
  
  // Touch Swipe Support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  
  const slides = TRAITORS_COORG_SLIDES;
  const totalSlides = slides.length;
  const currentSlide = slides[activeSlide] || slides[0];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) nextSlide();
    if (distance < -40) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showLightbox) {
        if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % totalSlides);
        if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
        if (e.key === 'Escape') setShowLightbox(false);
        return;
      }
      if (e.key === 'ArrowRight') setActiveSlide((prev) => (prev + 1) % totalSlides);
      if (e.key === 'ArrowLeft') setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      if (e.key === 'Escape') {
        setShowRsvpModal(false);
        setShowWelcomeScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, totalSlides]);

  const handleToggleLike = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    if (!currentUser) {
      toast.success(nextState ? "Saved to secret wishlist" : "Removed from list", { icon: '🗡️' });
      return;
    }
    if (nextState) {
      await supabase.from('saved_stays').insert({ property_id: 'DdMP_hKGaZZ', user_id: currentUser.id });
      analytics.save('DdMP_hKGaZZ', 'The Traitors of Coorg');
      toast.success("Saved to secret wishlist", { icon: '🗡️' });
    } else {
      await supabase.from('saved_stays').delete().eq('property_id', 'DdMP_hKGaZZ').eq('user_id', currentUser.id);
      analytics.unsave('DdMP_hKGaZZ', 'The Traitors of Coorg');
      toast.success("Removed from wishlist");
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpPhone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }

    const message = `Greetings Host 🗡️\n\nI wish to apply for an invitation to *The Traitors of Coorg* (Sep 26-27).\n\n• Candidate: ${rsvpName.trim()}\n• Entry Type: ${rsvpType === 'solo' ? 'Solo Player' : 'Duo Alliance'}\n• Phone: ${rsvpPhone.trim()}\n• City: ${rsvpCity}\n${rsvpIg ? `• Instagram: ${rsvpIg}\n` : ''}\nPlease initiate screening!`;
    
    const whatsappUrl = `https://wa.me/919738397933?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowRsvpModal(false);
    toast.success("Invitation screening request sent via WhatsApp", { icon: '🗡️' });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newC: CommentItem = {
      id: `c-${Date.now()}`,
      author: currentUser?.name || currentUser?.email?.split('@')[0] || 'Anonymous Player',
      text: commentText.trim(),
      time: 'Just now',
      verified: !!currentUser
    };

    setComments([newC, ...comments]);
    setCommentText('');
    toast.success("Inquiry delivered to the Concierge.", { icon: '📜' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#020307] text-neutral-100 selection:bg-red-950 selection:text-amber-200 antialiased font-sans relative overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 0. CINEMATIC WELCOME SCREEN OVERLAY                                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showWelcomeScreen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] bg-[#020307] flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Fog & Crimson Atmosphere */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-transparent animate-fog pointer-events-none" />
            <div className="absolute w-[500px] h-[500px] bg-red-950/40 rounded-full blur-[160px] pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full flex flex-col items-center space-y-6">
              
              {/* Emblem */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 rounded-3xl bg-red-950/80 border border-red-600/40 flex items-center justify-center shadow-2xl"
              >
                <Skull size={40} className="text-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]" />
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-2"
              >
                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-red-400">
                  BOOKMORE STAYS PRESENTS
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  THE TRAITORS <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-red-400">
                    OF COORG
                  </span>
                </h1>
                <p className="text-neutral-300 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed pt-2">
                  A 2-Day Social Deduction Thriller & Mystery Getaway at the 4-star <strong>Nirjhara Estate</strong>, Coorg.
                </p>
              </motion.div>

              {/* Stakes summary */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full bg-[#0b0608] border border-red-900/40 rounded-2xl p-4 text-xs text-neutral-300 space-y-1.5"
              >
                <div className="text-amber-400 font-bold flex items-center justify-center gap-1.5">
                  <Flame size={13} className="text-amber-400" />
                  <span>20 Players • 3 Secret Traitors • Sep 26–27, 2026</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Uncover all Traitors or survive as one to win a 100% trip refund on the house.
                </p>
              </motion.div>

              {/* Enter Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full space-y-3"
              >
                <button
                  onClick={() => setShowWelcomeScreen(false)}
                  className="w-full py-4 rounded-2xl bg-red-900 hover:bg-red-800 text-white font-extrabold text-sm tracking-wide shadow-xl border border-red-600/50 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Enter The Experience 🗡️</span>
                  <ArrowRight size={16} />
                </button>

                <div className="text-[11px] text-neutral-400">
                  <span>Questions? WhatsApp: </span>
                  <a href="https://wa.me/919738397933" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline">
                    +91 - 9738397933
                  </a>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* SPOOKY BACKDROP: Dark Vignette, Fog & Crimson Shadows (NO SILVER PATCHES) */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#3b080c]/25 via-[#180305]/10 to-transparent blur-[160px]" />
        <div className="absolute top-1/2 -left-60 w-[600px] h-[600px] bg-[#021c17]/15 blur-[180px]" />
        <div className="absolute top-2/3 -right-60 w-[600px] h-[600px] bg-[#220407]/15 blur-[180px]" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-transparent animate-fog" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR                                                     */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full bg-[#020307]/90 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>BOOKMORE STAYS</span>
            </span>

            <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-white/10 text-xs text-neutral-400">
              <span className="text-amber-400 font-bold">Sep 26–27, 2026</span>
              <span>•</span>
              <span className="text-neutral-300">Nirjhara Estate, Coorg</span>
            </div>
          </div>

          {/* Direct Actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919738397933?text=Hey!%20I'd%20like%20to%20join%20the%20Bookmore%20Stays%20WhatsApp%20Community%20🗡️"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 transition active:scale-95"
            >
              <MessageCircle size={14} />
              <span>WhatsApp (+91 9738397933)</span>
            </a>

            <button
              onClick={() => setShowRsvpModal(true)}
              className="bg-red-900 hover:bg-red-800 text-white font-extrabold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-lg border border-red-600/40 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Request Invite</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CINEMATIC HERO SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="relative w-full border-b border-white/5 overflow-hidden bg-gradient-to-b from-[#020307] via-[#05060b] to-[#020307] py-10 sm:py-16">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Narrative & Stakes */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              
              {/* Event Metadata */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-red-950/90 text-red-300 border border-red-700/40 text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                  <Skull size={13} className="text-red-400" />
                  Psychological Mystery
                </span>
                <span className="bg-white/5 border border-white/10 text-neutral-300 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-400" />
                  Sep 26th – 27th, 2026
                </span>
                <span className="bg-white/5 border border-white/10 text-neutral-300 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Users size={13} className="text-neutral-400" />
                  20 Players • 3 Traitors
                </span>
              </div>

              {/* Title & Dramatic Premise */}
              <div>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.05]">
                  THE TRAITORS <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-200 to-red-500">
                    OF COORG
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg font-bold italic text-neutral-300 mt-3 border-l-2 border-red-600 pl-3">
                  &ldquo;Everyone&apos;s got a trip planned. This one&apos;s got a plot twist.&rdquo;
                </p>

                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mt-3 max-w-2xl">
                  A weekend of lies, deceit, and murder hosted at <strong>Nirjhara Coorg</strong> — a luxury 4-star boutique sanctuary with private streams and waterfalls. 20 travelers step into the mist of Somwarpet — but 3 among you are ruthless Traitors hunting under cloak of night.
                </p>
              </div>

              {/* 100% PRIZE BOUNTY CARD */}
              <div className="relative overflow-hidden rounded-2xl bg-[#0c0507] border border-red-800/40 p-5 shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-red-950 border border-red-600/40 flex items-center justify-center flex-shrink-0 text-amber-400">
                    <Trophy size={22} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span>THE FINAL BOUNTY</span>
                      <span>•</span>
                      <span className="text-red-400">100% TRIP REFUND</span>
                    </div>
                    <h3 className="text-base font-black text-white mt-0.5">
                      Winner Takes It All — Absolutely Free
                    </h3>
                    <p className="text-neutral-400 text-xs sm:text-sm mt-1 leading-relaxed">
                      Unmask the Traitors at the final trial, or survive to the end as a Traitor undetected, and your entire ₹14,999 trip cost is reimbursed 100% on the spot by Bookmore Stays.
                    </p>
                  </div>
                </div>
              </div>

              {/* DIRECT PRICING & INVITATION BAR */}
              <div className="rounded-2xl bg-[#090b10] border border-white/10 p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 mb-0.5">
                    <CheckCircle2 size={13} />
                    <span>ALL-INCLUSIVE DIRECT PASS</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      {formatPrice(TRAITORS_COORG_MEDIA.direct_price)}
                    </span>
                    <span className="text-xs text-neutral-400">/ player</span>
                    <span className="text-xs text-neutral-500 line-through ml-1.5">
                      {formatPrice(TRAITORS_COORG_MEDIA.mmt_price)}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    <span className="text-amber-400 font-bold">Only 6 spots open</span> • Verified candidates only
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <a
                    href="https://wa.me/919738397933?text=Greetings%20Host%20🗡️%20I'm%20interested%20in%20The%20Traitors%20of%20Coorg!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 rounded-xl text-emerald-400 transition"
                    title="WhatsApp Hotline (+91 - 9738397933)"
                  >
                    <Send size={18} />
                  </a>

                  <button
                    onClick={() => setShowRsvpModal(true)}
                    className="bg-red-900 hover:bg-red-800 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-xl border border-red-600/40 transition active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Request Invitation</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Slide Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              <div className="w-full max-w-[440px] bg-[#080a10] rounded-3xl p-4 border border-white/10 shadow-2xl relative">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-3 px-1">
                  <span className="bg-red-950 text-red-300 text-[10px] font-black px-2.5 py-0.5 rounded border border-red-800/40 flex items-center gap-1">
                    <Skull size={11} className="text-red-400" />
                    {currentSlide.badge}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 text-xs font-bold">
                      {activeSlide + 1} / {totalSlides}
                    </span>
                    <button
                      onClick={() => openLightbox(activeSlide)}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                      title="Zoom"
                    >
                      <Maximize2 size={12} />
                    </button>
                    <button
                      onClick={handleToggleLike}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        isLiked ? 'bg-red-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <Heart size={12} className={isLiked ? 'fill-white' : ''} />
                    </button>
                  </div>
                </div>

                {/* Main Slide Poster */}
                <div 
                  className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-black flex items-center justify-center cursor-pointer shadow-2xl group border border-white/10"
                  onClick={() => openLightbox(activeSlide)}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentSlide.url}
                      src={currentSlide.url}
                      alt={currentSlide.title}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full object-contain select-none"
                    />
                  </AnimatePresence>

                  {/* Left & Right Navigation */}
                  <button
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/80 hover:bg-red-950 text-white flex items-center justify-center border border-white/20 transition active:scale-90 z-20 cursor-pointer"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/80 hover:bg-red-950 text-white flex items-center justify-center border border-white/20 transition active:scale-90 z-20 cursor-pointer"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Slide Caption */}
                <div className="mt-3 px-1">
                  <h4 className="text-white text-xs sm:text-sm font-bold truncate">{currentSlide.title}</h4>
                  <p className="text-neutral-400 text-[11px] truncate mt-0.5">{currentSlide.subtitle}</p>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto py-2 mt-1 hide-scrollbar">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSlide(idx)}
                      className={`relative flex-shrink-0 w-11 h-14 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                        activeSlide === idx 
                          ? 'border-red-500 scale-105' 
                          : 'border-white/10 opacity-40 hover:opacity-90'
                      }`}
                    >
                      <img src={s.url} alt={s.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE SANCTUARY: NIRJHARA COORG SPOTLIGHT (@nirjhara_coorg)               */}
      {/* ========================================================================= */}
      <section className="w-full py-12 sm:py-16 border-b border-white/5 bg-[#03050a] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>4-Star Boutique Resort Sanctuary</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
                The Estate: Nirjhara Coorg
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 max-w-2xl">
                Tucked away amidst the rainforest and coffee plantations of Somwarpet, featuring natural cascading streams, infinity pool, and private jungle trails.
              </p>
            </div>

            <a
              href={TRAITORS_COORG_MEDIA.nirjhara_instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition flex-shrink-0"
            >
              <ExternalLink size={14} className="text-pink-400" />
              <span>Explore @nirjhara_coorg</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: Waterfall & Stream */}
            <div className="bg-[#080912] border border-white/10 rounded-3xl p-5 group hover:border-emerald-500/40 transition">
              <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-black relative">
                <img 
                  src="/traitors/official/traitors_slide_11.jpeg" 
                  alt="Private Waterfall at Nirjhara Coorg" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                  <Waves size={13} />
                  <span>Private Waterfall Inside Estate</span>
                </div>
              </div>
              <h3 className="text-base font-bold text-white">Natural Streams & Waterfall</h3>
              <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
                Step outside your cottage directly into natural cascading waterfalls and serene riverbanks nestled inside the property.
              </p>
            </div>

            {/* Feature 2: Infinity Pool & Jungle Deck */}
            <div className="bg-[#080912] border border-white/10 rounded-3xl p-5 group hover:border-emerald-500/40 transition">
              <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-black relative">
                <img 
                  src="/traitors/official/traitors_slide_12.jpeg" 
                  alt="Infinity Pool at Nirjhara Coorg" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 text-[11px] font-bold text-blue-300 flex items-center gap-1.5">
                  <Compass size={13} />
                  <span>Jungle View Deck</span>
                </div>
              </div>
              <h3 className="text-base font-bold text-white">Twilight Infinity Pool</h3>
              <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
                Panoramic infinity pool overlooking the dense Western Ghats canopy — the ideal spot for private strategy whispers.
              </p>
            </div>

            {/* Feature 3: Bonfire Courtyard & Round Table Arena */}
            <div className="bg-[#080912] border border-white/10 rounded-3xl p-5 group hover:border-emerald-500/40 transition">
              <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-black relative">
                <img 
                  src="/traitors/official/traitors_slide_10.jpeg" 
                  alt="Bonfire Arena at Nirjhara Coorg" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <Flame size={13} />
                  <span>Fireside Trial Arena</span>
                </div>
              </div>
              <h3 className="text-base font-bold text-white">Bonfire & Gourmet Dining</h3>
              <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
                Stone amphitheater for evening round table debates, barbecue spreads, and gourmet multi-cuisine dining.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE SOCIAL DEDUCTION GAME PHASES                                       */}
      {/* ========================================================================= */}
      <section className="w-full py-12 sm:py-16 border-b border-white/5 bg-[#020307] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black text-red-500 uppercase tracking-widest">
              Trust No One
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              How The Game Works
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-2">
              Inspired by the BBC format — live psychological deception and murder in the Western Ghats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-[#080910] border border-red-950/60 rounded-3xl p-6 relative overflow-hidden group hover:border-red-700/50 transition duration-300">
              <div className="h-48 rounded-2xl overflow-hidden mb-4 bg-black relative border border-white/10">
                <img 
                  src="/traitors/official/traitors_slide_8.jpeg" 
                  alt="Round Table Secret Oath" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 text-[11px] font-bold text-amber-300">
                  🕯️ The Secret Oath
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black text-red-400 uppercase tracking-wider">Phase 1</span>
                <span className="text-neutral-600">•</span>
                <span className="text-xs text-neutral-300 font-bold">Arrival</span>
              </div>
              <h3 className="text-lg font-black text-white">Traitor Selection</h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mt-2">
                All 20 players are blindfolded at the Round Table. The Host secretly taps 3 Traitors on the shoulder. Only the Traitors know each other.
              </p>
            </div>

            {/* Card 2: Official Shadow Mystery */}
            <div className="bg-[#080910] border border-emerald-950/60 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-700/50 transition duration-300">
              <div className="h-48 rounded-2xl overflow-hidden mb-4 bg-black relative border border-white/10">
                <img 
                  src="/traitors/official/traitors_slide_9.jpeg" 
                  alt="Midnight Murders Mystery" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 text-[11px] font-bold text-emerald-300">
                  🌑 Midnight Murders
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Phase 2</span>
                <span className="text-neutral-600">•</span>
                <span className="text-xs text-neutral-300 font-bold">Night Hunt</span>
              </div>
              <h3 className="text-lg font-black text-white">Midnight Murders</h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mt-2">
                While Faithfuls sleep in luxury cottages at Nirjhara, Traitors meet in shadows to murder one player. That player does not show up for breakfast.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#080910] border border-amber-950/60 rounded-3xl p-6 relative overflow-hidden group hover:border-amber-700/50 transition duration-300">
              <div className="h-48 rounded-2xl overflow-hidden mb-4 bg-black relative border border-white/10">
                <img 
                  src="/traitors/official/traitors_slide_10.jpeg" 
                  alt="The Grand Banishment Trial" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 text-[11px] font-bold text-amber-300">
                  🔥 Bonfire Council
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Phase 3</span>
                <span className="text-neutral-600">•</span>
                <span className="text-xs text-neutral-300 font-bold">Banishment</span>
              </div>
              <h3 className="text-lg font-black text-white">The Round Table Vote</h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mt-2">
                Every evening by the bonfire, players vote to banish suspects. If Faithfuls eliminate all Traitors, they win and claim the 100% trip refund bounty!
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ALL INCLUSIONS                                                         */}
      {/* ========================================================================= */}
      <section className="w-full py-12 sm:py-16 border-b border-white/5 bg-[#030408]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
              Zero Hidden Costs
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              Everything Included In Your Pass
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-2">
              From Bangalore luxury coach pickups to private waterfall swimming and gourmet feasts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            <div className="bg-[#080910] border border-white/10 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <MapPin size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Bengaluru ⇆ Coorg Transfers</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Dedicated luxury AC coach roundtrip pickup and drop from Bangalore hub points.
              </p>
            </div>

            <div className="bg-[#080910] border border-white/10 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Skull size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">4-Star Resort & Private Waterfall</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Stay at Nirjhara Coorg in Somwarpet with natural cascading streams inside the property.
              </p>
            </div>

            <div className="bg-[#080910] border border-white/10 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <Coffee size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Coffee Plantation & Chocolate Tour</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Misty estate trails, secret clue drops, and artisan handcrafted chocolate tastings.
              </p>
            </div>

            <div className="bg-[#080910] border border-white/10 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <Trees size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Mandalpatti 4x4 Jeep Safari</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Early morning cloud-top sunrise expedition to the highest panoramic peak in Coorg.
              </p>
            </div>

            <div className="bg-[#080910] border border-white/10 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-3">
                <Flame size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Bonfire Banquet & Gourmet Feasts</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Evening music, barbecue feasts, local delicacies, and heated round-table debates.
              </p>
            </div>

            <div className="bg-[#080910] border border-white/10 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <Trophy size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">100% Prize Money Refund</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Win the final game trials on Day 2 and your entire ₹14,999 trip cost is refunded.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. 2-DAY ITINERARY                                                        */}
      {/* ========================================================================= */}
      <section className="w-full py-12 sm:py-16 border-b border-white/5 bg-[#020307]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <span className="text-xs font-black text-red-500 uppercase tracking-widest">
              The Weekend Journey
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              2-Day Official Itinerary
            </h2>
          </div>

          {/* Day 1 / Day 2 Tab Selector */}
          <div className="flex bg-[#080a10] p-1 rounded-2xl border border-white/10 mb-8 max-w-sm mx-auto">
            <button
              onClick={() => setActiveTab('day1')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeTab === 'day1' 
                  ? 'bg-red-950 text-red-200 border border-red-700/50' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              DAY 1 • SATURDAY
            </button>
            <button
              onClick={() => setActiveTab('day2')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeTab === 'day2' 
                  ? 'bg-amber-950 text-amber-200 border border-amber-700/50' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              DAY 2 • SUNDAY
            </button>
          </div>

          {/* Day 1 Timeline */}
          {activeTab === 'day1' && (
            <div className="bg-[#080a10] border border-red-950/60 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-black text-white">Day 1: The Game Begins</h3>
                <span className="text-xs bg-red-950 text-red-300 font-bold px-3 py-1 rounded-full border border-red-800/40">
                  Saturday
                </span>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="w-16 flex-shrink-0 text-xs font-bold text-amber-400">06:00 AM</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Bengaluru AC Coach Departure</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Meet your 19 fellow travelers as the journey to Coorg commences.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-16 flex-shrink-0 text-xs font-bold text-amber-400">12:30 PM</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Check-in at Nirjhara 4-Star Resort</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Welcome gourmet multi-cuisine buffet and orientation by the private estate waterfall.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-16 flex-shrink-0 text-xs font-bold text-red-400">02:30 PM</div>
                  <div>
                    <h4 className="text-sm font-bold text-red-400">Secret Traitor Selection Trial</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Players don cloaks. In complete darkness, 3 Traitors are tapped on the shoulder.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-16 flex-shrink-0 text-xs font-bold text-amber-400">03:30 PM</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Coffee Plantation & Chocolate Factory</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Clue hunt amidst mist-laden coffee plants followed by handcrafted chocolate tastings.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-16 flex-shrink-0 text-xs font-bold text-red-400">08:00 PM</div>
                  <div>
                    <h4 className="text-sm font-bold text-red-400">Round Table Banishment & Bonfire Banquet</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">First dramatic voting round to banish a suspect, followed by music & fireside feast.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Day 2 Timeline */}
          {activeTab === 'day2' && (
            <div className="bg-[#080a10] border border-amber-950/60 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-black text-white">Day 2: Mandalpatti & Finale</h3>
                <span className="text-xs bg-amber-950 text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-800/40">
                  Sunday
                </span>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="w-16 flex-shrink-0 text-xs font-bold text-amber-400">05:00 AM</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Mandalpatti 4x4 Cloud-Top Safari</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Jeep climb through fog to witness the sunrise over endless mountain peaks.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-16 flex-shrink-0 text-xs font-bold text-amber-400">09:00 AM</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Waterfall Breakfast & Poolside Clues</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Breakfast by cascading natural waters while allies deliberate on final suspects.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-16 flex-shrink-0 text-xs font-bold text-red-400">11:30 AM</div>
                  <div>
                    <h4 className="text-sm font-bold text-red-400">The Grand Finale Round Table</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Final accusations, traitor reveals, and the 100% prize refund ceremony.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-16 flex-shrink-0 text-xs font-bold text-amber-400">02:00 PM</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Celebratory Return to Bengaluru</h4>
                    <p className="text-neutral-400 text-xs mt-0.5">Coach transfer back to Bangalore with new friendships and unforgettable stories.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. WHATSAPP COMMUNITY SECTION (+91 - 9738397933)                          */}
      {/* ========================================================================= */}
      <section className="w-full py-12 sm:py-16 bg-[#030408] border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#080910] border border-emerald-500/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
                  <MessageCircle size={14} />
                  <span>Exclusive Access</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Join Our WhatsApp Community
                </h2>
                <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 max-w-lg">
                  Get first access to upcoming cohorts, player screening updates, and direct host questions.
                </p>
                <div className="mt-2.5 flex items-center justify-center md:justify-start gap-2 text-xs text-emerald-400 font-bold">
                  <Phone size={14} />
                  <span>+91 - 9738397933</span>
                </div>
              </div>

              <a
                href="https://wa.me/919738397933?text=Hey!%20I%20would%20like%20to%20join%20the%20Bookmore%20Stays%20WhatsApp%20Community%20🗡️"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2 cursor-pointer flex-shrink-0"
              >
                <MessageCircle size={18} />
                <span>Join Community</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. COMMUNITY Q&A                                                          */}
      {/* ========================================================================= */}
      <section className="w-full py-12 sm:py-16 bg-[#020307]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
              Questions & Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Host Inquiries & FAQs
            </h2>
          </div>

          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="bg-[#080910] border border-white/10 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    {c.author}
                    {c.verified && <CheckCircle2 size={13} className="text-blue-400" />}
                  </span>
                  <span className="text-neutral-500 text-[11px]">{c.time}</span>
                </div>
                <p className="text-neutral-300 text-xs sm:text-sm">{c.text}</p>
                {c.reply && (
                  <div className="mt-2.5 pl-3 border-l-2 border-amber-400 bg-amber-400/5 p-2.5 rounded-r-xl">
                    <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Host Concierge</div>
                    <p className="text-neutral-300 text-xs mt-0.5">{c.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Ask a Question Input */}
          <form onSubmit={handleAddComment} className="mt-5 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Ask the host a question about the trip..."
              className="flex-1 bg-[#080910] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer flex-shrink-0"
            >
              Post
            </button>
          </form>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="w-full border-t border-white/5 bg-[#010204] py-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="text-base font-black text-white">BOOKMORESTAYS</span>
            <p className="text-xs text-neutral-500 mt-0.5">© 2026 • The Traitors of Coorg at Nirjhara Estate</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-neutral-400">
            <button
              onClick={() => setShowWelcomeScreen(true)}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Open Welcome Screen 🗡️
            </button>
            <span>•</span>
            <a href="https://wa.me/919738397933" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
              WhatsApp (+91 - 9738397933)
            </a>
            <span>•</span>
            <a href="https://www.instagram.com/nirjhara_coorg/" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white">
              @nirjhara_coorg
            </a>
            <span>•</span>
            <a href="https://www.instagram.com/bookmore.stays/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              @bookmore.stays
            </a>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 10. MOBILE STICKY FLOATING ACTION BAR                                     */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40">
        <div className="bg-[#080910]/95 backdrop-blur-2xl border border-red-500/30 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <div className="text-[9px] text-neutral-400 uppercase font-black tracking-wider">DIRECT PASS</div>
            <div className="text-base font-black text-white">
              {formatPrice(TRAITORS_COORG_MEDIA.direct_price)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/919738397933?text=Greetings%20Host%20🗡️%20I'm%20interested%20in%20The%20Traitors%20of%20Coorg!"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-emerald-950 border border-emerald-500/40 rounded-xl text-emerald-400"
              title="WhatsApp +91 - 9738397933"
            >
              <Send size={15} />
            </a>
            <button
              onClick={() => setShowRsvpModal(true)}
              className="bg-red-900 hover:bg-red-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg border border-red-600/40 cursor-pointer"
            >
              Request Invite 🗡️
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 11. LIGHTBOX MODAL                                                        */}
      {/* ========================================================================= */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <div className="absolute top-5 left-6 right-6 flex justify-between items-center z-30" onClick={(e) => e.stopPropagation()}>
            <div className="text-white text-xs sm:text-sm font-bold bg-white/10 px-4 py-1.5 rounded-full border border-white/15">
              Slide {lightboxIndex + 1} of {totalSlides} • {slides[lightboxIndex].badge}
            </div>
            <button
              onClick={() => setShowLightbox(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative max-w-3xl max-h-[75vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={slides[lightboxIndex].url} 
              alt={slides[lightboxIndex].title}
              className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl" 
            />

            <button
              onClick={() => setLightboxIndex((prev) => (prev - 1 + totalSlides) % totalSlides)}
              className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 hover:bg-red-900 text-white flex items-center justify-center border border-white/20 transition cursor-pointer"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={() => setLightboxIndex((prev) => (prev + 1) % totalSlides)}
              className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 hover:bg-red-900 text-white flex items-center justify-center border border-white/20 transition cursor-pointer"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="mt-4 text-center max-w-md px-4" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-white font-extrabold text-base">{slides[lightboxIndex].title}</h4>
            <p className="text-neutral-400 text-xs mt-1">{slides[lightboxIndex].subtitle}</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. REQUEST INVITE MODAL                                                  */}
      {/* ========================================================================= */}
      {showRsvpModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowRsvpModal(false)}
        >
          <div 
            className="bg-[#080910] border border-red-700/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRsvpModal(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-[11px] font-extrabold text-amber-400 uppercase tracking-wider mb-1.5">
              <span>🗡️ Secret Screening</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-1">
              Apply For The Traitors
            </h3>
            <p className="text-neutral-400 text-xs mb-5">
              20 verified players only. Concierge: <span className="text-emerald-400 font-bold">+91 - 9738397933</span>
            </p>

            <form onSubmit={handleRsvpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Alliance Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpType('solo')}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      rsvpType === 'solo' 
                        ? 'bg-red-950 border-red-500 text-red-200' 
                        : 'bg-white/5 border-white/10 text-neutral-400'
                    }`}
                  >
                    Solo Player
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpType('duo')}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      rsvpType === 'duo' 
                        ? 'bg-red-950 border-red-500 text-red-200' 
                        : 'bg-white/5 border-white/10 text-neutral-400'
                    }`}
                  >
                    Duo Alliance
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  required
                  value={rsvpPhone}
                  onChange={(e) => setRsvpPhone(e.target.value)}
                  placeholder="+91 97383 97933"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Departure City</label>
                <input
                  type="text"
                  value={rsvpCity}
                  onChange={(e) => setRsvpCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">Instagram Handle (Optional)</label>
                <input
                  type="text"
                  value={rsvpIg}
                  onChange={(e) => setRsvpIg(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-red-900 hover:bg-red-800 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-red-600/40"
              >
                <span>Submit Application & Chat</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
