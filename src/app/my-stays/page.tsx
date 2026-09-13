/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Trash2, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface SavedProperty {
  id: string;
  name: string;
  city: string;
  video_url: string;
  cinematic_video_url?: string;
  images?: string[];
  direct_price: number;
  mmt_price: number;
  whatsapp_number?: string;
  is_verified?: boolean;
}

interface SavedStay {
  id: string;
  properties: SavedProperty;
}

export default function MyStaysPage() {
  const router = useRouter();
  const { currentUser, setCurrentHotelResult } = useStore();
  const [stays, setStays] = useState<SavedStay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchStays();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchStays = async () => {
    const { data, error } = await supabase
      .from('saved_stays')
      .select('id, properties(*)')
      .eq('user_id', currentUser?.id);
      
    if (data && !error) {
      setStays(data as unknown as SavedStay[]);
    }
    setLoading(false);
  };

  const removeStay = async (savedStayId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from('saved_stays').delete().eq('id', savedStayId);
    if (!error) {
      setStays(prev => prev.filter(s => s.id !== savedStayId));
      toast.success("Removed from wishlist", { icon: '🗑️' });
    } else {
      toast.error("Failed to remove property");
    }
  };

  const handleOpenStay = (prop: SavedProperty) => {
    const savings = Math.max(0, (prop.mmt_price || 0) - (prop.direct_price || 0));
    setCurrentHotelResult({
      id: prop.id,
      hotelName: prop.name,
      city: prop.city,
      direct_price: prop.direct_price,
      mmt_price: prop.mmt_price,
      video_url: prop.cinematic_video_url || prop.video_url,
      images: prop.images || [],
      hotelImage: prop.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      hasCustomVideo: true,
      is_verified: !!prop.is_verified,
      whatsapp_number: prop.whatsapp_number || '+919876543210',
      savings_amount: savings,
      savings_percentage: prop.mmt_price > 0 ? Math.round((savings / prop.mmt_price) * 100) : 0,
      whatsapp_msg: `Hi ${prop.name}, I saw your tour in my Bookmorestays wishlist. I'd like to book direct at ₹${(prop.direct_price || 0).toLocaleString('en-IN')}. Is this available?`
    });
    router.push('/search');
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 pt-12 bg-gray-50 pb-28">
      <div className="w-full mb-6">
        <h1 className="text-3xl font-extrabold text-[#1c2434] tracking-tight flex items-center gap-2">
          My Stays <Heart size={24} className="text-red-500 fill-red-500" />
        </h1>
        <p className="text-[#64748b] text-sm mt-1 font-medium">Your saved wishlist of direct luxury deals</p>
      </div>

      <div className="w-full flex-1">
        {!currentUser ? (
          <div className="mt-8 text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl">🔒</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sync Your Wishlist</h2>
            <p className="text-gray-500 text-sm mb-6">Log in with Google, Apple, or Email to keep your saved properties across all devices.</p>
            <Link href="/profile" className="inline-block px-8 py-3.5 bg-primary text-white font-bold rounded-2xl hover:bg-blue-800 transition shadow-lg shadow-primary/30 text-sm">
              Go to Profile / Login
            </Link>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="h-56 rounded-3xl bg-gray-200 animate-pulse"></div>
            <div className="h-56 rounded-3xl bg-gray-200 animate-pulse"></div>
          </div>
        ) : stays.length === 0 ? (
          <div className="mt-8 text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <span className="text-gray-400 text-2xl">🏨</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Saved Stays Yet</h2>
            <p className="text-gray-500 text-sm mb-6">Tap the heart button on any stay in the Discover feed to save it here.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-2xl hover:bg-blue-800 transition shadow-lg shadow-primary/30 text-sm">
              Explore Stays <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
            {stays.map((stay, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                key={stay.id}
                onClick={() => handleOpenStay(stay.properties)}
                className="relative h-[240px] rounded-3xl overflow-hidden shadow-md group bg-gray-900 cursor-pointer border border-gray-100 hover:shadow-xl transition-all"
              >
                {/* Remove button */}
                <button 
                  onClick={(e) => removeStay(stay.id, e)}
                  className="absolute top-3 right-3 z-20 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:text-red-400 transition shadow-md border border-white/20"
                  title="Remove from saved"
                >
                  <Trash2 size={16} />
                </button>
                
                {/* Background image / video */}
                <img 
                  src={stay.properties.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'} 
                  alt={stay.properties.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none"></div>
                
                {/* Details */}
                <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                  <h3 className="text-base font-extrabold text-white leading-tight mb-1.5 line-clamp-1 drop-shadow-md">
                    {stay.properties.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-white/80 text-xs font-semibold">
                      <MapPin size={12} className="mr-1 text-primary" />
                      {stay.properties.city}
                    </div>
                    <div className="bg-emerald-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-xl shadow-md">
                      ₹{stay.properties.direct_price?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
