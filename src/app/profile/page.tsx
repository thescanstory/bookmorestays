/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Gift, Bell, Copy, Share2, Shield, Settings, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useStore();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Referral Program state
  const [referralCode, setReferralCode] = useState<string>('BMS-VIP-88');
  const [creditsEarned, setCreditsEarned] = useState<number>(2500);
  const [copied, setCopied] = useState(false);

  // Notification preferences
  const [notifyPriceDrops, setNotifyPriceDrops] = useState(true);
  const [notifyNewTours, setNotifyNewTours] = useState(true);
  const [notifyInquiries, setNotifyInquiries] = useState(true);

  // Fetch or generate referral code for user
  useEffect(() => {
    async function loadReferral() {
      if (currentUser?.id) {
        try {
          const { data } = await supabase
            .from('referral_codes')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();

          if (data) {
            setReferralCode(data.code);
            setCreditsEarned(data.credits_earned || 0);
          } else {
            const newCode = `BMS-${(currentUser.email?.split('@')[0] || 'TRAVEL').toUpperCase().slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`;
            await supabase.from('referral_codes').insert({
              user_id: currentUser.id,
              code: newCode,
              credits_earned: 0
            });
            setReferralCode(newCode);
          }
        } catch {
          // Fallback code
        }
      }
    }
    loadReferral();
  }, [currentUser]);

  const handleLogin = async (provider: 'google' | 'apple') => {
    await supabase.auth.signInWithOAuth({ provider });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Confirmation link sent to your email!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    toast.success("Logged out successfully");
  };

  const handleCopyReferral = () => {
    const inviteUrl = `${window.location.origin}/?ref=${referralCode}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success("Invite link copied to clipboard!", { icon: '🎁' });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareReferral = async () => {
    const inviteUrl = `${window.location.origin}/?ref=${referralCode}`;
    const text = `Join Bookmorestays to unlock direct hotel rates and get ₹2,500 booking credits! Use my code: ${referralCode}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Bookmorestays Invite', text, url: inviteUrl });
      } catch {
        // Ignored
      }
    } else {
      handleCopyReferral();
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 pb-28">
      {/* Header section with curve */}
      <div className="bg-primary pt-12 pb-20 px-6 rounded-b-[40px] shadow-lg relative">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile & Rewards</h1>
        <p className="text-blue-100 text-sm mt-1 font-medium">Your personal account, credits, and perks</p>
      </div>

      <div className="flex-1 px-6 -mt-12 relative z-10 space-y-5">
        {currentUser ? (
          <div className="w-full text-center bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-3 overflow-hidden border-4 border-white shadow-md">
              {currentUser.avatar_url ? (
                <img src={currentUser.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-50 flex items-center justify-center text-primary font-bold text-3xl">
                  {(currentUser.name || currentUser.email || "U")[0].toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-[#1c2434]">{currentUser.name || currentUser.email}</h2>
            <p className="text-[#94a3b8] font-medium text-xs mt-0.5">Verified Luxury Traveler</p>
            
            <button 
              onClick={handleLogout}
              className="mt-5 w-full py-3 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition text-sm"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 space-y-4">
            <h2 className="text-xl font-bold text-[#1c2434] text-center">Welcome to Bookmorestays</h2>
            <p className="text-center text-[#64748b] mb-4 font-medium text-xs leading-relaxed">
              Log in to sync your saved stays, unlock direct prices, and earn credits.
            </p>
            
            {showEmailForm ? (
              <form onSubmit={handleEmailAuth} className="space-y-3">
                {error && <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">{error}</div>}
                
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-[#1c2434] focus:ring-2 focus:ring-primary/50 outline-none font-medium"
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-[#1c2434] focus:ring-2 focus:ring-primary/50 outline-none font-medium"
                />
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white rounded-2xl py-3.5 font-bold hover:bg-blue-800 transition disabled:opacity-50 shadow-lg shadow-primary/30 mt-2 text-sm"
                >
                  {loading ? "Please wait..." : (authMode === "login" ? "Log In" : "Sign Up")}
                </button>
                
                <p className="text-center text-xs text-[#94a3b8] mt-3 font-medium">
                  {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button type="button" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} className="text-primary font-bold">
                    {authMode === "login" ? "Sign up" : "Log in"}
                  </button>
                </p>
                
                <button type="button" onClick={() => setShowEmailForm(false)} className="w-full text-[#94a3b8] font-bold text-xs pt-2 hover:text-gray-600 transition">
                  Back to all options
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={() => handleLogin('google')}
                  className="w-full bg-white border border-gray-200 text-[#1c2434] rounded-2xl py-3.5 font-bold flex items-center justify-center space-x-3 hover:bg-gray-50 transition shadow-sm text-sm"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                  <span>Continue with Google</span>
                </button>
                
                <button 
                  onClick={() => handleLogin('apple')}
                  className="w-full bg-[#1c2434] text-white rounded-2xl py-3.5 font-bold flex items-center justify-center space-x-3 hover:bg-black transition shadow-md shadow-gray-200 text-sm"
                >
                  <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-4 h-4 filter invert" />
                  <span>Continue with Apple</span>
                </button>

                <button 
                  onClick={() => setShowEmailForm(true)}
                  className="w-full bg-primary/5 text-primary rounded-2xl py-3.5 font-bold hover:bg-primary/10 transition text-sm"
                >
                  Continue with Email
                </button>
              </div>
            )}
          </div>
        )}

        {/* Referral Program Card */}
        <div className="w-full bg-gradient-to-br from-indigo-900 via-blue-900 to-primary text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Gift size={18} className="text-amber-300" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-200">Referral Program</span>
          </div>

          <h3 className="text-xl font-extrabold mb-1">Invite Friends & Earn ₹2,500</h3>
          <p className="text-xs text-blue-100/80 mb-4 leading-relaxed">
            Share your exclusive code. When your friend books their first stay, you both get ₹2,500 direct booking credit!
          </p>

          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 mb-4 flex items-center justify-between border border-white/15">
            <div>
              <span className="text-[10px] text-white/60 font-bold block uppercase tracking-wider">Your Referral Code</span>
              <span className="text-base font-black tracking-wider text-amber-300 font-mono">{referralCode}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyReferral}
                className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition backdrop-blur-sm"
                title="Copy Link"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
              <button
                onClick={handleShareReferral}
                className="w-9 h-9 bg-white text-primary rounded-xl flex items-center justify-center font-bold hover:bg-blue-50 transition shadow-md"
                title="Share Code"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold pt-1 border-t border-white/15">
            <span className="text-white/80">Credits Earned</span>
            <span className="text-emerald-300 font-bold text-sm">₹{creditsEarned.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="w-full bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-primary" />
            <h3 className="text-base font-bold text-gray-900">Notification Preferences</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Price Drop Alerts</h4>
                <p className="text-[11px] text-gray-500">Notify when saved properties offer direct flash rates</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyPriceDrops(!notifyPriceDrops)}
                className={`w-10 h-6 rounded-full p-1 transition-colors ${notifyPriceDrops ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifyPriceDrops ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900">New 4K Verified Tours</h4>
                <p className="text-[11px] text-gray-500">Get alerts when cinematic footage is added in your city</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyNewTours(!notifyNewTours)}
                className={`w-10 h-6 rounded-full p-1 transition-colors ${notifyNewTours ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifyNewTours ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Inquiry & Booking Updates</h4>
                <p className="text-[11px] text-gray-500">Status messages from hotel managers & concierges</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyInquiries(!notifyInquiries)}
                className={`w-10 h-6 rounded-full p-1 transition-colors ${notifyInquiries ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifyInquiries ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Admin Portal & Privacy Links */}
        <div className="w-full bg-white rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 space-y-1">
          <Link
            href="/admin"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                <Settings size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block">Admin Portal</span>
                <span className="text-[10px] text-gray-500">Manage properties, inquiries, and tour requests</span>
              </div>
            </div>
            <span className="text-gray-400 text-xs">→</span>
          </Link>

          <Link
            href="/privacy"
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                <Shield size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block">Privacy Policy</span>
                <span className="text-[10px] text-gray-500">Data usage & Meta API policies</span>
              </div>
            </div>
            <span className="text-gray-400 text-xs">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
