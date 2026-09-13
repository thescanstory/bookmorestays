/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { supabase } from "@/lib/supabaseClient";
import { analytics } from "@/lib/analytics";
import toast from 'react-hot-toast';
import { 
  Search, X, Volume2, VolumeX, Star, Phone, MapPin, Wifi, Coffee, 
  Car, Wind, Sparkles, Camera, Send, MessageSquare, Share2, 
  Heart, Image as ImageIcon, Video, ChevronLeft, ChevronRight, ArrowRight,
  Compass, CheckCircle2, ChevronDown, ChevronUp, Filter, Calendar, Users,
  Crown, Palmtree, Castle, Waves, BedDouble, HelpCircle,
  Clock, Award, Zap, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface HotelResult {
  id?: string;
  hotelName?: string;
  city?: string;
  hotelImage?: string;
  images?: string[];
  bookingUrl?: string;
  hasCustomVideo?: boolean;
  video_url?: string;
  isInstagramReel?: boolean;
  direct_price?: number;
  mmt_price?: number;
  whatsapp_number?: string;
  is_verified?: boolean;
  savings_amount?: number;
  savings_percentage?: number;
  whatsapp_msg?: string;
  savings_logic?: string;
  official_url?: string;
  room_type?: string;
  occupancy?: string;
  amenities_highlights?: string[];
  cancellation_policy?: string;
}

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  stay_date?: string;
  created_at?: string;
  verified_booking?: boolean;
}

interface CityProperty {
  id: string;
  name: string;
  city: string;
  direct_price: number;
  mmt_price: number;
  image: string;
  images: string[];
  video_url: string;
  is_verified?: boolean;
  whatsapp_number?: string;
  rating?: number;
  reviews_count?: number;
  perks?: string[];
  category_tag?: string;
  room_type?: string;
  occupancy?: string;
  amenities_highlights?: string[];
  cancellation_policy?: string;
  host_name?: string;
  response_time?: string;
}

import { TRAITORS_COORG_MEDIA } from "@/lib/propertyMedia";

const AUDIT_STEPS = [
  "Identifying Mystery Stay Experience...",
  "Verifying Traitors Invitational Slots...",
  "Calculating BMS All-Inclusive Direct Pass..."
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: '1',
    rating: 5,
    title: 'Mindblowing Experience & Won My Full Trip Refund!',
    content: 'The Traitors game format was executed to perfection. Natural waterfall inside the resort was breathtaking, and the mystery roundtable made it unforgettable!',
    stay_date: 'Event Sep 2026',
    verified_booking: true
  },
  {
    id: '2',
    rating: 5,
    title: 'Top Tier Production & Hospitality',
    content: 'From the luxury bus pickup in Bengaluru to the artisan chocolate tasting and murder-mystery game, Bookmore Stays nailed every single detail.',
    stay_date: 'Event Sep 2026',
    verified_booking: true
  }
];

