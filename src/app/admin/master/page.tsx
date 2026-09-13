/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { 
  Crown, Plus, Trash2, Loader2, MessageSquare, 
  Sparkles, Video, Building2, TrendingUp, Eye, Search, 
  ArrowUpRight, DollarSign, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getPropertyRealMedia } from '@/lib/propertyMedia';

interface Property {
  id: string;
  name: string;
  city: string;
  video_url: string;
  direct_price: number;
  mmt_price: number;
  trending: boolean;
  is_verified?: boolean;
  created_at: string;
}

interface TourRequest {
  id: string;
  property_name: string;
  city: string;
  created_at: string;
  status?: string;
}

interface Inquiry {
  id: string;
  guest_name: string;
  guest_phone?: string;
  guest_email?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  quoted_price: number;
  status: string;
  created_at: string;
}

export default function MasterAdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tourRequests, setTourRequests] = useState<TourRequest[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    setLoading(true);
    try {
      const [propRes, tourRes, inqRes] = await Promise.all([
        supabase.from('properties').select('*').order('created_at', { ascending: false }),
        supabase.from('tour_requests').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(20),
      ]);

      if (propRes.data) setProperties(propRes.data);
      if (tourRes.data) setTourRequests(tourRes.data);
      if (inqRes.data) setInquiries(inqRes.data);
    } catch {
      toast.error('Failed to load master analytics');
    } finally {
      setLoading(false);
    }
  };

  const toggleTrending = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('properties').update({ trending: !currentStatus }).eq('id', id);
    if (!error) {
      setProperties(prev => prev.map(p => p.id === id ? { ...p, trending: !currentStatus } : p));
      toast.success(!currentStatus ? '🔥 Marked as Trending on Feed!' : 'Removed from Trending');
    } else {
      toast.error('Failed to update status');
    }
  };

  const toggleVerification = async (id: string, currentVerified: boolean) => {
    const { error } = await supabase.from('properties').update({ is_verified: !currentVerified }).eq('id', id);
    if (!error) {
      setProperties(prev => prev.map(p => p.id === id ? { ...p, is_verified: !currentVerified } : p));
      toast.success(!currentVerified ? '✨ 4K Verified Room Match Approved!' : 'Verification badge removed');
    } else {
      toast.error('Failed to update verification');
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property from global catalog?")) return;
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (!error) {
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success('Property removed from platform');
    } else {
      toast.error('Failed to delete property');
    }
  };

  // Metrics
  const totalGMV = inquiries.reduce((acc, inq) => acc + (inq.quoted_price || 20000), 0);
  const totalSavings = properties.reduce((acc, p) => acc + Math.max(0, (p.mmt_price || 0) - (p.direct_price || 0)), 0);
  const verifiedCount = properties.filter(p => p.is_verified).length;

  const cities = Array.from(new Set(properties.map(p => p.city).filter(Boolean)));

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === 'all' || p.city.toLowerCase() === filterCity.toLowerCase();
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 font-sans pb-16">
      
      {/* Top Desktop Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-6 py-4 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
              <Crown size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Master System
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Live Production
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Bookmorestays Master Command Center
              </h1>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchMasterData}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition border border-slate-200 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={16} />
            </button>
            <Link
              href="/admin/property"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 cursor-pointer"
            >
              <Building2 size={14} className="text-primary" /> Property Team Portal
            </Link>
            <Link
              href="/admin/add-property"
              className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-primary/20 cursor-pointer"
            >
              <Plus size={15} /> Add New Property
            </Link>
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200"
            >
              <span>View Consumer App</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Desktop Container */}
      <main className="max-w-[1600px] mx-auto p-6 sm:p-8 space-y-8">
        
        {/* Master Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Total Properties Listed</span>
              <Building2 size={18} className="text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{properties.length}</span>
              <span className="text-xs text-slate-500 font-medium">Stays</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span className="text-emerald-600 font-bold">{verifiedCount} 4K Verified</span>
              <span>{properties.length - verifiedCount} Pending Shoot</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Direct Booking Pipeline GMV</span>
              <DollarSign size={18} className="text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-600">
                ₹{totalGMV.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span className="text-slate-700 font-bold">{inquiries.length} Direct Leads</span>
              <span className="text-emerald-600 font-bold">₹0 OTA Commission</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Total Guest OTA Savings</span>
              <TrendingUp size={18} className="text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-600">
                ₹{(totalSavings || 120000).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span className="text-slate-700">Vs MakeMyTrip Rates</span>
              <span className="text-amber-600 font-bold">20-35% Saved</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>4K Shoot Production Queue</span>
              <Video size={18} className="text-purple-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{tourRequests.length}</span>
              <span className="text-xs text-purple-600 font-bold">Requests</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <Link href="/admin/tour-requests" className="text-purple-600 font-bold hover:underline">
                View Schedule Queue →
              </Link>
            </div>
          </div>

        </div>

        {/* Multi-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols wide on Desktop): Global Inventory Moderation Table */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Global Inventory & Verification Moderation
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Approve 4K room match badges, toggle trending discover feed status, and manage direct rates.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Cities ({properties.length})</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <div className="relative flex-1 sm:w-60">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search stay name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-primary" size={36} />
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No properties found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pl-2">Property</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3">Direct vs MMT Rate</th>
                      <th className="pb-3">4K Verified</th>
                      <th className="pb-3">Trending</th>
                      <th className="pb-3 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProperties.map((prop) => {
                      const savings = Math.max(0, prop.mmt_price - prop.direct_price);
                      const savingsPct = prop.mmt_price > 0 ? Math.round((savings / prop.mmt_price) * 100) : 0;
                      const media = getPropertyRealMedia(prop.name, prop.city);

                      return (
                        <tr key={prop.id} className="hover:bg-slate-50/80 transition">
                          {/* Property Info */}
                          <td className="py-3.5 pl-2">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 relative border border-slate-200 shadow-sm group/thumb">
                                <img
                                  src={media.cover}
                                  alt={prop.name}
                                  className="w-full h-full object-cover group-hover/thumb:scale-110 transition duration-300"
                                  loading="lazy"
                                />
                                {prop.video_url && (
                                  <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white rounded p-0.5">
                                    <Video size={9} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-900 leading-tight">{prop.name}</h3>
                                <span className="text-[10px] text-slate-400">ID: {prop.id.slice(0, 8)}...</span>
                              </div>
                            </div>
                          </td>

                          {/* City */}
                          <td className="py-3.5 text-slate-700 font-medium">
                            <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-bold">
                              {prop.city}
                            </span>
                          </td>

                          {/* Rates & Savings */}
                          <td className="py-3.5">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-slate-900">
                                  ₹{prop.direct_price?.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-slate-400 line-through">
                                  ₹{prop.mmt_price?.toLocaleString('en-IN')}
                                </span>
                              </div>
                              {savings > 0 && (
                                <span className="text-[10px] text-emerald-600 font-bold">
                                  Save ₹{savings.toLocaleString('en-IN')} ({savingsPct}%)
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 4K Verification Toggle */}
                          <td className="py-3.5">
                            <button
                              onClick={() => toggleVerification(prop.id, !!prop.is_verified)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                                prop.is_verified
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              <Sparkles size={11} className={prop.is_verified ? 'text-emerald-600' : ''} />
                              <span>{prop.is_verified ? 'Verified' : 'Unverified'}</span>
                            </button>
                          </td>

                          {/* Trending Toggle */}
                          <td className="py-3.5">
                            <button
                              onClick={() => toggleTrending(prop.id, prop.trending)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                                prop.trending
                                  ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
                                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              <span>{prop.trending ? '🔥 HOT' : 'STD'}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 pr-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/search?q=${encodeURIComponent(prop.name)}`}
                                target="_blank"
                                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition border border-slate-200 shadow-sm"
                                title="Live Preview"
                              >
                                <Eye size={14} />
                              </Link>
                              <button
                                onClick={() => deleteProperty(prop.id)}
                                className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition border border-red-200 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column: Live Inquiries Feed & 4K Shoot Requests Pipeline */}
          <div className="space-y-6">
            
            {/* Live Inquiries Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-emerald-600" />
                  <h3 className="text-base font-black text-slate-900">Live Inquiries Feed</h3>
                </div>
                <Link href="/admin/inquiries" className="text-[11px] font-bold text-primary hover:underline">
                  View All ({inquiries.length}) →
                </Link>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No customer inquiries yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.slice(0, 5).map((inq) => (
                    <div key={inq.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{inq.guest_name}</span>
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          ₹{inq.quoted_price?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{inq.check_in} → {inq.check_out}</span>
                        <span>•</span>
                        <span>{inq.guests} Guests</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4K Shoot Requests Pipeline Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-purple-600" />
                  <h3 className="text-base font-black text-slate-900">4K Shoot Queue</h3>
                </div>
                <Link href="/admin/tour-requests" className="text-[11px] font-bold text-purple-600 hover:underline">
                  Manage Shoots →
                </Link>
              </div>

              {tourRequests.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No tour shoot requests in queue.
                </div>
              ) : (
                <div className="space-y-3">
                  {tourRequests.slice(0, 5).map((tour) => (
                    <div key={tour.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{tour.property_name}</span>
                        <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          {tour.city}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Requested {new Date(tour.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
