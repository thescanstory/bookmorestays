/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, Star, Heart, SlidersHorizontal, 
  Globe, Menu, User, ChevronRight, ChevronLeft,
  X, Check, ShieldCheck, Sparkles, 
  Award, Trees, Waves, Coffee, Castle, 
  Mountain, Compass, Flame, Skull,
  Calendar, MapPin, Users, Phone, ArrowRight,
  Zap, CheckCircle2, BedDouble, Bath, Utensils,
  Play, MessageCircle, ExternalLink, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function InstagramIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface StayListing {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  location: string;
  state: string;
  country: string;
  category: 'icons' | 'castles' | 'islands' | 'mountains' | 'coffee' | 'nature' | 'trending';
  categoryLabel: string;
  type: string;
  distance: string;
  dates: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  guestFavorite?: boolean;
  rareFind?: boolean;
  isIconExperience?: boolean;
  accentColor: string;
  badgeText?: string;
  images: string[];
  hostName: string;
  hostBadge: string;
  hostAvatar: string;
  highlights: string[];
  specs: {
    guests: number;
    bedrooms: number;
    beds: number;
    baths: number;
  };
  amenities: string[];
  description: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Stays', icon: Compass, color: 'text-[#FF385C]', bg: 'bg-[#FF385C]/10', border: 'border-[#FF385C]/30' },
  { id: 'icons', label: 'BMS Icons', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: 'SPECIAL' },
  { id: 'coffee', label: 'Coorg Estates', icon: Coffee, color: 'text-emerald-600', bg: 'bg-emerald-600/10', border: 'border-emerald-600/30' },
  { id: 'islands', label: 'Tropical & Beach', icon: Waves, color: 'text-cyan-600', bg: 'bg-cyan-600/10', border: 'border-cyan-600/30' },
  { id: 'mountains', label: 'Mountain Views', icon: Mountain, color: 'text-indigo-600', bg: 'bg-indigo-600/10', border: 'border-indigo-600/30' },
  { id: 'castles', label: 'Luxury Villas', icon: Castle, color: 'text-purple-600', bg: 'bg-purple-600/10', border: 'border-purple-600/30' },
  { id: 'trending', label: 'Trending Deals', icon: Flame, color: 'text-rose-600', bg: 'bg-rose-600/10', border: 'border-rose-600/30', badge: 'HOT' },
  { id: 'nature', label: 'Forest & Parks', icon: Trees, color: 'text-teal-600', bg: 'bg-teal-600/10', border: 'border-teal-600/30' },
];

const BMS_LISTINGS: StayListing[] = [
  {
    id: 'listing-traitors',
    slug: 'the-traitors-coorg-mystery-game',
    title: 'The Traitors of Coorg — Mystery Trial & Estate Stay',
    tagline: 'Exclusive live reality murder mystery getaway in the misty hills of Coorg',
    location: 'Somwarpet, Coorg',
    state: 'Karnataka',
    country: 'India',
    category: 'icons',
    categoryLabel: 'BMS Icons Special',
    type: 'Exclusive 4-Star Nirjhara Coffee Estate',
    distance: '240 km from Bengaluru (AC Coach Included)',
    dates: 'Sep 26 – 27',
    price: 14999,
    originalPrice: 19999,
    discountPercent: 25,
    rating: 4.99,
    reviewsCount: 78,
    guestFavorite: true,
    rareFind: true,
    isIconExperience: true,
    accentColor: '#FF385C',
    badgeText: 'BMS ICON',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'Bookmore Stays & The Host',
    hostBadge: 'Icon Host • Superhost',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    highlights: [
      '20 Players & 3 Secret Traitors live psychological game',
      '100% Trip Cost Cash Refund to the Final Winner(s)',
      'Luxury AC Volvo Coach Transfers from Bengaluru',
      'Private waterfall trek, chocolate factory & gourmet feasts'
    ],
    specs: { guests: 20, bedrooms: 10, beds: 10, baths: 10 },
    amenities: ['Private Waterfall', 'Gourmet Dining', 'Luxury AC Coach', 'Roundtable Chamber', 'Bonfire & BBQ', 'High-speed WiFi'],
    description: 'Step into an immersive psychological murder mystery set inside the lush 50-acre Nirjhara Coffee Estate in Somwarpet, Coorg. Unmask the traitors during candlelit roundtables, conquer estate trials, and win back your entire trip cost!'
  },
  {
    id: 'listing-coorg-bungalow',
    slug: 'coorg-vintage-coffee-bungalow',
    title: 'Old Kent 1800s British Colonial Coffee Estate Bungalow',
    tagline: 'Colonial heritage surrounded by 200-acre Arabica coffee plantations',
    location: 'Madikeri, Coorg',
    state: 'Karnataka',
    country: 'India',
    category: 'coffee',
    categoryLabel: 'Coorg Estates',
    type: 'Heritage Estate Bungalow hosted by Appachu Family',
    distance: 'Surrounded by misty plantation trails',
    dates: 'Oct 24 – 28',
    price: 7800,
    originalPrice: 9500,
    discountPercent: 18,
    rating: 4.96,
    reviewsCount: 168,
    guestFavorite: true,
    rareFind: false,
    accentColor: '#059669',
    badgeText: 'SUPERHOST',
    images: [
      'https://images.unsplash.com/photo-1600298882525-4c0788ee59ea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'Appachu Family',
    hostBadge: 'Superhost • 7 Years Hosting',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    highlights: [
      'Guided coffee tasting & bean roasting tour',
      'Fireplace library & vintage English snooker table',
      'Authentic Coorg Pandi & Akki Roti homemade meals'
    ],
    specs: { guests: 6, bedrooms: 3, beds: 4, baths: 3 },
    amenities: ['Coffee Plantation', 'Fireplace', 'Chef Included', 'Library', 'Free Parking', 'Pet Friendly'],
    description: 'Immerse yourself in authentic British colonial elegance. Wake up to the aroma of freshly roasted Arabica beans, explore untouched forest trails, and unwind by the antique fireplace in the evening.'
  },
  {
    id: 'listing-bali-villa',
    slug: 'bali-luxury-private-pool-villa',
    title: 'Villa Uma Seminyak — Private Plunge Pool & Tropical Garden',
    tagline: 'Designer open-air villa with sunken lounge and sun-drenched pool',
    location: 'Seminyak, Bali',
    state: 'Bali',
    country: 'Indonesia',
    category: 'islands',
    categoryLabel: 'Tropical & Beach',
    type: 'Entire luxury villa hosted by Wayan',
    distance: 'Beachfront · 10 min to Petitenget',
    dates: 'Oct 12 – 18',
    price: 8499,
    originalPrice: 11200,
    discountPercent: 24,
    rating: 4.98,
    reviewsCount: 312,
    guestFavorite: true,
    rareFind: true,
    accentColor: '#0284C7',
    badgeText: 'GUEST FAVOURITE',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'Wayan',
    hostBadge: 'Superhost • 4 Years Hosting',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    highlights: [
      'Private swimming pool with floating breakfast basket',
      'Dedicated personal chef and butler service',
      'Complimentary airport chauffeur transfer'
    ],
    specs: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
    amenities: ['Private Pool', 'Floating Breakfast', 'Chef Service', 'High-Speed WiFi', 'Air Conditioning', 'Airport Transfer'],
    description: 'A sanctuary in the heart of Seminyak. Featuring an open-concept living space overlooking your private turquoise pool, enveloped by tropical frangipani trees.'
  },
  {
    id: 'listing-kashmir-houseboat',
    slug: 'kashmir-heritage-dal-lake-houseboat',
    title: 'Sukoon Luxury Cedarwood Houseboat on Dal Lake',
    tagline: 'Hand-carved royal cedarwood boat overlooking the Zabarwan mountains',
    location: 'Srinagar, Kashmir',
    state: 'Jammu & Kashmir',
    country: 'India',
    category: 'mountains',
    categoryLabel: 'Mountain Views',
    type: 'Entire heritage houseboat hosted by Ghulam',
    distance: 'Zabarwan Mountain Backdrop',
    dates: 'Oct 02 – 07',
    price: 6999,
    originalPrice: 8999,
    discountPercent: 22,
    rating: 4.95,
    reviewsCount: 220,
    guestFavorite: true,
    rareFind: false,
    accentColor: '#6366F1',
    badgeText: 'HERITAGE',
    images: [
      'https://images.unsplash.com/photo-1595815771615-442ef57b85c7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'Ghulam & Family',
    hostBadge: 'Superhost • 9 Years Hosting',
    hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    highlights: [
      'Handcarved walnut interiors & antique Kashmiri silk rugs',
      'Complimentary private sunrise Shikara boat ride',
      'Traditional 7-course Wazwan cuisine on the sun deck'
    ],
    specs: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
    amenities: ['Mountain View', 'Shikara Ride', 'Wazwan Dining', 'Heated Rooms', 'Dal Lake Access', 'Butler Service'],
    description: 'Experience timeless Kashmiri royalty on Dal Lake. Drift along calm waters with panoramic vistas of snow-capped peaks and vibrant floating lotus gardens.'
  },
  {
    id: 'listing-goa-villa',
    slug: 'south-goa-portuguese-mansion',
    title: 'Villa Bella Rosa — 17th Century Indo-Portuguese Villa',
    tagline: 'Restored heritage manor with private azure pool & lush garden courtyard',
    location: 'Assagao, Goa',
    state: 'Goa',
    country: 'India',
    category: 'castles',
    categoryLabel: 'Luxury Villas',
    type: 'Entire heritage villa with private pool',
    distance: '12 min to Vagator & Anjuna Beach',
    dates: 'Nov 02 – 08',
    price: 14500,
    originalPrice: 18000,
    discountPercent: 19,
    rating: 4.96,
    reviewsCount: 205,
    guestFavorite: true,
    rareFind: true,
    accentColor: '#8B5CF6',
    badgeText: 'RARE FIND',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600298882525-4c0788ee59ea?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'Maria D’Souza',
    hostBadge: 'Superhost • 5 Years Hosting',
    hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    highlights: [
      'Private azure pool with poolside cabana & sunbeds',
      'High ceilings, mother-of-pearl oyster shell windows',
      'In-house cocktail mixologist and Goan chef available'
    ],
    specs: { guests: 8, bedrooms: 4, beds: 4, baths: 4 },
    amenities: ['Private Pool', 'Goan Chef', 'Cocktail Bar', 'Tropical Garden', 'High-Speed WiFi', 'Daily Housekeeping'],
    description: 'A 300-year-old architectural masterpiece restored with modern luxury. Nestled under swaying palm canopies in Goa’s most charming culinary village.'
  },
  {
    id: 'listing-vietnam-cruise',
    slug: 'ha-long-bay-luxury-suite',
    title: 'Heritage 5-Star Floating Suite on Ha Long Bay',
    tagline: 'Private ocean-view Jacuzzi terrace navigating mythical karst sea peaks',
    location: 'Ha Long Bay',
    state: 'Quang Ninh',
    country: 'Vietnam',
    category: 'trending',
    categoryLabel: 'Trending Deals',
    type: 'Private Balcony Suite on Luxury Boutique Vessel',
    distance: 'Limestone Karst Sea Views',
    dates: 'Nov 04 – 09',
    price: 12999,
    originalPrice: 16500,
    discountPercent: 21,
    rating: 4.97,
    reviewsCount: 184,
    guestFavorite: true,
    rareFind: false,
    accentColor: '#F43F5E',
    badgeText: 'TRENDING',
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'Lan Ha Cruise Line',
    hostBadge: 'Superhost',
    hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    highlights: [
      'Private oceanview Jacuzzi balcony in every suite',
      'Kayaking in Sung Sot & Dark-Light Cave included',
      'Sunset tea ceremony on rooftop panoramic deck'
    ],
    specs: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
    amenities: ['Private Jacuzzi', 'Ocean View', 'Kayaking Included', 'All Meals', 'Sundeck Bar', 'Spa & Wellness'],
    description: 'Glide along emerald sea waters surrounded by thousands of towering limestone isles. Includes fine Vietnamese dining, morning Tai Chi sessions, and cave expeditions.'
  },
  {
    id: 'listing-spiti-mud-castle',
    slug: 'spiti-valley-kaza-view-stay',
    title: 'The Himalayan Mud Castle & Stargazing Retreat',
    tagline: 'Ancient Tibetan architecture at 3,800m with zero light pollution skyviews',
    location: 'Kaza, Spiti Valley',
    state: 'Himachal Pradesh',
    country: 'India',
    category: 'mountains',
    categoryLabel: 'Mountain Views',
    type: 'Mud cottage hosted by Tenzin',
    distance: '3,800m altitude · Valley Views',
    dates: 'Oct 15 – 21',
    price: 4200,
    originalPrice: 5500,
    discountPercent: 23,
    rating: 4.97,
    reviewsCount: 145,
    guestFavorite: false,
    rareFind: true,
    accentColor: '#4F46E5',
    badgeText: 'STARGAZING',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595815771615-442ef57b85c7?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'Tenzin Norbu',
    hostBadge: 'Superhost • 6 Years Hosting',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    highlights: [
      'Zero light pollution telescope stargazing & Milky Way views',
      'Heated solar bukhari in every room for cozy nights',
      'Organic Seabuckthorn tea & Tibetan homemade thukpa'
    ],
    specs: { guests: 3, bedrooms: 1, beds: 2, baths: 1 },
    amenities: ['Telescope Access', 'Heated Bukhari', 'Organic Meals', 'Mountain View', 'Bonfire', 'Local Guide'],
    description: 'An ethereal escape into the trans-Himalayan high desert. Fall asleep under billions of glittering stars and discover century-old monasteries.'
  },
  {
    id: 'listing-gokarna-cliff',
    slug: 'gokarna-cliffside-ocean-cottage',
    title: 'Kahani Ocean Cliff Cottage with Private Sunset Deck',
    tagline: 'Direct views of Paradise Beach & Arabian Sea dolphins at dawn',
    location: 'Gokarna',
    state: 'Karnataka',
    country: 'India',
    category: 'nature',
    categoryLabel: 'Forest & Beach',
    type: 'Entire clifftop eco-chalet',
    distance: 'Direct trail to Half Moon Beach',
    dates: 'Nov 10 – 15',
    price: 5900,
    originalPrice: 7500,
    discountPercent: 21,
    rating: 4.94,
    reviewsCount: 119,
    guestFavorite: true,
    rareFind: true,
    accentColor: '#0D9488',
    badgeText: 'CLIFFTOP',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'Sanjay Hegde',
    hostBadge: 'Superhost',
    hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    highlights: [
      'Panoramic 180° Arabian sea sunset view from private deck',
      'Dolphin spotting in the morning right from your balcony',
      'Fresh coastal seafood dining & cliffside hammock'
    ],
    specs: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
    amenities: ['Sea View', 'Sunset Deck', 'Beach Trail', 'Coastal Dining', 'Hammock', 'Free Breakfast'],
    description: 'Perched high on the rugged cliffs above Gokarna’s secluded beaches. Listen to the ocean waves crash below as you relax in your private sea-facing chalet.'
  }
];

const INSTAGRAM_STORIES = [
  { id: 'st-1', name: '🏰 Traitors', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=200&q=80', active: true },
  { id: 'st-2', name: '☕ Coorg Stays', img: 'https://images.unsplash.com/photo-1600298882525-4c0788ee59ea?auto=format&fit=crop&w=200&q=80', active: true },
  { id: 'st-3', name: '🏝️ Bali Villas', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=200&q=80', active: true },
  { id: 'st-4', name: '🌊 Goa Mansions', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80', active: true },
  { id: 'st-5', name: '🏔️ Kashmir', img: 'https://images.unsplash.com/photo-1595815771615-442ef57b85c7?auto=format&fit=crop&w=200&q=80', active: false },
  { id: 'st-6', name: '⭐ Reviews', img: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=200&q=80', active: false },
];

const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    type: 'reel',
    title: 'The Traitors of Coorg — 20 Players, 3 Traitors & 1 Winner at Nirjhara Estate! 🏰🕵️‍♂️',
    location: 'Nirjhara Estate, Coorg',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    views: '54.2K',
    likes: '4.8K',
    comments: '342',
    link: 'https://www.instagram.com/bookmore.stays/?hl=en',
    tag: 'Traitors Reel'
  },
  {
    id: 'ig-2',
    type: 'post',
    title: 'Waking up inside a private plunge pool villa in Seminyak, Bali 🌸 Floating breakfast ready!',
    location: 'Seminyak, Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    likes: '3.1K',
    comments: '189',
    link: 'https://www.instagram.com/bookmore.stays/?hl=en',
    tag: 'Bali Stays'
  },
  {
    id: 'ig-3',
    type: 'reel',
    title: 'Sunrise Shikara ride through Dal Lake misty lotus gardens 🛶❄️ Handcrafted luxury boat stay.',
    location: 'Srinagar, Kashmir',
    image: 'https://images.unsplash.com/photo-1595815771615-442ef57b85c7?auto=format&fit=crop&w=800&q=80',
    views: '42.9K',
    likes: '3.9K',
    comments: '215',
    link: 'https://www.instagram.com/bookmore.stays/?hl=en',
    tag: 'Dal Lake Reel'
  },
  {
    id: 'ig-4',
    type: 'reel',
    title: 'Inside a 300-year-old restored Indo-Portuguese manor in Goa with private pool 🏛️✨',
    location: 'Assagao, Goa',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    views: '38.4K',
    likes: '2.7K',
    comments: '164',
    link: 'https://www.instagram.com/bookmore.stays/?hl=en',
    tag: 'Goa Heritage'
  },
  {
    id: 'ig-5',
    type: 'post',
    title: 'Billion star hotel: Mud castle stargazing at 3,800m in Spiti Valley 🌌✨',
    location: 'Kaza, Spiti Valley',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    likes: '5.2K',
    comments: '412',
    link: 'https://www.instagram.com/bookmore.stays/?hl=en',
    tag: 'Spiti Stargazing'
  },
  {
    id: 'ig-6',
    type: 'reel',
    title: 'Private waterfall plunge inside 200-acre Arabica coffee plantation ☕🌿',
    location: 'Madikeri, Coorg',
    image: 'https://images.unsplash.com/photo-1600298882525-4c0788ee59ea?auto=format&fit=crop&w=800&q=80',
    views: '61.7K',
    likes: '6.4K',
    comments: '528',
    link: 'https://www.instagram.com/bookmore.stays/?hl=en',
    tag: 'Coorg Waterfall'
  }
];

export default function BookmoreStaysHome() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [activeTab, setActiveTab] = useState<'stays' | 'experiences' | 'icons'>('stays');
  const [likedListings, setLikedListings] = useState<Record<string, boolean>>({});
  const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({});
  const [selectedListing, setSelectedListing] = useState<StayListing | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(20000);

  // Filter listings
  const filteredListings = useMemo(() => {
    return BMS_LISTINGS.filter((item) => {
      const matchesCat = selectedCategory === 'all' || 
        (selectedCategory === 'icons' && item.isIconExperience) || 
        item.category === selectedCategory;
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.title.toLowerCase().includes(q) || 
        item.location.toLowerCase().includes(q) || 
        item.state.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q);

      const matchesDest = selectedDestination === 'all' || 
        item.location.toLowerCase().includes(selectedDestination.toLowerCase()) ||
        item.state.toLowerCase().includes(selectedDestination.toLowerCase());

      const matchesPrice = item.price <= priceMax;

      return matchesCat && matchesSearch && matchesDest && matchesPrice;
    });
  }, [selectedCategory, searchQuery, selectedDestination, priceMax]);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !likedListings[id];
    setLikedListings(prev => ({ ...prev, [id]: next }));
    toast.success(next ? 'Saved to Wishlist' : 'Removed from Wishlist', {
      icon: next ? '❤️' : '🤍',
      style: {
        borderRadius: '12px',
        background: '#222222',
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '600'
      }
    });
  };

  const nextImage = (listingId: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) + 1) % total
    }));
  };

  const prevImage = (listingId: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) - 1 + total) % total
    }));
  };

  const handleBookListing = (listing: StayListing) => {
    const msg = `Hi! I found *${listing.title}* on Bookmore Stays (${listing.location}).\nDates: ${listing.dates}\nPrice: ₹${listing.price.toLocaleString('en-IN')}/night\n\nI would like to verify availability and confirm my reservation!`;
    const url = `https://wa.me/919738397933?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#222222] font-sans antialiased selection:bg-[#FF385C] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 0. TOP CAMPAIGN BAR (BOOKMORE STAYS SPECIAL)                              */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#FF385C] via-[#E61E4D] to-[#D70466] text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-sm">
        <Sparkles size={14} className="text-amber-300 animate-pulse" />
        <span>Diwali & Weekend Escapes Live: Book verified luxury villas & BMS Icons with 100% BMS StayCover Guarantee</span>
        <span className="hidden sm:inline bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
          Limited Slots
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 1. BOOKMORE STAYS STICKY TOP HEADER                                       */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EBEBEB] transition-all shadow-sm">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
          
          {/* Main Navigation Bar */}
          <div className="h-20 flex items-center justify-between gap-4">
            
            {/* Bookmore Stays Brand Logo */}
            <Link href="/" className="flex items-center gap-2 text-[#FF385C] group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF385C] via-[#E00B41] to-[#FF5A5F] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform tracking-tighter">
                B
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-[#222222] hidden sm:inline font-sans">
                bookmore<span className="text-[#FF385C]">stays</span>
              </span>
            </Link>

            {/* Center Navigation Tabs */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3 bg-[#F7F7F7] p-1.5 rounded-full border border-[#EBEBEB]">
              <button 
                onClick={() => { setActiveTab('stays'); setSelectedCategory('all'); }}
                className={`py-2 px-5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'stays' 
                    ? 'bg-white text-[#222222] shadow-sm' 
                    : 'text-[#717171] hover:text-[#222222]'
                }`}
              >
                Stays
              </button>
              
              <button 
                onClick={() => { setActiveTab('experiences'); setSelectedCategory('coffee'); }}
                className={`py-2 px-5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'experiences' 
                    ? 'bg-white text-[#222222] shadow-sm' 
                    : 'text-[#717171] hover:text-[#222222]'
                }`}
              >
                Experiences
              </button>

              {/* Traitors Special BMS Icon Tab */}
              <Link
                href="/traitors"
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#FF385C] to-[#D70466] hover:opacity-95 px-4 py-2 rounded-full shadow-sm transition"
              >
                <Skull size={13} className="text-white" />
                <span>The Traitors Coorg</span>
                <span className="bg-white text-[#FF385C] text-[9px] px-1.5 py-0.2 rounded-full font-extrabold">ICON</span>
              </Link>
            </div>

            {/* Right User Capsule & Host Button */}
            <div className="flex items-center gap-2">
              <Link
                href="/traitors"
                className="hidden lg:block text-xs font-semibold text-[#222222] hover:bg-[#F7F7F7] px-3.5 py-2.5 rounded-full transition"
              >
                Become a Host
              </Link>

              <button 
                onClick={() => toast.success('Language: English (IN) · Currency: INR (₹)')}
                className="p-2.5 text-[#222222] hover:bg-[#F7F7F7] rounded-full transition"
                aria-label="Language & Currency"
              >
                <Globe size={18} />
              </button>

              {/* Profile dropdown pill */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 p-1.5 pl-3.5 rounded-full border border-[#DDDDDD] hover:shadow-md transition bg-white"
                >
                  <Menu size={16} className="text-[#222222]" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF385C] to-[#FFB400] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    <User size={15} />
                  </div>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#EBEBEB] py-2 z-50 text-sm font-medium"
                    >
                      <Link 
                        href="/traitors"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center justify-between px-4 py-3 bg-rose-50/50 hover:bg-rose-50 font-bold text-[#FF385C]"
                      >
                        <span className="flex items-center gap-2">
                          <Skull size={18} />
                          <span>The Traitors Coorg Getaway</span>
                        </span>
                        <span className="text-[10px] bg-[#FF385C] text-white px-2 py-0.5 rounded-full font-bold">ICON</span>
                      </Link>
                      <div className="border-t border-[#EBEBEB] my-1" />
                      <button onClick={() => { setSelectedCategory('icons'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 hover:bg-[#F7F7F7] flex items-center justify-between">
                        <span>BMS Icons Showcase</span>
                        <Sparkles size={14} className="text-amber-500" />
                      </button>
                      <button onClick={() => { setSelectedCategory('castles'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 hover:bg-[#F7F7F7] flex items-center justify-between">
                        <span>Luxury Heritage Villas</span>
                        <Castle size={14} className="text-purple-600" />
                      </button>
                      <button onClick={() => { setSelectedCategory('coffee'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 hover:bg-[#F7F7F7] flex items-center justify-between">
                        <span>Coorg Coffee Plantation Stays</span>
                        <Coffee size={14} className="text-emerald-600" />
                      </button>
                      <div className="border-t border-[#EBEBEB] my-1" />
                      <a href="https://wa.me/919738397933" target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 hover:bg-[#F7F7F7] text-emerald-600 font-bold">
                        💬 WhatsApp Concierge (24/7)
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* FLOATING SEARCH PILL BAR                                                 */}
          {/* ========================================================================= */}
          <div className="pb-5 pt-1 flex flex-col items-center">
            <div className="w-full max-w-[860px] bg-white border border-[#DDDDDD] rounded-full bms-pill-shadow hover:shadow-lg transition-all flex items-center p-2 divide-x divide-[#EBEBEB]">
              
              {/* Segment 1: Where */}
              <div className="flex-1 px-5 py-1.5 cursor-pointer text-left group">
                <div className="text-[11px] font-extrabold text-[#222222] tracking-wider uppercase">
                  Where
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Coorg, Bali, Dal Lake, Goa..."
                  className="w-full text-xs text-[#222222] font-semibold placeholder-[#717171] bg-transparent focus:outline-none truncate"
                />
              </div>

              {/* Segment 2: When */}
              <div className="hidden sm:block flex-1 px-5 py-1.5 cursor-pointer text-left">
                <div className="text-[11px] font-extrabold text-[#222222] tracking-wider uppercase">
                  When
                </div>
                <div className="text-xs text-[#717171] truncate font-medium">
                  Sep 26 – Oct 28 · Any weekend
                </div>
              </div>

              {/* Segment 3: Who */}
              <div className="hidden md:block flex-1 px-5 py-1.5 cursor-pointer text-left">
                <div className="text-[11px] font-extrabold text-[#222222] tracking-wider uppercase">
                  Who
                </div>
                <div className="text-xs text-[#717171] truncate font-medium">
                  2–20 guests · Pass options
                </div>
              </div>

              {/* Search Button */}
              <div className="pl-2">
                <button 
                  onClick={() => toast.success(`Filtered ${filteredListings.length} stays`)}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF385C] via-[#E61E4D] to-[#D70466] hover:opacity-90 transition-all flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95"
                  aria-label="Search"
                >
                  <Search size={18} strokeWidth={2.5} />
                </button>
              </div>

            </div>

            {/* Quick Destination Pill Tags */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar max-w-full px-2">
              <span className="text-[11px] font-bold text-[#717171] uppercase tracking-wider shrink-0">Popular:</span>
              {[
                { label: '✨ Coorg Mystery', filter: 'coorg' },
                { label: '🏝️ Bali Villas', filter: 'bali' },
                { label: '🏰 Goa Mansions', filter: 'goa' },
                { label: '🏔️ Kashmir Houseboats', filter: 'kashmir' },
                { label: '🌌 Spiti Stargazing', filter: 'spiti' }
              ].map(dest => (
                <button
                  key={dest.label}
                  onClick={() => setSearchQuery(dest.filter)}
                  className="text-xs font-semibold px-3 py-1 bg-white hover:bg-rose-50 hover:text-[#FF385C] hover:border-[#FF385C]/40 border border-[#EBEBEB] rounded-full transition shrink-0 shadow-2xs"
                >
                  {dest.label}
                </button>
              ))}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-red-500 hover:underline shrink-0"
                >
                  Clear filter
                </button>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CATEGORY HORIZONTAL BAR & FILTERS BUTTON                                */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-[#EBEBEB] sticky top-[148px] md:top-[156px] z-40 shadow-xs">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-3 flex items-center justify-between gap-4">
          
          {/* Scrollable Categories */}
          <div className="flex items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center gap-1.5 pb-1 border-b-2 transition-all group shrink-0 relative ${
                    isSelected 
                      ? 'border-[#222222] text-[#222222]' 
                      : 'border-transparent text-[#717171] hover:text-[#222222] hover:border-[#DDDDDD]'
                  }`}
                >
                  {cat.badge && (
                    <span className="absolute -top-2.5 right-0 bg-gradient-to-r from-[#FF385C] to-amber-500 text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-full uppercase shadow-xs">
                      {cat.badge}
                    </span>
                  )}
                  <div className={`p-2 rounded-xl transition-all ${
                    isSelected ? `${cat.bg} ${cat.color}` : 'group-hover:bg-[#F7F7F7]'
                  }`}>
                    <Icon size={22} strokeWidth={isSelected ? 2.3 : 1.8} className={isSelected ? cat.color : ''} />
                  </div>
                  <span className={`text-xs font-bold tracking-tight ${isSelected ? 'text-[#222222]' : 'text-[#717171]'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter & Preferences Button */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 border border-[#DDDDDD] hover:border-[#222222] rounded-xl text-xs font-bold text-[#222222] transition shrink-0 bg-white hover:shadow-xs"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {priceMax < 20000 && (
              <span className="w-2 h-2 rounded-full bg-[#FF385C]" />
            )}
          </button>

        </div>
      </div>

      <main className="max-w-[1760px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-8">

        {/* ========================================================================= */}
        {/* 3. BMS ICONS FEATURED SPOTLIGHT CARD (THE TRAITORS OF COORG)              */}
        {/* ========================================================================= */}
        <section className="mb-12">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#18181B] via-[#09090B] to-[#1C1917] text-white shadow-2xl border border-neutral-800">
            
            {/* Background Ambient Glow & Patterns */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF385C]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 items-center relative z-10">
              
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Badge Row */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="bg-gradient-to-r from-[#FF385C] to-[#D70466] text-white font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <Sparkles size={12} className="text-amber-300" />
                    BMS Icons Special
                  </span>
                  <span className="bg-white/10 backdrop-blur-md text-amber-300 font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/15 flex items-center gap-1">
                    <Award size={12} />
                    Only 20 Guest Passes
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[11px] px-3 py-1 rounded-full border border-emerald-500/30">
                    🏆 100% Cash Prize Refund
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  The Traitors of Coorg — A Live Reality Murder Mystery Getaway
                </h2>

                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                  2 Days & 1 Night inside the 4-Star Nirjhara Coffee Estate. 20 Players, 3 Secret Traitors, and dramatic candlelit roundtable trials. Unmask the traitors, win back your entire trip cost, and enjoy luxury AC coach transfers from Bengaluru.
                </p>

                {/* Highlight Checkmarks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {[
                    'Luxury 4-Star Coffee Estate Stay',
                    'All Gourmet Meals & BBQ Feast Included',
                    'Private Waterfall & Chocolate Factory Trek',
                    'AC Volvo Coach Transfers from Bengaluru'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                      <CheckCircle2 size={15} className="text-[#FF385C] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing & CTA */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <div>
                    <div className="text-xs text-neutral-400 font-medium">All-Inclusive Experience Pass</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-white">₹14,999</span>
                      <span className="text-sm text-neutral-400 line-through">₹19,999</span>
                      <span className="text-xs font-bold text-[#FF385C] bg-[#FF385C]/15 px-2 py-0.5 rounded">25% OFF</span>
                    </div>
                  </div>

                  <Link
                    href="/traitors"
                    className="bg-gradient-to-r from-[#FF385C] via-[#E61E4D] to-[#D70466] hover:opacity-95 text-white font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 group transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Request to Join</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>

              {/* Right Media Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl aspect-4/3 group">
                  <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
                    alt="Nirjhara Estate Coorg"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Floating Date Badge */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#FF385C]" />
                    <span>Sep 26 – 27, 2026</span>
                  </div>

                  {/* Host badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Hosted by Bookmore Stays</div>
                      <div className="text-neutral-300 text-[11px]">Nirjhara Estate, Somwarpet</div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-300 font-bold">
                      <Star size={13} fill="currentColor" />
                      <span>4.99 (78 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3.5 INSTAGRAM SHOWCASE SECTION (@bookmore.stays)                         */}
        {/* ========================================================================= */}
        <section className="mb-14 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBEBEB] shadow-xs">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#EBEBEB]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white shadow-md shrink-0">
                <InstagramIcon size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-[#222222]">
                    @bookmore.stays on Instagram
                  </h3>
                  <span className="bg-gradient-to-r from-[#F58529] to-[#DD2A7B] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Official
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#717171] mt-0.5">
                  Catch behind-the-scenes reels, murder mystery teasers, and secret property drops.
                </p>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://www.instagram.com/bookmore.stays/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 transition hover:scale-105 active:scale-95"
              >
                <InstagramIcon size={16} />
                <span>Follow @bookmore.stays</span>
                <ExternalLink size={13} className="ml-0.5 opacity-80" />
              </a>
            </div>
          </div>

          {/* Story Highlights Circles */}
          <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar pb-6 mb-6 border-b border-[#EBEBEB]">
            {INSTAGRAM_STORIES.map(story => (
              <a
                key={story.id}
                href="https://www.instagram.com/bookmore.stays/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
              >
                <div className="p-0.75 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] group-hover:scale-105 transition-transform shadow-xs">
                  <div className="p-0.5 bg-white rounded-full">
                    <img
                      src={story.img}
                      alt={story.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#222222] group-hover:text-[#DD2A7B] transition-colors">
                  {story.name}
                </span>
              </a>
            ))}
          </div>

          {/* Instagram Post / Reel Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {INSTAGRAM_POSTS.map((post) => (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-4/5 rounded-2xl overflow-hidden bg-neutral-100 shadow-2xs border border-[#EBEBEB] block"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Default Static Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3 pointer-events-none">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1">
                      {post.type === 'reel' ? (
                        <>
                          <Play size={10} className="fill-white text-white" />
                          <span>{post.views}</span>
                        </>
                      ) : (
                        <>
                          <Heart size={10} className="fill-rose-500 text-rose-500" />
                          <span>{post.likes}</span>
                        </>
                      )}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                      {post.type === 'reel' ? <Play size={11} className="fill-white" /> : <InstagramIcon size={11} />}
                    </span>
                  </div>

                  {/* Bottom Location & Caption */}
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-300 block mb-0.5">
                      {post.location}
                    </span>
                    <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight">
                      {post.title}
                    </p>
                  </div>

                </div>

                {/* Hover Reveal Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#8134AF]/90 via-[#DD2A7B]/80 to-[#F58529]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-3 text-center space-y-2">
                  <InstagramIcon size={28} className="drop-shadow-md animate-bounce" />
                  <div className="text-xs font-black">View on Instagram</div>
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <span className="flex items-center gap-1"><Heart size={12} fill="white" /> {post.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={12} fill="white" /> {post.comments}</span>
                  </div>
                </div>

              </a>
            ))}
          </div>

          {/* Instagram Footer Prompt */}
          <div className="mt-5 pt-4 border-t border-[#EBEBEB] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#717171]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#222222]">Tag #BookmoreStays</span>
              <span>·</span>
              <span>Share your weekend stories & reels to get featured on our feed!</span>
            </div>
            <a
              href="https://www.instagram.com/bookmore.stays/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#DD2A7B] font-bold hover:underline flex items-center gap-1"
            >
              <span>Explore full profile</span>
              <ChevronRight size={14} />
            </a>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 4. MAIN STAY LISTING GRID                                                 */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#222222]">
              {selectedCategory === 'all' ? 'Extraordinary Stays & Experiences' : CATEGORIES.find(c => c.id === selectedCategory)?.label}
            </h3>
            <p className="text-xs sm:text-sm text-[#717171] mt-0.5">
              Showing {filteredListings.length} verified properties with instant booking
            </p>
          </div>

          <div className="text-xs font-bold text-[#717171]">
            Prices include all taxes & fees
          </div>
        </div>

        {/* Listing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredListings.map((listing) => {
            const currentImgIdx = activeImageIndex[listing.id] || 0;
            const isLiked = !!likedListings[listing.id];

            return (
              <div 
                key={listing.id}
                onClick={() => setSelectedListing(listing)}
                className="group cursor-pointer flex flex-col"
              >
                
                {/* Card Image Carousel */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-3.5 shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={listing.images[currentImgIdx] || listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {listing.guestFavorite && (
                      <span className="bg-white/95 backdrop-blur-md text-[#222222] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-[#EBEBEB]">
                        <Award size={12} className="text-[#FF385C]" />
                        Guest favourite
                      </span>
                    )}
                    {listing.rareFind && (
                      <span className="bg-gradient-to-r from-[#FF385C] to-[#D70466] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        Rare find
                      </span>
                    )}
                  </div>

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => toggleLike(listing.id, e)}
                    className="absolute top-3 right-3 p-2 rounded-full hover:scale-115 active:scale-90 transition-transform z-10"
                    aria-label="Save to Wishlist"
                  >
                    <Heart 
                      size={24} 
                      className={`transition-colors drop-shadow-md ${
                        isLiked 
                          ? 'fill-[#FF385C] text-[#FF385C]' 
                          : 'fill-black/40 text-white stroke-[1.8]'
                      }`} 
                    />
                  </button>

                  {/* Carousel Left / Right Buttons */}
                  {listing.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => prevImage(listing.id, listing.images.length, e)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-[#222222] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                        aria-label="Previous Image"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <button
                        onClick={(e) => nextImage(listing.id, listing.images.length, e)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-[#222222] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                        aria-label="Next Image"
                      >
                        <ChevronRight size={18} />
                      </button>

                      {/* Dots Indicator */}
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                        {listing.images.map((_, i) => (
                          <span
                            key={i}
                            className={`rounded-full transition-all ${
                              i === currentImgIdx 
                                ? 'w-2 h-2 bg-white scale-110 shadow-xs' 
                                : 'w-1.5 h-1.5 bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Special Theme Link Overlay for Traitors */}
                  {listing.isIconExperience && (
                    <Link
                      href="/traitors"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md hover:bg-black text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-between border border-white/20 shadow-lg"
                    >
                      <span className="flex items-center gap-1.5 text-rose-300">
                        <Skull size={14} />
                        <span>Play Traitors Game</span>
                      </span>
                      <ChevronRight size={14} />
                    </Link>
                  )}
                </div>

                {/* Card Text Content */}
                <div className="space-y-1 text-sm">
                  
                  {/* Row 1: Location & Star Rating */}
                  <div className="flex items-center justify-between font-bold text-[#222222]">
                    <span className="truncate">{listing.location}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={13} fill="#222222" className="text-[#222222]" />
                      <span>{listing.rating.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Row 2: Distance / Type */}
                  <div className="text-[#717171] text-xs truncate">
                    {listing.distance}
                  </div>

                  {/* Row 3: Available Dates */}
                  <div className="text-[#717171] text-xs">
                    {listing.dates}
                  </div>

                  {/* Row 4: Price */}
                  <div className="pt-1 flex items-baseline gap-2">
                    <span className="font-extrabold text-[#222222] text-base">
                      ₹{listing.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[#717171] text-xs font-medium">
                      {listing.isIconExperience ? 'pass' : 'night'}
                    </span>
                    {listing.originalPrice > listing.price && (
                      <span className="text-[#717171] text-xs line-through ml-auto">
                        ₹{listing.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Empty Search Fallback */}
        {filteredListings.length === 0 && (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-rose-50 text-[#FF385C] rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Compass size={32} />
            </div>
            <h4 className="text-xl font-bold text-[#222222]">No stays found for your search</h4>
            <p className="text-sm text-[#717171]">
              Try adjusting your filters or search for popular destinations like Coorg, Bali, Kashmir, or Goa.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setPriceMax(20000); }}
              className="bg-[#222222] text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-black transition"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. BMS STAYCOVER & TRUST BANNER                                           */}
        {/* ========================================================================= */}
        <section className="my-16 bg-gradient-to-br from-[#F7F7F7] to-[#EBEBEB] rounded-3xl p-8 sm:p-12 border border-[#DDDDDD] shadow-sm">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-emerald-600/20 uppercase tracking-wider">
              <ShieldCheck size={16} />
              <span>Bookmore Stays StayCover Protection</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-[#222222]">
              Every booking includes free protection from Host cancellations and listing inaccuracies
            </h3>

            <p className="text-[#717171] text-sm leading-relaxed max-w-2xl mx-auto">
              Book with total confidence. If a Host needs to cancel your reservation within 30 days of check-in, we’ll find you a similar or better stay, or issue an immediate full refund.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#EBEBEB]">
                <div className="font-extrabold text-[#222222] text-sm mb-1">Booking Protection Guarantee</div>
                <div className="text-xs text-[#717171]">100% verified estates with guaranteed check-in or money back.</div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#EBEBEB]">
                <div className="font-extrabold text-[#222222] text-sm mb-1">Check-in Guarantee</div>
                <div className="text-xs text-[#717171]">If check-in is not smooth, our 24/7 team finds an alternative instantly.</div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#EBEBEB]">
                <div className="font-extrabold text-[#222222] text-sm mb-1">24-hour Safety Line</div>
                <div className="text-xs text-[#717171]">Direct priority access to dedicated luxury concierge support agents.</div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 6. PROPERTY DETAIL MODAL / SLIDE-OVER                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#EBEBEB] my-8 relative max-h-[90vh] flex flex-col"
            >
              {/* Header Bar */}
              <div className="p-5 border-b border-[#EBEBEB] flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-[#222222]">{selectedListing.title}</span>
                </div>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="p-2 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Images Grid */}
                <div className="grid grid-cols-2 gap-2.5 rounded-2xl overflow-hidden">
                  <img
                    src={selectedListing.images[0]}
                    alt={selectedListing.title}
                    className="w-full h-64 object-cover col-span-2 sm:col-span-1 rounded-xl"
                  />
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedListing.images.slice(1, 3).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Gallery"
                        className="w-full h-[122px] object-cover rounded-xl"
                      />
                    ))}
                  </div>
                </div>

                {/* Property Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-[#222222]">{selectedListing.type}</h4>
                      <p className="text-xs text-[#717171]">{selectedListing.location}, {selectedListing.state}, {selectedListing.country}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                      <span className="font-extrabold text-sm">{selectedListing.rating}</span>
                      <span className="text-xs text-neutral-500">({selectedListing.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-[#717171] py-2 border-y border-[#EBEBEB]">
                    <span className="flex items-center gap-1.5"><Users size={14} /> {selectedListing.specs.guests} Guests</span>
                    <span className="flex items-center gap-1.5"><BedDouble size={14} /> {selectedListing.specs.bedrooms} Bedrooms</span>
                    <span className="flex items-center gap-1.5"><Bath size={14} /> {selectedListing.specs.baths} Baths</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h5 className="font-bold text-sm text-[#222222] mb-1.5">About this stay</h5>
                  <p className="text-xs sm:text-sm text-[#717171] leading-relaxed">
                    {selectedListing.description}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <h5 className="font-bold text-sm text-[#222222] mb-2.5">What makes this special</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedListing.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-[#222222] bg-[#F7F7F7] p-2.5 rounded-xl">
                        <Check size={14} className="text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Host Info */}
                <div className="bg-[#F7F7F7] p-4 rounded-2xl flex items-center justify-between border border-[#EBEBEB]">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedListing.hostAvatar}
                      alt={selectedListing.hostName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#222222]">{selectedListing.hostName}</div>
                      <div className="text-[11px] text-[#717171]">{selectedListing.hostBadge}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Verified Host
                  </span>
                </div>

              </div>

              {/* Footer Booking Bar */}
              <div className="p-5 border-t border-[#EBEBEB] bg-white flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#717171]">Total price</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-[#222222]">₹{selectedListing.price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-[#717171]">/{selectedListing.isIconExperience ? 'pass' : 'night'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {selectedListing.isIconExperience ? (
                    <Link
                      href="/traitors"
                      className="bg-gradient-to-r from-[#FF385C] to-[#D70466] hover:opacity-95 text-white text-xs sm:text-sm font-extrabold px-6 py-3 rounded-xl shadow-md transition"
                    >
                      Enter Traitors Experience
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleBookListing(selectedListing)}
                      className="bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs sm:text-sm font-extrabold px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2"
                    >
                      <Phone size={14} />
                      <span>Book on WhatsApp</span>
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 7. FILTER DRAWER MODAL                                                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showFilterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EBEBEB] space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-4">
                <h4 className="font-extrabold text-lg text-[#222222]">Filters & Price Range</h4>
                <button onClick={() => setShowFilterModal(false)} className="p-1 rounded-full hover:bg-[#F7F7F7]">
                  <X size={18} />
                </button>
              </div>

              {/* Price Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#717171]">Max Price per Night</span>
                  <span className="text-sm font-extrabold text-[#FF385C]">₹{priceMax.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="4000"
                  max="20000"
                  step="500"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#FF385C] cursor-pointer"
                />
              </div>

              {/* Property Type Options */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#717171]">Category Selection</span>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCategory(c.id); }}
                      className={`text-xs font-semibold p-2.5 rounded-xl border text-left transition ${
                        selectedCategory === c.id 
                          ? 'border-[#FF385C] bg-rose-50 text-[#FF385C]' 
                          : 'border-[#DDDDDD] hover:bg-[#F7F7F7] text-[#222222]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EBEBEB] flex items-center justify-between">
                <button
                  onClick={() => { setPriceMax(20000); setSelectedCategory('all'); }}
                  className="text-xs font-bold text-[#717171] hover:underline"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="bg-[#222222] hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-xl transition"
                >
                  Show Stays
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 8. BOOKMORE STAYS LOCALIZED FOOTER                                        */}
      {/* ========================================================================= */}
      <footer className="bg-[#F7F7F7] border-t border-[#EBEBEB] pt-12 pb-24 md:pb-12 text-xs text-[#717171]">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#EBEBEB]">
            <div className="space-y-2.5">
              <h5 className="font-extrabold text-[#222222] text-sm">Support & Help</h5>
              <p><a href="https://wa.me/919738397933" target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp 24/7 Concierge</a></p>
              <p><a href="#" className="hover:underline">BMS StayCover Guarantee</a></p>
              <p><a href="#" className="hover:underline">Cancellation Policy</a></p>
              <p><a href="#" className="hover:underline">Guest Safety & Verified Hosts</a></p>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-extrabold text-[#222222] text-sm">BMS Icons</h5>
              <p><Link href="/traitors" className="hover:underline font-bold text-[#FF385C]">The Traitors of Coorg</Link></p>
              <p><a href="#" className="hover:underline">Nirjhara Coffee Estate</a></p>
              <p><a href="#" className="hover:underline">Somwarpet Mystery Trials</a></p>
              <p><a href="#" className="hover:underline">Become an Icon Host</a></p>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-extrabold text-[#222222] text-sm">Popular Getaways</h5>
              <p><button onClick={() => setSearchQuery('coorg')} className="hover:underline text-left">Coorg Estate Bungalows</button></p>
              <p><button onClick={() => setSearchQuery('bali')} className="hover:underline text-left">Bali Private Pool Villas</button></p>
              <p><button onClick={() => setSearchQuery('kashmir')} className="hover:underline text-left">Dal Lake Srinagar Houseboats</button></p>
              <p><button onClick={() => setSearchQuery('goa')} className="hover:underline text-left">Goa Portuguese Mansions</button></p>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-extrabold text-[#222222] text-sm">Bookmore Stays</h5>
              <p><a href="#" className="hover:underline">About Bookmore Stays</a></p>
              <p><a href="#" className="hover:underline">Curated Luxury Stays</a></p>
              <p><a href="#" className="hover:underline">Careers & Host Network</a></p>
              <p><a href="#" className="hover:underline">Trust & Safety Guidelines</a></p>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
              <span>© 2026 Bookmore Stays Technologies Inc.</span>
              <span>·</span>
              <a href="#" className="hover:underline">Privacy</a>
              <span>·</span>
              <a href="#" className="hover:underline">Terms</a>
              <span>·</span>
              <a href="#" className="hover:underline">Sitemap</a>
              <span>·</span>
              <a href="#" className="hover:underline">Company details</a>
            </div>

            <div className="flex items-center gap-6 font-bold text-[#222222]">
              <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
                <Globe size={15} />
                <span>English (IN)</span>
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:underline">
                <span>₹ INR</span>
              </div>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