const CURATED_CITY_PROPERTIES: CityProperty[] = [
  // Primary Featured: The Traitors of Coorg
  {
    id: 'DdMP_hKGaZZ',
    name: 'The Traitors of Coorg',
    city: 'Coorg (Bengaluru <> Coorg)',
    direct_price: 14999,
    mmt_price: 21999,
    image: '/traitors/official/traitors_slide_1.jpeg',
    images: TRAITORS_COORG_MEDIA.images,
    video_url: TRAITORS_COORG_MEDIA.video_url,
    is_verified: true,
    whatsapp_number: '+919876543210',
    rating: 5.0,
    reviews_count: 482,
    perks: [
      '🏆 Winner Takes It All (100% Trip Cost Refund)',
      '🌊 Natural Waterfall Inside Resort Grounds',
      '🍫 Artisan Chocolate Factory Tour & Tasting',
      '🚌 AC Luxury Roundtrip Transfers (Bengaluru <> Coorg)'
    ],
    category_tag: 'mystery_event',
    room_type: 'Luxury Villa Suite & Waterfall Estate • 2D 1N Pass',
    occupancy: '20 Players • 3 Traitors (Solo or Duo)',
    amenities_highlights: [
      'Natural Waterfall Inside Estate',
      'Secret Roundtable Banishment Room',
      'Artisan Chocolate Factory Tour',
      'Coffee Plantation Night Missions',
      'Roundtrip Bengaluru Transfers',
      'All Gourmet Meals & Bonfire Feast'
    ],
    cancellation_policy: 'Full refund if invite unselected; Winner receives 100% trip cost back',
    host_name: 'Bookmore Stays Host (@bookmore.stays)',
    response_time: 'Instant on WhatsApp / IG DM'
  },
  {
    id: 'DajyFOri7MV',
    name: 'Nirjhara Luxury Estate',
    city: 'Coorg',
    direct_price: 18500,
    mmt_price: 24000,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80'
    ],
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-infinity-pool-in-a-luxury-hotel-4131-large.mp4',
    is_verified: true,
    whatsapp_number: '+919876543210',
    rating: 4.9,
    reviews_count: 312,
    perks: ['Free Floating Breakfast', 'Guaranteed Early Check-in', '15% Spa Voucher'],
    category_tag: 'plantation',
    room_type: 'Private Pool Villa • 3,200 sq.ft.',
    occupancy: 'Up to 4 Guests',
    amenities_highlights: ['Private Heated Pool', 'High-Speed WiFi', 'Personal Butler'],
    cancellation_policy: 'Free cancellation up to 48 hrs before check-in',
    host_name: 'Verified Estate Manager',
    response_time: 'Usually responds in 5 mins'
  },
  {
    id: 'coorg-2',
    name: 'Evolve Back Plantation Resort',
    city: 'Coorg',
    direct_price: 32000,
    mmt_price: 41000,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80'
    ],
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-curved-swimming-pool-with-palm-trees-in-a-resort-4132-large.mp4',
    is_verified: true,
    whatsapp_number: '+919876543210',
    rating: 5.0,
    reviews_count: 184,
    perks: ['Coffee Trail Tour with Naturalist', 'Complimentary 4-Course Dinner', 'Private Pool Access'],
    category_tag: 'pool_villa',
    room_type: 'Lily Pool Cottage • 2,400 sq.ft.',
    occupancy: 'Up to 3 Guests • 1 Super King Bed',
    amenities_highlights: ['Private Courtyard Pool', 'Ayurvedic Spa Access', 'Plantation View Deck'],
    cancellation_policy: 'Free cancellation up to 72 hrs before check-in',
    host_name: 'Resort General Manager',
    response_time: 'Usually responds in 10 mins'
  },
  // Udaipur
  {
    id: 'v2',
    name: 'The Leela Palace',
    city: 'Udaipur',
    direct_price: 45000,
    mmt_price: 55000,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=80'
    ],
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-small-island-with-a-luxury-hotel-4133-large.mp4',
    is_verified: true,
    whatsapp_number: '+919876543211',
    rating: 5.0,
    reviews_count: 520,
    perks: ['Lake Pichola Private Boat Arrival', 'Royal Butler Service 24/7', 'Welcome Champagne'],
    category_tag: 'heritage',
    room_type: 'Grand Heritage Lake View Room • 1,800 sq.ft.',
    occupancy: '2 Adults • Lake Pichola View',
    amenities_highlights: ['Lakefront Balcony', 'Marble Soaking Tub', 'Heritage Dining', 'Valet Parking'],
    cancellation_policy: 'Free cancellation up to 48 hrs before check-in',
    host_name: 'Palace Concierge Desk',
    response_time: 'Usually responds in 2 mins'
  },
  {
    id: 'udaipur-2',
    name: 'Oberoi Udaivilas Lake Resort',
    city: 'Udaipur',
    direct_price: 58000,
    mmt_price: 72000,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80'
    ],
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-infinity-pool-in-a-luxury-hotel-4131-large.mp4',
    is_verified: true,
    whatsapp_number: '+919876543211',
    rating: 4.9,
    reviews_count: 410,
    perks: ['Semi-Private Moat Pool Access', 'Sunset Dining Credit (₹5,000)', 'Heritage Architecture Tour'],
    category_tag: 'heritage',
    room_type: 'Premier Room with Semi-Private Pool • 2,100 sq.ft.',
    occupancy: '2 Adults + 1 Child • Pool Access',
    amenities_highlights: ['Direct Pool Step-in', 'Sunken Marble Tub', 'Palace Garden Courtyard'],
    cancellation_policy: 'Free cancellation up to 48 hrs before check-in',
    host_name: 'Oberoi Direct Reservations',
    response_time: 'Usually responds in 5 mins'
  },
  // Goa
  {
    id: 'v3',
    name: 'Taj Exotica Resort & Spa',
    city: 'Goa',
    direct_price: 22000,
    mmt_price: 28000,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop&q=80'
    ],
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-walking-on-a-beach-resort-with-palm-trees-4130-large.mp4',
    is_verified: true,
    whatsapp_number: '+919876543212',
    rating: 4.9,
    reviews_count: 295,
    perks: ['Private Beachfront Cabana Access', 'Jiva Spa Voucher (₹2,500)', 'Sunset Cocktail Hour'],
    category_tag: 'beach',
    room_type: 'Luxury Beachfront Villa with Plunge Pool • 2,800 sq.ft.',
    occupancy: 'Up to 4 Guests • Sea View',
    amenities_highlights: ['Direct Beach Access', 'Private Plunge Pool', 'Outdoor Rain Shower', 'High-Speed WiFi'],
    cancellation_policy: 'Free cancellation up to 48 hrs before check-in',
    host_name: 'Taj Goa Direct Team',
    response_time: 'Usually responds in 5 mins'
  },
  {
    id: 'goa-2',
    name: 'W Goa Luxury Beachfront',
    city: 'Goa',
    direct_price: 26500,
    mmt_price: 34000,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80'
    ],
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-curved-swimming-pool-with-palm-trees-in-a-resort-4132-large.mp4',
    is_verified: true,
    whatsapp_number: '+919876543212',
    rating: 4.8,
    reviews_count: 178,
    perks: ['Rockpool VIP Sunset Entry', 'Free Floating Villa Breakfast', 'Guaranteed 4 PM Late Checkout'],
    category_tag: 'beach',
    room_type: 'Marvelous Chalet • Vagator Cliff View • 1,900 sq.ft.',
    occupancy: '2 Adults • Sunset View',
    amenities_highlights: ['Rockpool VIP Access', 'Deep Soaking Bathtub', 'Bose Sound System', 'Private Terrace'],
    cancellation_policy: 'Free cancellation up to 48 hrs before check-in',
    host_name: 'W Insider Concierge',
    response_time: 'Usually responds in 3 mins'
  },
  // Chikmagalur
  {
    id: 'chik-1',
    name: 'The Serai Luxury Coffee Resort',
    city: 'Chikmagalur',
    direct_price: 14042,
    mmt_price: 17417,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80'
    ],
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    is_verified: true,
    whatsapp_number: '+919876543210',
    rating: 4.9,
    reviews_count: 220,
    perks: ['Private Jacuzzi Villa', 'Estate Plantation Walk with Master Roaster', 'Night Bonfire & BBQ'],
    category_tag: 'plantation',
    room_type: 'Estate Villa with Private Jacuzzi • 2,200 sq.ft.',
    occupancy: 'Up to 3 Guests • Coffee Plantation View',
    amenities_highlights: ['Open-air Jacuzzi', 'Coffee Bar', 'Private Lawn', 'Nature Trail'],
    cancellation_policy: 'Free cancellation up to 48 hrs before check-in',
    host_name: 'Serai Resort Concierge',
    response_time: 'Usually responds in 10 mins'
  },
  // Kabini
  {
    id: 'kabini-1',
    name: 'Kabini River Safari & Beach House',
    city: 'Kabini',
    direct_price: 12850,
    mmt_price: 15441,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80'
    ],
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-infinity-pool-in-a-luxury-hotel-4131-large.mp4',
    is_verified: true,
    whatsapp_number: '+919876543210',
    rating: 4.9,
    reviews_count: 360,
    perks: ['Priority Jungle Safari Slot Booking', 'Coracle Boat Ride on River', 'Free High Tea & Bonfire'],
    category_tag: 'pool_villa',
    room_type: 'Riverfront Safari Hut with Plunge Pool • 2,000 sq.ft.',
    occupancy: 'Up to 3 Guests • Kabini River View',
    amenities_highlights: ['Riverfront Deck', 'Wildlife Viewing Telescope', 'Private Plunge Pool'],
    cancellation_policy: 'Free cancellation up to 48 hrs before check-in',
    host_name: 'Wildlife Resort Manager',
    response_time: 'Usually responds in 10 mins'
  },
  // Belgaum
  {
    id: 'belgaum-1',
    name: 'Rustic Forest Manor & Spa',
    city: 'Belgaum',
    direct_price: 12359,
    mmt_price: 14918,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80'
    ],
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    is_verified: true,
    whatsapp_number: '+919876543210',
    rating: 4.8,
    reviews_count: 142,
    perks: ['Organic Farm to Table Breakfast', 'Complimentary Mountain Bikes', 'Late 3 PM Checkout'],
    category_tag: 'plantation',
    room_type: 'Valley View Heritage Suite • 1,650 sq.ft.',
    occupancy: '2 Adults • Valley View',
    amenities_highlights: ['Organic Orchard', 'Wood-fired Fireplace', 'Valley Balcony'],
    cancellation_policy: 'Free cancellation up to 48 hrs before check-in',
    host_name: 'Manor Host',
    response_time: 'Usually responds in 10 mins'
  }
];

const SPECIAL_FARES = [
  { id: 'vip', label: '👑 BMS Direct VIP', perk: 'Free Floating Breakfast + Early Check-in' },
  { id: 'couples', label: '💑 Couples / Honeymoon', perk: 'Candlelight dinner setup & pool villa' },
  { id: 'villa', label: '🏡 Entire Luxury Villa', perk: 'Ideal for 4+ family & friends' },
  { id: 'workation', label: '💼 Workation / Long Stay', perk: 'High-speed Wi-Fi & quiet space' },
  { id: 'pet', label: '🐾 Pet Friendly', perk: 'Pet friendly estate & gardens' },
];

const FAQ_ITEMS = [
  {
    question: "How does BMS offer lower rates than MakeMyTrip or Booking.com?",
    answer: "Online Travel Agencies (OTAs) charge hotels 18% to 25% commission plus customer convenience fees. BMS bypasses these middlemen by connecting you directly to verified resort managers, passing the full savings and complimentary VIP perks directly to you."
  },
  {
    question: "Are the free perks like Floating Breakfast & Early Check-in guaranteed?",
    answer: "Yes! Every property marked 'BMS Verified' has an official partnership agreement. When you book directly through our concierge or direct link, your VIP perks are written into your reservation confirmation."
  },
  {
    question: "What is the 4K Verified Room Guarantee?",
    answer: "Our cinematography team travels on-site to film full unedited 4K walkthroughs of the exact villas and suites. If the room doesn't match the cinematic tour when you arrive, our direct concierge will rebook you or refund your difference."
  },
  {
    question: "How do payments and cancellations work?",
    answer: "You pay directly to the official property bank/payment gateway with 100% safety. Most luxury stays offer Free Cancellation up to 48 hours prior to check-in."
  }
];

