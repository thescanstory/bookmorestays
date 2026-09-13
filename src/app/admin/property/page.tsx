/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { 
  Building2, Plus, MessageSquare, Send, Video, Sparkles, 
  CheckCircle2, Calendar, Users, ExternalLink, Loader2
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
  is_verified?: boolean;
  whatsapp_number?: string;
  created_at: string;
}

interface Inquiry {
  id: string;
  property_id: string;
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  guests: number;
  message?: string;
  quoted_price?: number;
  status: string;
  created_at: string;
}

export default function PropertyTeamPortal() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingTourFor, setRequestingTourFor] = useState<string | null>(null);

  useEffect(() => {
    fetchPropertyTeamData();
  }, []);

  const fetchPropertyTeamData = async () => {
    setLoading(true);
    try {
      const [propRes, inqRes] = await Promise.all([
        supabase.from('properties').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(30),
      ]);

      if (propRes.data) setProperties(propRes.data);
      if (inqRes.data) setInquiries(inqRes.data);
    } catch {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest4KShoot = async (prop: Property) => {
    setRequestingTourFor(prop.id);
    try {
      const { error } = await supabase.from('tour_requests').insert({
        property_name: prop.name,
        city: prop.city,
        status: 'pending_schedule'
      });

      if (!error) {
        toast.success('4K Tour Requested for ' + prop.name + '! Our videography team will contact you.', { icon: '🎥', duration: 4000 });
      } else {
        toast.error('Failed to submit tour request');
      }
    } catch {
      toast.error('Error requesting tour');
    } finally {
      setRequestingTourFor(null);
    }
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    const { error } = await supabase.from('inquiries').update({ status: newStatus }).eq('id', inquiryId);
    if (!error) {
      setInquiries(prev => prev.map(inq => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq)));
      toast.success('Booking marked as ' + newStatus);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 font-sans pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shadow-sm">
              <Building2 size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-primary bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Hotel Partner & Property Team
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Property Manager Portal
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Manage your listings, reply to direct WhatsApp leads, & request 4K verified video tours.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/add-property"
              className="px-4 py-3 bg-primary hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-primary/20 cursor-pointer"
            >
              <Plus size={16} /> Add New Listing
            </Link>
          </div>
        </div>

        {/* Quick Property Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
              <span>Active Stays</span>
              <Building2 size={16} className="text-primary" />
            </div>
            <span className="text-2xl font-black text-slate-900">{properties.length}</span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Listed on Bookmorestays
            </span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
              <span>Direct Booking Leads</span>
              <MessageSquare size={16} className="text-emerald-600" />
            </div>
            <span className="text-2xl font-black text-slate-900">{inquiries.length}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">
              100% direct with ₹0 OTA commission
            </span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
              <span>4K Verified Rate</span>
              <Sparkles size={16} className="text-amber-500" />
            </div>
            <span className="text-2xl font-black text-slate-900">
              {properties.length > 0 ? Math.round((properties.filter(p => p.is_verified).length / properties.length) * 100) : 0}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Properties filmed on-site
            </span>
          </div>
        </div>

        {/* Section 1: Incoming Guest Inquiries (Leads) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Direct Guest Inquiries</h2>
              <p className="text-xs text-slate-500">Contact guests immediately via WhatsApp to confirm their reservation</p>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-primary px-3 py-1 rounded-full border border-blue-100">
              {inquiries.length} Total Leads
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-primary" size={28} />
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No new inquiries yet. Share your listing to start receiving direct bookings!
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{inq.guest_name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inq.status === 'confirmed' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : inq.status === 'contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inq.status || 'New Lead'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar size={13} className="text-primary" /> {inq.check_in} → {inq.check_out}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Users size={13} className="text-primary" /> {inq.guests} Guests
                      </span>
                      {inq.quoted_price && (
                        <span className="font-extrabold text-slate-900">
                          ₹{inq.quoted_price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {inq.message && (
                      <p className="text-xs text-slate-500 mt-2 bg-white p-2.5 rounded-xl border border-slate-100 italic">
                        &ldquo;{inq.message}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <a
                      href={`https://wa.me/${inq.guest_phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${inq.guest_name}, thank you for your booking inquiry on Bookmorestays for ${inq.check_in} to ${inq.check_out}. We'd love to confirm your reservation!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => updateInquiryStatus(inq.id, 'contacted')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Send size={13} /> Chat on WhatsApp
                    </a>

                    <select
                      value={inq.status || 'new'}
                      onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                      className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-2.5 py-2 outline-none cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: My Properties & 4K Shoot Requests */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">My Properties & 4K Verification</h2>
              <p className="text-xs text-slate-500">Properties with verified 4K tours receive 3.5x more direct inquiries</p>
            </div>
            <Link
              href="/admin/add-property"
              className="text-xs font-bold text-primary hover:text-blue-800 transition flex items-center gap-1"
            >
              + Add Property
            </Link>
          </div>

          <div className="space-y-3">
            {properties.map((prop) => {
              const media = getPropertyRealMedia(prop.name, prop.city);
              return (
                <div
                  key={prop.id}
                  className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0 relative border border-slate-200 shadow-xs group/img">
                      <img
                        src={media.cover}
                        alt={prop.name}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition"
                        loading="lazy"
                      />
                      {prop.video_url && (
                        <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white rounded p-0.5">
                          <Video size={10} />
                        </div>
                      )}
                    </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{prop.name}</h3>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        {prop.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="font-extrabold text-slate-900">
                        ₹{prop.direct_price?.toLocaleString('en-IN')} / night
                      </span>
                      {prop.is_verified ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={11} /> 4K Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          Pending 4K Shoot
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {!prop.is_verified && (
                      <button
                        onClick={() => handleRequest4KShoot(prop)}
                        disabled={requestingTourFor === prop.id}
                        className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        <Video size={13} />
                        <span>{requestingTourFor === prop.id ? 'Requesting...' : 'Request 4K Shoot'}</span>
                      </button>
                    )}

                    <Link
                      href={`/search?q=${encodeURIComponent(prop.name)}`}
                      target="_blank"
                      className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <ExternalLink size={13} /> View Live
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