function SearchContent() {
  const [searchMode, setSearchMode] = useState<'url' | 'dates'>('url');
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // MMT Style Date & Guest Selector State
  const [searchCity, setSearchCity] = useState("All");
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [guestCount, setGuestCount] = useState(2);
  const [selectedSpecialFare, setSelectedSpecialFare] = useState('vip');
  const [themeFilter, setThemeFilter] = useState<'all' | 'beach' | 'heritage' | 'pool_villa' | 'plantation'>('all');

  // City categorization & filters state
  const [selectedCityTab, setSelectedCityTab] = useState<string>('All');
  const [catalogProperties, setCatalogProperties] = useState<CityProperty[]>(CURATED_CITY_PROPERTIES);
  const [savedIdsMap, setSavedIdsMap] = useState<Record<string, boolean>>({});

  // Sub-filters below city
  const [cityPriceFilter, setCityPriceFilter] = useState<'all' | 'under15k' | '15k-30k' | 'above30k'>('all');
  const [citySortBy, setCitySortBy] = useState<'recommended' | 'savings' | 'price_asc' | 'price_desc'>('recommended');
  const [verifiedFilter, setVerifiedFilter] = useState<boolean>(false);
  const [breakfastFilter, setBreakfastFilter] = useState<boolean>(false);
  const [highSavingsFilter, setHighSavingsFilter] = useState<boolean>(false);

  const hasActiveCityFilters = cityPriceFilter !== 'all' || verifiedFilter || breakfastFilter || highSavingsFilter || citySortBy !== 'recommended' || themeFilter !== 'all';

  const resetCityFilters = () => {
    setCityPriceFilter('all');
    setVerifiedFilter(false);
    setBreakfastFilter(false);
    setHighSavingsFilter(false);
    setThemeFilter('all');
    setCitySortBy('recommended');
  };

  // Inquiry & Review States
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    check_in: checkInDate,
    check_out: checkOutDate,
    guests: guestCount,
    message: ''
  });

  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    content: '',
    stay_date: ''
  });

  const [detailMediaTab, setDetailMediaTab] = useState<'video' | 'photos'>('video');
  const [detailPhotoIdx, setDetailPhotoIdx] = useState(0);

  const { currentUser, currentHotelResult, setCurrentHotelResult, sharedUrl, setSharedUrl } = useStore();
  const result = currentHotelResult as HotelResult | null;
  const searchParams = useSearchParams();

  // Calculate nights
  const nightsCount = useMemo(() => {
    try {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 1;
    } catch {
      return 1;
    }
  }, [checkInDate, checkOutDate]);

  // Load database properties and merge with curated cities
  useEffect(() => {
    async function loadPropertiesFromDB() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(40);

        if (data && data.length > 0 && !error) {
          const dbProps: CityProperty[] = data.map((p, idx) => {
            const fallbackProp = CURATED_CITY_PROPERTIES[idx % CURATED_CITY_PROPERTIES.length];
            return {
              id: p.id,
              name: p.name,
              city: p.city || 'India',
              direct_price: p.direct_price || 20000,
              mmt_price: p.mmt_price || Math.round((p.direct_price || 20000) * 1.25),
              image: p.images?.[0] || fallbackProp.image,
              images: p.images && p.images.length > 0 ? p.images : fallbackProp.images,
              video_url: p.cinematic_video_url || p.video_url || fallbackProp.video_url,
              is_verified: !!p.is_verified,
              whatsapp_number: p.whatsapp_number || '+919876543210',
              rating: 4.9,
              reviews_count: 150 + (idx * 12),
              perks: ['BMS Direct Rate Guarantee', 'Free Floating Breakfast (₹3,000 value)', 'VIP Concierge'],
              category_tag: idx % 2 === 0 ? 'pool_villa' : 'beach',
              room_type: fallbackProp.room_type || 'Luxury Suite • 2,000 sq.ft.',
              occupancy: fallbackProp.occupancy || 'Up to 4 Guests',
              amenities_highlights: fallbackProp.amenities_highlights || ['Private Pool', 'High-speed WiFi', 'Breakfast Included'],
              cancellation_policy: fallbackProp.cancellation_policy || 'Free cancellation up to 48 hrs before check-in',
              host_name: fallbackProp.host_name || 'Verified Property Manager',
              response_time: 'Usually responds in 5 mins'
            };
          });

          // Deduplicate by name
          const existingNames = new Set(dbProps.map(dp => dp.name.toLowerCase()));
          const extraCurated = CURATED_CITY_PROPERTIES.filter(cp => !existingNames.has(cp.name.toLowerCase()));
          setCatalogProperties([...dbProps, ...extraCurated]);
        }
      } catch (err) {
        console.debug("Using default curated city properties", err);
      }
    }
    loadPropertiesFromDB();
  }, []);

  // Fetch saved wishlist IDs if logged in
  useEffect(() => {
    if (currentUser) {
      supabase.from('saved_stays').select('property_id').eq('user_id', currentUser.id).then(({ data }) => {
        if (data) {
          const map: Record<string, boolean> = {};
          data.forEach(item => { if (item.property_id) map[item.property_id] = true; });
          setSavedIdsMap(map);
        }
      });
    }
  }, [currentUser]);

  // Distinct city list with counts
  const cityCategories = useMemo(() => {
    const counts: Record<string, number> = { All: catalogProperties.length };
    catalogProperties.forEach(p => {
      const c = p.city ? p.city.split(',')[0].trim() : 'India';
      counts[c] = (counts[c] || 0) + 1;
    });

    const orderedCities = ['All', 'Coorg', 'Udaipur', 'Goa', 'Chikmagalur', 'Kabini', 'Belgaum'];
    const restCities = Object.keys(counts).filter(c => !orderedCities.includes(c));
    return [...orderedCities.filter(c => counts[c] !== undefined), ...restCities].map(c => ({
      name: c,
      count: counts[c] || 0
    }));
  }, [catalogProperties]);

  // Filtered and sorted properties for active city tab & filters
  const filteredCityProperties = useMemo(() => {
    let list = [...catalogProperties];

    // City Tab
    const effectiveCity = searchMode === 'dates' && searchCity !== 'All' ? searchCity : selectedCityTab;
    if (effectiveCity !== 'All') {
      list = list.filter(p => p.city.toLowerCase().includes(effectiveCity.toLowerCase()));
    }

    // Theme / Category Tag Filter (MMT style)
    if (themeFilter !== 'all') {
      list = list.filter(p => p.category_tag === themeFilter || (themeFilter === 'pool_villa' && p.perks?.some(pk => pk.toLowerCase().includes('pool'))));
    }

    // Price Tier
    if (cityPriceFilter === 'under15k') {
      list = list.filter(p => p.direct_price < 15000);
    } else if (cityPriceFilter === '15k-30k') {
      list = list.filter(p => p.direct_price >= 15000 && p.direct_price <= 30000);
    } else if (cityPriceFilter === 'above30k') {
      list = list.filter(p => p.direct_price > 30000);
    }

    // 4K Verified
    if (verifiedFilter) {
      list = list.filter(p => p.is_verified);
    }

    // Free Floating Breakfast
    if (breakfastFilter) {
      list = list.filter(p => p.perks?.some(pk => pk.toLowerCase().includes('breakfast')));
    }

    // High Savings (>20%)
    if (highSavingsFilter) {
      list = list.filter(p => {
        const savings = Math.max(0, p.mmt_price - p.direct_price);
        return p.mmt_price > 0 && (savings / p.mmt_price) >= 0.20;
      });
    }

    // Sorting
    if (citySortBy === 'savings') {
      list.sort((a, b) => (b.mmt_price - b.direct_price) - (a.mmt_price - a.direct_price));
    } else if (citySortBy === 'price_asc') {
      list.sort((a, b) => a.direct_price - b.direct_price);
    } else if (citySortBy === 'price_desc') {
      list.sort((a, b) => b.direct_price - a.direct_price);
    }

    return list;
  }, [catalogProperties, selectedCityTab, searchCity, searchMode, themeFilter, cityPriceFilter, verifiedFilter, breakfastFilter, highSavingsFilter, citySortBy]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setAuditStep(0);
      timer = setInterval(() => {
        setAuditStep((prev) => (prev < AUDIT_STEPS.length - 1 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  // Auto-search if query param q is present
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam && !currentHotelResult) {
      setLink(queryParam);
      handleSearch(queryParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (sharedUrl) {
      setLink(sharedUrl);
      handleSearch(sharedUrl);
      setSharedUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedUrl, setSharedUrl]);

  // Check if saved & load property reviews
  useEffect(() => {
    if (result?.id) {
      if (currentUser) {
        supabase.from('saved_stays').select('id').eq('property_id', result.id).eq('user_id', currentUser.id).then(({ data }) => {
          setIsSaved(!!data && data.length > 0);
        });
      }

      // Fetch reviews
      supabase.from('reviews').select('*').eq('property_id', result.id).order('created_at', { ascending: false }).then(({ data, error }) => {
        if (data && data.length > 0 && !error) {
          setReviews(data as Review[]);
        } else {
          setReviews(DEFAULT_REVIEWS);
        }
      });
    }
  }, [result, currentUser]);

  useEffect(() => {
    if (result && result.savings_amount && result.savings_amount > 0) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#10B981', '#ffffff']
      });
    }
  }, [result]);

  const handleSearch = async (overrideUrl?: string) => {
    let targetUrl = typeof overrideUrl === 'string' ? overrideUrl : link;
    targetUrl = targetUrl.trim();
    if (!targetUrl) return;

    let searchQuery = targetUrl;
    try {
      if (targetUrl.includes('instagram.com') || targetUrl.includes('tiktok.com') || targetUrl.startsWith('http')) {
        const urlObj = new URL(targetUrl);
        searchQuery = urlObj.pathname;
        if (searchQuery.endsWith('/')) searchQuery = searchQuery.slice(0, -1);
        const parts = searchQuery.split('/');
        searchQuery = parts[parts.length - 1];
      }
    } catch {
      // Not a valid URL, keep searchQuery as is
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl, query: searchQuery })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract hotel details.');
      }

      const savingsAmount = Math.max(0, (data.mmt_price || 0) - (data.direct_price || 0));
      const savingsPercentage = data.mmt_price > 0 ? Math.round((savingsAmount / data.mmt_price) * 100) : 0;

      const formattedResult: HotelResult = {
        ...data,
        savings_amount: savingsAmount,
        savings_percentage: savingsPercentage,
        whatsapp_msg: `Hi ${data.hotelName}, I saw your 4K tour on Bookmorestays. I'd like to book direct for ${nightsCount} nights (${checkInDate} to ${checkOutDate}) for ${guestCount} guests at ₹${(data.direct_price || 20000).toLocaleString('en-IN')}. Is this available?`,
        room_type: 'Luxury Pool Villa • 2,800 sq.ft.',
        occupancy: `${guestCount} Guests • King Bed`,
        amenities_highlights: ['Private Pool', 'High-speed WiFi', 'Free Breakfast', 'Jacuzzi'],
        cancellation_policy: 'Free cancellation up to 48 hrs before check-in'
      };

      setCurrentHotelResult(formattedResult);
      analytics.search(targetUrl, data.hotelName || 'Unknown Stay');
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Error communicating with extraction engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCityProperty = (prop: CityProperty) => {
    const savingsAmount = Math.max(0, prop.mmt_price - prop.direct_price);
    const savingsPercentage = prop.mmt_price > 0 ? Math.round((savingsAmount / prop.mmt_price) * 100) : 0;

    const isTraitors = prop.id === 'DdMP_hKGaZZ' || prop.name.toLowerCase().includes('traitors');
    const customMsg = isTraitors
      ? `Hi Bookmorestays, I would like to request an invite for 'The Traitors of Coorg' (Sep 26-27). Please share available slots & details!`
      : `Hi ${prop.name}, I saw your tour on Bookmorestays. I'd like to book direct for ${nightsCount} nights (${checkInDate} to ${checkOutDate}) for ${guestCount} guests at ₹${prop.direct_price.toLocaleString('en-IN')}. Is this available?`;

    const formattedResult: HotelResult = {
      id: prop.id,
      hotelName: prop.name,
      city: prop.city,
      hotelImage: prop.image,
      images: prop.images,
      video_url: prop.video_url,
      hasCustomVideo: true,
      direct_price: prop.direct_price,
      mmt_price: prop.mmt_price,
      is_verified: prop.is_verified,
      whatsapp_number: prop.whatsapp_number || '+919876543210',
      savings_amount: savingsAmount,
      savings_percentage: savingsPercentage,
      whatsapp_msg: customMsg,
      room_type: prop.room_type,
      occupancy: prop.occupancy,
      amenities_highlights: prop.amenities_highlights,
      cancellation_policy: prop.cancellation_policy
    };

    setCurrentHotelResult(formattedResult);
    analytics.propertyView(prop.id, prop.name, 'search');
  };

  const toggleSaveCityProperty = async (prop: CityProperty, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCurrentlySaved = !!savedIdsMap[prop.id];
    setSavedIdsMap(prev => ({ ...prev, [prop.id]: !isCurrentlySaved }));

    if (!currentUser) {
      toast.success(isCurrentlySaved ? "Removed from wishlist" : "Added to wishlist! (Log in to sync)", { icon: '❤️' });
      return;
    }

    if (isCurrentlySaved) {
      await supabase.from('saved_stays').delete().eq('property_id', prop.id).eq('user_id', currentUser.id);
      analytics.unsave(prop.id, prop.name);
      toast.success("Removed from wishlist");
    } else {
      await supabase.from('saved_stays').insert({ property_id: prop.id, user_id: currentUser.id });
      analytics.save(prop.id, prop.name);
      toast.success("Saved to your wishlist!", { icon: '❤️' });
    }
  };

  const toggleSave = async () => {
    if (!currentUser) {
      toast.error("Please log in to save properties.");
      return;
    }
    if (!result?.id) return;

    if (isSaved) {
      const { error } = await supabase.from('saved_stays').delete().eq('property_id', result.id).eq('user_id', currentUser.id);
      if (!error) {
        setIsSaved(false);
        setSavedIdsMap(prev => ({ ...prev, [result.id!]: false }));
        toast.success("Removed from wishlist");
      }
    } else {
      const { error } = await supabase.from('saved_stays').insert({ property_id: result.id, user_id: currentUser.id });
      if (!error) {
        setIsSaved(true);
        setSavedIdsMap(prev => ({ ...prev, [result.id!]: true }));
        analytics.save(result.id, result.hotelName || 'Stay');
        toast.success("Saved to wishlist!", { icon: '❤️' });
      } else {
        toast.error("Failed to save property.");
      }
    }
  };

  const handleRequestTour = async () => {
    if (!result?.hotelName) return;
    try {
      await supabase.from('tour_requests').insert({
        property_name: result.hotelName,
        city: result.city || 'Unknown',
        requested_by: currentUser?.id || null
      });
      analytics.tourRequest(result.hotelName, result.city || 'Unknown');
      toast.success("Tour requested! Our team has been notified.", { icon: '🎥' });
    } catch {
      toast.error("Failed to request tour.");
    }
  };

  const handleShareResult = async () => {
    if (!result?.hotelName) return;
    const shareUrl = `${window.location.origin}/search?q=${encodeURIComponent(result.hotelName)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Direct Booking: ${result.hotelName}`,
          text: `Save ₹${(result.savings_amount || 0).toLocaleString('en-IN')} on direct booking for ${result.hotelName}!`,
          url: shareUrl
        });
      } catch {
        // Ignored
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!", { icon: '🔗' });
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    setInquirySubmitting(true);

    try {
      const { error } = await supabase.from('inquiries').insert({
        property_id: result.id || null,
        user_id: currentUser?.id || null,
        guest_name: inquiryForm.guest_name,
        guest_email: inquiryForm.guest_email,
        guest_phone: inquiryForm.guest_phone,
        check_in: inquiryForm.check_in,
        check_out: inquiryForm.check_out,
        guests: inquiryForm.guests,
        message: inquiryForm.message,
        quoted_price: result.direct_price || null,
        status: 'new'
      });

      if (error) throw error;

      analytics.inquiry(result.id || 'unknown', result.hotelName || 'Stay', inquiryForm.check_in, inquiryForm.check_out, inquiryForm.guests);
      setShowInquiryModal(false);
      toast.success("Inquiry sent to property manager! They will reach out shortly.", { icon: '🎉', duration: 4000 });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err: unknown) {
      const e = err as Error;
      toast.error(e.message || "Failed to submit inquiry.");
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    setReviewSubmitting(true);

    try {
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        rating: reviewForm.rating,
        title: reviewForm.title,
        content: reviewForm.content,
        stay_date: reviewForm.stay_date || new Date().toISOString().split('T')[0],
        verified_booking: true
      };

      if (supabase && result.id) {
        await supabase.from('reviews').insert({
          property_id: result.id,
          user_id: currentUser?.id || null,
          rating: reviewForm.rating,
          title: reviewForm.title,
          content: reviewForm.content,
          stay_date: reviewForm.stay_date || new Date().toISOString().split('T')[0],
          verified_booking: true
        });
      }

      setReviews(prev => [newReview, ...prev]);
      setShowReviewModal(false);
      setReviewForm({ rating: 5, title: '', content: '', stay_date: '' });
      toast.success("Review published! Thanks for sharing your feedback.", { icon: '⭐' });
    } catch (err: unknown) {
      const e = err as Error;
      toast.error(e.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const closeResult = () => {
    setCurrentHotelResult(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  // Average Rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '4.9';

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 pt-10 bg-slate-50 pb-28 text-slate-900 font-sans">
      <div className="w-full max-w-md">
        
        {/* Header with Blue Brand & Rate Guarantee Tag */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              <ShieldCheck size={13} className="text-primary" /> Direct Rate Guarantee
            </span>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
              ₹0 OTA Fees
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Discover Stays
          </h1>
          <p className="text-slate-500 font-medium text-xs tracking-normal mt-1 leading-relaxed">
            Unlock direct hotel rates vs MakeMyTrip pricing & VIP perks.
          </p>
        </div>

        {/* Dual Mode Switcher (MMT Flight/Hotel style with crisp blue highlights) */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl mb-4 border border-slate-300/40">
          <button
            onClick={() => setSearchMode('url')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              searchMode === 'url' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles size={14} className={searchMode === 'url' ? 'text-primary' : ''} />
            <span>Reel / Link Audit</span>
          </button>
          <button
            onClick={() => setSearchMode('dates')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              searchMode === 'dates' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar size={14} className={searchMode === 'dates' ? 'text-primary' : ''} />
            <span>Book Dates &amp; Fares</span>
          </button>
        </div>

        {/* Mode 1: URL / Reel Input */}
        {searchMode === 'url' ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-3.5 flex flex-col space-y-3 relative z-10">
            <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
              <Search className="text-slate-400 mr-3 flex-shrink-0" size={18} />
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste Instagram reel, web link, or hotel name..."
                className="w-full bg-transparent outline-none text-slate-900 placeholder-slate-400 font-medium text-xs sm:text-sm"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={isLoading || !link.trim()}
              className="w-full bg-primary hover:bg-blue-700 text-white rounded-2xl py-3.5 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/25 text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Sparkles size={15} />
              <span>Audit Direct Rate vs MakeMyTrip</span>
            </button>
          </div>
        ) : (
          /* Mode 2: MakeMyTrip Full Date, City & Guest Search Widget */
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-4 space-y-3.5 relative z-10">
            {/* Destination Selector */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                City / Destination
              </label>
              <div className="relative">
                <select
                  value={searchCity}
                  onChange={(e) => {
                    setSearchCity(e.target.value);
                    setSelectedCityTab(e.target.value);
                  }}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-8 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                >
                  <option value="All">All Popular Destinations</option>
                  <option value="Coorg">Coorg, Karnataka (4 Stays)</option>
                  <option value="Udaipur">Udaipur, Rajasthan (2 Stays)</option>
                  <option value="Goa">Goa Beachfront (5 Stays)</option>
                  <option value="Chikmagalur">Chikmagalur Coffee Estate (3 Stays)</option>
                  <option value="Kabini">Kabini Safari Reserve (3 Stays)</option>
                  <option value="Belgaum">Belgaum Forest Valley (4 Stays)</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Check-in & Check-out Date Pickers */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  Check-in
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5">
                  <Calendar size={14} className="text-primary mr-2 flex-shrink-0" />
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => {
                      setCheckInDate(e.target.value);
                      setInquiryForm(prev => ({ ...prev, check_in: e.target.value }));
                    }}
                    className="w-full bg-transparent text-[11px] font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex justify-between">
                  <span>Check-out</span>
                  <span className="text-primary font-bold">{nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'}</span>
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5">
                  <Calendar size={14} className="text-primary mr-2 flex-shrink-0" />
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => {
                      setCheckOutDate(e.target.value);
                      setInquiryForm(prev => ({ ...prev, check_out: e.target.value }));
                    }}
                    className="w-full bg-transparent text-[11px] font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Guests & Room Type */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                Guests &amp; Rooms
              </label>
              <div className="relative">
                <select
                  value={guestCount}
                  onChange={(e) => {
                    setGuestCount(Number(e.target.value));
                    setInquiryForm(prev => ({ ...prev, guests: Number(e.target.value) }));
                  }}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-8 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                >
                  <option value={1}>1 Adult • Single Room</option>
                  <option value={2}>2 Adults • 1 Room (Couples / Twin)</option>
                  <option value={3}>3 Adults • 1 Room (Extra Bed)</option>
                  <option value={4}>4 Guests • 2 Rooms (Family Suite)</option>
                  <option value={6}>6+ Guests • Entire Private Villa</option>
                </select>
                <Users size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Special Fare Badges (MMT Style) */}
            <div>
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                Select Special Direct Rate Category
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
                {SPECIAL_FARES.map((fare) => (
                  <button
                    key={fare.id}
                    onClick={() => {
                      setSelectedSpecialFare(fare.id);
                      toast.success(`Applied ${fare.label}: ${fare.perk}`, { icon: '✨', duration: 2500 });
                    }}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer border ${
                      selectedSpecialFare === fare.id
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {fare.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BMS vs MakeMyTrip Fare Lock Guarantee Banner */}
        <div className="mt-4 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 rounded-3xl p-4 text-white shadow-md flex items-center justify-between border border-blue-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
              <Crown size={18} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                BMS Direct Rate Guarantee
              </span>
              <p className="text-xs font-bold text-white tracking-normal">Save 20-35% vs MakeMyTrip Rates</p>
            </div>
          </div>
          <span className="text-[10px] font-black bg-emerald-500 text-white px-2.5 py-1 rounded-xl shadow-sm">
            ₹0 FEE
          </span>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Loading State - Scanning */}
        {isLoading && (
          <div className="mt-12 flex flex-col items-center justify-center animate-pulse">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-emerald-500 animate-spin animation-delay-150"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-primary" size={24} />
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">{AUDIT_STEPS[auditStep]}</h3>
            <p className="text-slate-500 text-xs">Extracting direct rate &amp; perks...</p>
          </div>
        )}

        {/* City Categories & Properties Section */}
        {!isLoading && !result && (
          <div className="mt-7 space-y-6">
            {/* Section Heading */}
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                  <Compass size={13} /> Handpicked Stays
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
                  Explore by City
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {filteredCityProperties.length} Properties
              </span>
            </div>

            {/* City Category Pills / Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar -mx-1 px-1">
              {cityCategories.map((city) => (
                <button
                  key={city.name}
                  onClick={() => setSelectedCityTab(city.name)}
                  className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCityTab === city.name
                      ? 'bg-primary text-white shadow-md shadow-primary/20 scale-100'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{city.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedCityTab === city.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {city.count}
                  </span>
                </button>
              ))}
            </div>

            {/* MMT-Style Collection Theme Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 hide-scrollbar -mx-1 px-1">
              {[
                { id: 'all', label: 'All Collections', icon: Palmtree },
                { id: 'beach', label: 'Beachfront Resorts', icon: Waves },
                { id: 'heritage', label: 'Heritage Palaces', icon: Castle },
                { id: 'pool_villa', label: 'Private Pool Villas', icon: Waves },
                { id: 'plantation', label: 'Coffee Plantations', icon: Coffee },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setThemeFilter(theme.id as typeof themeFilter)}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                    themeFilter === theme.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <theme.icon size={12} className={themeFilter === theme.id ? 'text-white' : 'text-primary'} />
                  <span>{theme.label}</span>
                </button>
              ))}
            </div>

            {/* Filters & Sorting Dropdown Bar Below City */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3.5">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Filter size={13} className="text-primary" />
                  <span className="text-xs font-bold text-slate-900 tracking-tight">Filter Stays</span>
                </div>
                {hasActiveCityFilters && (
                  <button
                    onClick={resetCityFilters}
                    className="text-[11px] font-bold text-primary hover:text-blue-800 transition flex items-center gap-1 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              {/* Dropdowns Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Dropdown 1: PRICE / NIGHT */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Price / Night
                  </label>
                  <div className="relative">
                    <select
                      value={cityPriceFilter}
                      onChange={(e) => setCityPriceFilter(e.target.value as typeof cityPriceFilter)}
                      className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
                    >
                      <option value="all">PRICE / NIGHT: All</option>
                      <option value="under15k">&lt; ₹15k</option>
                      <option value="15k-30k">₹15k-30k</option>
                      <option value="above30k">&gt; ₹30k</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                {/* Dropdown 2: SPECIAL PERKS */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Special Perks
                  </label>
                  <div className="relative">
                    <select
                      value={
                        verifiedFilter
                          ? 'verified'
                          : breakfastFilter
                          ? 'breakfast'
                          : highSavingsFilter
                          ? 'savings'
                          : 'all'
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'verified') {
                          setVerifiedFilter(true);
                          setBreakfastFilter(false);
                          setHighSavingsFilter(false);
                        } else if (val === 'breakfast') {
                          setVerifiedFilter(false);
                          setBreakfastFilter(true);
                          setHighSavingsFilter(false);
                        } else if (val === 'savings') {
                          setVerifiedFilter(false);
                          setBreakfastFilter(false);
                          setHighSavingsFilter(true);
                        } else {
                          setVerifiedFilter(false);
                          setBreakfastFilter(false);
                          setHighSavingsFilter(false);
                        }
                      }}
                      className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
                    >
                      <option value="all">All Perks &amp; Features</option>
                      <option value="verified">✨ 4K Verified</option>
                      <option value="breakfast">🥞 Free Breakfast</option>
                      <option value="savings">🏷️ 20%+ Off</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                {/* Dropdown 3: SORT BY */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      value={citySortBy}
                      onChange={(e) => setCitySortBy(e.target.value as typeof citySortBy)}
                      className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
                    >
                      <option value="recommended">⚡ Recommended</option>
                      <option value="savings">💰 Biggest Savings</option>
                      <option value="price_asc">📉 Price: Low to High</option>
                      <option value="price_desc">📈 Price: High to Low</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* No Results state for City Filters */}
            {filteredCityProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                  <Search size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-900">No properties match your filters</h3>
                <p className="text-xs text-slate-500">Try changing the price range or resetting feature toggles.</p>
                <button
                  onClick={resetCityFilters}
                  className="px-5 py-2.5 bg-primary text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition shadow-md shadow-primary/20 cursor-pointer"
                >
                  Reset City Filters
                </button>
              </div>
            ) : (
              /* Curated Properties Card Grid with Clear Spacing */
              <div className="grid grid-cols-1 gap-5">
                {filteredCityProperties.map((prop) => {
                  const savings = Math.max(0, prop.mmt_price - prop.direct_price);
                  const savingsPct = prop.mmt_price > 0 ? Math.round((savings / prop.mmt_price) * 100) : 0;
                  const isItemSaved = !!savedIdsMap[prop.id];

                  return (
                    <motion.div
                      key={prop.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => handleSelectCityProperty(prop)}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer"
                    >
                      {/* Property Cover Image with Badges */}
                      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                        <img
                          src={prop.image}
                          alt={prop.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center z-10">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                              <MapPin size={11} className="text-primary" />
                              {prop.city}
                            </span>
                            {prop.is_verified && (
                              <span className="bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1">
                                <Sparkles size={10} className="text-emerald-400" />
                                4K Verified Room Match
                              </span>
                            )}
                          </div>

                          {/* Save Heart Button */}
                          <button
                            onClick={(e) => toggleSaveCityProperty(prop, e)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md ${
                              isItemSaved ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                            }`}
                            title="Save to Wishlist"
                          >
                            <Heart size={16} className={isItemSaved ? 'fill-white' : ''} />
                          </button>
                        </div>

                        {/* Bottom Image Overlay: Property Name, Room Type, Rating & Savings */}
                        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 pointer-events-none">
                          <h3 className="text-white font-extrabold text-lg leading-snug drop-shadow-md line-clamp-1 tracking-tight">
                            {prop.name}
                          </h3>
                          {prop.room_type && (
                            <p className="text-white/85 text-[11px] font-medium flex items-center gap-1 mt-0.5">
                              <BedDouble size={11} className="text-blue-300" />
                              {prop.room_type}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-emerald-300 text-[11px] font-black bg-emerald-950/90 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                              Save ₹{savings.toLocaleString('en-IN')} ({savingsPct}% OFF)
                            </span>
                            <span className="text-white/90 text-[11px] font-bold flex items-center gap-0.5">
                              <Star size={11} className="text-amber-400 fill-amber-400" />
                              {prop.rating || 4.9} ({prop.reviews_count || 120} reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Body - Deep Detailed Specs */}
                      <div className="p-4 space-y-3.5">
                        
                        {/* Highlights & Occupancy Spec */}
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                          <span className="flex items-center gap-1.5">
                            <Users size={13} className="text-slate-400" />
                            {prop.occupancy || 'Up to 4 Guests'}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-700 font-bold">
                            <Zap size={13} className="text-emerald-600" />
                            {prop.cancellation_policy || 'Free Cancellation (48 hrs)'}
                          </span>
                        </div>

                        {/* Direct Perks Pills */}
                        {prop.perks && prop.perks.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                              Exclusive Direct Booking Inclusions
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {prop.perks.map((perk, pIdx) => (
                                <span
                                  key={pIdx}
                                  className="inline-flex items-center text-[10px] font-bold text-slate-800 bg-blue-50/70 border border-blue-100 px-2.5 py-1 rounded-xl"
                                >
                                  <CheckCircle2 size={10} className="text-primary mr-1 flex-shrink-0" />
                                  {perk}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Rate Comparison Card */}
                        <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                                BMS Direct Rate
                              </span>
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">
                                ₹0 FEE
                              </span>
                            </div>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-2xl font-black text-slate-900 tracking-tight">
                                {formatPrice(prop.direct_price)}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">/ night</span>
                            </div>
                            {prop.mmt_price > prop.direct_price && (
                              <span className="text-[10px] text-red-500 font-semibold line-through mt-0.5">
                                {formatPrice(prop.mmt_price)} on MakeMyTrip
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/${prop.whatsapp_number?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${prop.name}, I saw your direct rate of ₹${prop.direct_price.toLocaleString('en-IN')} on Bookmorestays. Is this available for my dates?`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center transition shadow-sm cursor-pointer"
                              title="Chat with Resort Manager"
                            >
                              <Send size={15} />
                            </a>
                            <button
                              onClick={() => handleSelectCityProperty(prop)}
                              className="bg-primary hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md shadow-primary/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                            >
                              View Direct Rate <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Why Book Direct vs MakeMyTrip Comparison Table */}
            <div className="mt-8 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Why Book Direct with BMS?</h3>
                  <p className="text-[11px] text-slate-500">Transparent comparison vs Online Travel Agencies</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="pb-2">Feature</th>
                      <th className="pb-2 text-primary font-extrabold">Bookmorestays</th>
                      <th className="pb-2 text-slate-400">MakeMyTrip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 font-bold text-slate-700">Commission &amp; Markup</td>
                      <td className="py-2.5 font-black text-emerald-700">₹0 (Direct Rate)</td>
                      <td className="py-2.5 text-red-500 font-semibold">18% - 25% Markup</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-slate-700">Customer Convenience Fee</td>
                      <td className="py-2.5 font-black text-emerald-700">₹0 Free</td>
                      <td className="py-2.5 text-red-500 font-semibold">₹350 - ₹1,200</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-slate-700">VIP Floating Breakfast</td>
                      <td className="py-2.5 font-black text-primary">Included Free (₹3,000 value)</td>
                      <td className="py-2.5 text-slate-400">Extra Charge</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-slate-700">Early Check-in / Late Checkout</td>
                      <td className="py-2.5 font-black text-emerald-700">Guaranteed Priority</td>
                      <td className="py-2.5 text-slate-400">Subject to Availability</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-slate-700">Room Verification</td>
                      <td className="py-2.5 font-black text-primary">4K Cinematic Video Tour</td>
                      <td className="py-2.5 text-slate-400">Wide-angle Photos</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-slate-700">Direct Concierge</td>
                      <td className="py-2.5 font-black text-emerald-700">Instant WhatsApp with Host</td>
                      <td className="py-2.5 text-slate-400">Call Center Bot</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Frequently Asked Questions (FAQ) Accordion */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Direct Booking FAQs</h3>
                  <p className="text-[11px] text-slate-500">Everything you need to know about booking direct</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {FAQ_ITEMS.map((faq, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full p-3.5 text-left font-bold text-xs text-slate-800 flex justify-between items-center hover:bg-slate-50 transition cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {activeFaq === idx ? (
                        <ChevronUp size={14} className="text-primary flex-shrink-0 ml-2" />
                      ) : (
                        <ChevronDown size={14} className="text-slate-400 flex-shrink-0 ml-2" />
                      )}
                    </button>
                    {activeFaq === idx && (
                      <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed bg-slate-50/60 border-t border-slate-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Result Detail Overlay with Deep Luxury Specifications */}
      <AnimatePresence>
        {result && !isLoading && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden text-slate-900 font-sans"
          >
            {/* Top controls - sticky above scrolling content */}
            <div className="absolute top-12 left-4 right-4 flex justify-between z-50 pointer-events-none">
              <button
                onClick={closeResult}
                className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-100 transition pointer-events-auto cursor-pointer"
              >
                <X size={20} />
              </button>
              <div className="flex space-x-2 pointer-events-auto">
                <button
                  onClick={handleShareResult}
                  className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                  title="Share Property"
                >
                  <Share2 size={18} />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-primary" />}
                </button>
                <button
                  onClick={toggleSave}
                  className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-slate-200 transition cursor-pointer ${
                    isSaved ? "bg-red-50 text-red-500" : "bg-white/90 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto pb-32">
              
              {/* Media Player Section with Tab Switcher */}
              <div className="relative w-full h-[380px] bg-black">
                {/* Media Switcher Tab Controls */}
                <div className="absolute top-24 left-4 z-40 flex items-center bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20">
                  <button
                    onClick={() => setDetailMediaTab('video')}
                    className={`flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                      detailMediaTab === 'video'
                        ? 'bg-primary text-white shadow'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Video size={12} />
                    <span>Video</span>
                  </button>
                  <button
                    onClick={() => setDetailMediaTab('photos')}
                    className={`flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                      detailMediaTab === 'photos'
                        ? 'bg-primary text-white shadow'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <ImageIcon size={12} />
                    <span>Photos ({result.images?.length || 4})</span>
                  </button>
                </div>

                <div className="w-full h-full relative">
                  {detailMediaTab === 'video' ? (
                    result.hasCustomVideo && result.video_url ? (
                      <video
                        src={result.video_url}
                        poster={result.hotelImage}
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={result.hotelImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                        alt="Hotel Cover"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    /* Multi-Photo Carousel */
                    <div className="w-full h-full relative">
                      <img
                        src={(result.images && result.images[detailPhotoIdx]) || result.hotelImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                        alt="Hotel Photo"
                        className="w-full h-full object-cover transition-opacity duration-300"
                      />

                      {/* Photo navigation arrows */}
                      {result.images && result.images.length > 1 && (
                        <>
                          <button
                            onClick={() => setDetailPhotoIdx(prev => ((prev - 1 + (result.images?.length || 1)) % (result.images?.length || 1)))}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition border border-white/20 z-30 cursor-pointer"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={() => setDetailPhotoIdx(prev => ((prev + 1) % (result.images?.length || 1)))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition border border-white/20 z-30 cursor-pointer"
                          >
                            <ChevronRight size={20} />
                          </button>

                          {/* Dots */}
                          <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-1.5">
                            {result.images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setDetailPhotoIdx(idx)}
                                className={`h-2 rounded-full transition-all ${
                                  idx === detailPhotoIdx ? 'w-6 bg-white shadow' : 'w-2 bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60 pointer-events-none"></div>
              </div>

              {/* Main Content Details */}
              <div className="px-6 pt-6 pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 leading-tight pr-4 tracking-tight">{result.hotelName || 'Luxury Stay'}</h2>
                    {result.room_type && (
                      <p className="text-primary font-bold text-xs flex items-center gap-1 mt-1">
                        <BedDouble size={13} /> {result.room_type}
                      </p>
                    )}
                  </div>
                  <a
                    href={`https://wa.me/${result.whatsapp_number?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex-shrink-0 bg-blue-50 rounded-2xl flex items-center justify-center text-primary hover:bg-blue-100 transition shadow-sm border border-blue-100 cursor-pointer"
                  >
                    <Phone size={20} fill="currentColor" />
                  </a>
                </div>

                <div className="flex flex-wrap items-center text-slate-600 text-sm font-medium mb-5">
                  <span className="flex items-center"><Star size={16} className="text-amber-400 fill-amber-400 mr-1" /> {avgRating} ({reviews.length} reviews)</span>
                  <span className="mx-2 text-slate-300">•</span>
                  <span className="flex items-center"><MapPin size={16} className="mr-1 text-primary" /> {result.city || 'Unknown Location'}</span>
                </div>

                {/* Key Specs Card */}
                <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl mb-6 text-xs">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-primary" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Occupancy</span>
                      <span className="font-extrabold text-slate-900">{result.occupancy || `${guestCount} Guests`}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Cancellation</span>
                      <span className="font-extrabold text-emerald-700">{result.cancellation_policy || 'Free (48 hrs)'}</span>
                    </div>
                  </div>
                </div>

                {/* Request Tour State */}
                {!result.is_verified && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-100 rounded-full p-2 mr-3 text-primary">
                        <Camera size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Visual Proof Not Found</h3>
                        <p className="text-xs text-slate-500">Our team hasn&apos;t shot a 4K tour here yet.</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRequestTour}
                      className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 transition rounded-2xl text-sm font-bold text-slate-800 mt-2 shadow-sm cursor-pointer"
                    >
                      Request 4K Cinematic Tour
                    </button>
                  </div>
                )}

                {/* BMS Verified Perks */}
                <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/40 border border-blue-100 rounded-3xl p-5 mb-8 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-primary rounded-full p-1.5 mr-2 shadow-md shadow-primary/20">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">BMS Verified Direct Perks</h3>
                  </div>
                  <p className="text-sm text-slate-700 font-medium mb-4 leading-relaxed">
                    Book direct through Bookmorestays to unlock exclusive VIP benefits you won&apos;t get on MakeMyTrip:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start text-sm text-slate-800 font-semibold">
                      <span className="text-emerald-600 mr-2 font-black">✓</span> Free Floating Breakfast (Value ₹3,000)
                    </li>
                    <li className="flex items-start text-sm text-slate-800 font-semibold">
                      <span className="text-emerald-600 mr-2 font-black">✓</span> Guaranteed Early Check-in &amp; Late Checkout
                    </li>
                    <li className="flex items-start text-sm text-slate-800 font-semibold">
                      <span className="text-emerald-600 mr-2 font-black">✓</span> Direct Concierge &amp; WhatsApp Support
                    </li>
                  </ul>
                </div>

                <div className="h-px bg-slate-200 w-full mb-6"></div>

                {/* Description */}
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">About this space</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  <span className="font-bold text-slate-900">{result.hotelName}</span> is an exclusive, handpicked escape located in {result.city}.
                  Discover unparalleled luxury, breathtaking views, and world-class service. Book direct through us to skip the OTA commissions.
                </p>

                {/* Amenities */}
                <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Top Amenities</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center text-slate-700 text-sm font-medium">
                    <Wifi size={18} className="mr-3 text-primary" /> High-speed WiFi
                  </div>
                  <div className="flex items-center text-slate-700 text-sm font-medium">
                    <Coffee size={18} className="mr-3 text-primary" /> Breakfast included
                  </div>
                  <div className="flex items-center text-slate-700 text-sm font-medium">
                    <Car size={18} className="mr-3 text-primary" /> Free Valet Parking
                  </div>
                  <div className="flex items-center text-slate-700 text-sm font-medium">
                    <Wind size={18} className="mr-3 text-primary" /> Air conditioning
                  </div>
                </div>

                <div className="h-px bg-slate-200 w-full mb-6"></div>

                {/* Price Breakdown Card */}
                <div className="bg-white border-2 border-primary/20 rounded-3xl p-6 mb-8 shadow-sm">
                  <h3 className="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">Rate Comparison ({nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'})</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                      <span>MakeMyTrip / OTA Total</span>
                      <span className="line-through text-red-500 font-semibold">{formatPrice((result.mmt_price || 25000) * nightsCount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-base font-bold text-slate-900">
                      <span className="flex items-center">
                        BMS Direct Quoted Rate
                        <span className="ml-2 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black">BEST PRICE</span>
                      </span>
                      <span className="text-primary text-2xl font-black">{formatPrice((result.direct_price || 20000) * nightsCount)}</span>
                    </div>
                  </div>

                  {result.savings_amount && result.savings_amount > 0 ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider block">Your Total Savings</span>
                        <span className="text-emerald-900 text-2xl font-black">{formatPrice((result.savings_amount || 0) * nightsCount)}</span>
                      </div>
                      <span className="bg-emerald-600 text-white font-extrabold text-sm px-3.5 py-1.5 rounded-xl shadow-sm">
                        {result.savings_percentage}% OFF
                      </span>
                    </div>
                  ) : null}
                </div>

                {/* Reviews Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">Verified Guest Reviews</h3>
                      <p className="text-xs text-slate-500">Real experiences from direct bookers</p>
                    </div>
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare size={13} className="text-primary" /> Write Review
                    </button>
                  </div>

                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}
                              />
                            ))}
                          </div>
                          {rev.verified_booking && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Verified Stay
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mb-1">{rev.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{rev.content}</p>
                        {rev.stay_date && (
                          <span className="text-[10px] text-slate-400 mt-2 block">{rev.stay_date}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Floating Booking Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-200 flex items-center justify-between shadow-[0_-8px_30px_rgb(0,0,0,0.08)] z-50 max-w-md mx-auto">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">BMS Direct Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">{formatPrice(result.direct_price || 20000)}</span>
                  <span className="text-slate-500 text-xs font-medium">/ night</span>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${result.whatsapp_number?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(result.whatsapp_msg || 'Hi, I want to book direct!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <Send size={15} /> WhatsApp
                </a>
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="px-5 py-3.5 bg-primary hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-primary/30 transition text-xs cursor-pointer"
                >
                  Direct Inquiry
                </button>
              </div>
            </div>

            {/* Direct Booking Inquiry Modal */}
            <AnimatePresence>
              {showInquiryModal && (
                <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="w-full max-w-md bg-white rounded-t-[32px] p-6 text-slate-900 max-h-[85vh] overflow-y-auto"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Direct Booking Inquiry</h3>
                        <p className="text-xs text-slate-500">{result.hotelName} • {result.city}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowInquiryModal(false)}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Verma"
                          value={inquiryForm.guest_name}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, guest_name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Phone (WhatsApp) *</label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={inquiryForm.guest_phone}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, guest_phone: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="you@email.com"
                            value={inquiryForm.guest_email}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, guest_email: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Check-in Date *</label>
                          <input
                            type="date"
                            required
                            value={inquiryForm.check_in}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, check_in: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Check-out Date *</label>
                          <input
                            type="date"
                            required
                            value={inquiryForm.check_out}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, check_out: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Number of Guests</label>
                        <select
                          value={inquiryForm.guests}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, guests: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Special Requests / Room Preferences</label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Floating breakfast arrangement, pool villa preference, anniversary setup..."
                          value={inquiryForm.message}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                        ></textarea>
                      </div>

                      <div className="p-3.5 bg-blue-50/80 border border-blue-100 rounded-2xl">
                        <span className="text-[11px] font-bold text-primary block">
                          ✓ Guaranteed Direct Rate: {formatPrice(result.direct_price || 20000)} / night
                        </span>
                        <span className="text-[10px] text-slate-600">
                          Includes free floating breakfast &amp; concierge VIP assistance
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={inquirySubmitting}
                        className="w-full py-3.5 bg-primary hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-lg shadow-primary/25 text-sm cursor-pointer"
                      >
                        {inquirySubmitting ? 'Sending Request...' : 'Send Direct Booking Inquiry'}
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Write Review Modal */}
            <AnimatePresence>
              {showReviewModal && (
                <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="w-full max-w-md bg-white rounded-t-[32px] p-6 text-slate-900"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Write a Review</h3>
                        <p className="text-xs text-slate-500">{result.hotelName}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowReviewModal(false)}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Your Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className="p-1 cursor-pointer"
                            >
                              <Star
                                size={26}
                                className={star <= reviewForm.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Headline / Summary *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dreamy stay with incredible direct perks"
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Review Content *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Share your stay experience, direct booking savings, and amenities..."
                          value={reviewForm.content}
                          onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="w-full py-3.5 bg-primary hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-lg shadow-primary/25 text-sm cursor-pointer"
                      >
                        {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-50 flex items-center justify-center text-sm font-bold text-slate-500">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
