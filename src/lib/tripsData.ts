export interface HoneybeePackage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  destination: string;
  country: string;
  category: 'international' | 'domestic' | 'honeymoon' | 'handpick' | 'theme';
  tag: string;
  duration: string;
  nightsDays: string;
  originalPrice: number;
  price: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  gallery: string[];
  hotelType: string;
  highlights: string[];
  isFeatured?: boolean;
  isHoneybeePick?: boolean;
  isTraitorsTheme?: boolean;
}

export const HONEYBEE_PACKAGES: HoneybeePackage[] = [
  {
    id: 'pkg-traitors-coorg',
    slug: 'the-traitors-coorg-mystery-game',
    title: 'The Traitors of Coorg — Mystery Theme Escape',
    subtitle: 'Exclusive 2-Day Murder Mystery & Social Deduction Getaway at 4-Star Nirjhara Estate',
    destination: 'Coorg, Karnataka',
    country: 'India',
    category: 'theme',
    tag: 'HONEYBEE SIGNATURE THEME',
    duration: '2 Days / 1 Night',
    nightsDays: '1N / 2D',
    originalPrice: 19999,
    price: 14999,
    rating: 5.0,
    reviewsCount: 64,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'
    ],
    hotelType: '4-Star Nirjhara Luxury Coffee Estate',
    highlights: [
      '20 Players, 3 Secret Traitors & Daily Roundtables',
      '100% Trip Cost Refund for the Final Winner(s)',
      'AC Luxury Coach transfers from Bengaluru included',
      'Private Waterfall, Chocolate Factory Tour & All Gourmet Meals'
    ],
    isFeatured: true,
    isHoneybeePick: true,
    isTraitorsTheme: true
  },
  {
    id: 'pkg-bali-luxury',
    slug: 'bali-luxury-honeymoon-private-villa',
    title: 'Bali Luxury Romance & Private Pool Villa',
    subtitle: 'Ubud Jungle Canopy, Nusa Penida Speedboat & Beachfront Sunset Dinners',
    destination: 'Ubud, Seminyak & Nusa Penida',
    country: 'Indonesia',
    category: 'honeymoon',
    tag: 'HONEYBEE PICK',
    duration: '7 Days / 6 Nights',
    nightsDays: '6N / 7D',
    originalPrice: 58999,
    price: 46999,
    rating: 4.9,
    reviewsCount: 380,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
    ],
    hotelType: '5-Star Private Pool Villa + Luxury Resort',
    highlights: [
      'Floating Breakfast in Private Plunge Pool',
      'Nusa Penida Island Tour w/ Kelingking & Broken Beach',
      'Mount Batur 4x4 Jeep Sunrise & Natural Hot Springs',
      'Candlelight 4-Course Seafood Dinner in Jimbaran Bay'
    ],
    isFeatured: true,
    isHoneybeePick: true
  },
  {
    id: 'pkg-vietnam-highlight',
    slug: 'vietnam-scenic-explorer',
    title: 'Vietnam Jewels: Hanoi, Ha Long Bay & Da Nang',
    subtitle: 'Overnight 5-Star Ha Long Bay Cruise, Golden Bridge Hands & Hoi An Lantern Town',
    destination: 'Hanoi, Ha Long Bay & Da Nang',
    country: 'Vietnam',
    category: 'international',
    tag: 'BESTSELLER',
    duration: '8 Days / 7 Nights',
    nightsDays: '7N / 8D',
    originalPrice: 62000,
    price: 49999,
    rating: 4.9,
    reviewsCount: 290,
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
    ],
    hotelType: '4-Star Boutique Hotels + Luxury Cruise Suite',
    highlights: [
      'Overnight 5-Star Cruise in UNESCO Ha Long Bay',
      'Ba Na Hills Cable Car & Iconic Giant Golden Bridge',
      'Hoi An Ancient Town Evening Boat & Floating Lanterns',
      'Hanoi Old Quarter Street Food Trail w/ Local Guide'
    ],
    isFeatured: true
  },
  {
    id: 'pkg-kashmir-paradise',
    slug: 'kashmir-paradise-luxury-houseboat',
    title: 'Enchanting Kashmir & Gulmarg Gondola',
    subtitle: 'Dal Lake Luxury Houseboat, Betaab Valley in Pahalgam & Snow Peaks of Gulmarg',
    destination: 'Srinagar, Gulmarg & Pahalgam',
    country: 'India',
    category: 'domestic',
    tag: 'HANDPICKED',
    duration: '6 Days / 5 Nights',
    nightsDays: '5N / 6D',
    originalPrice: 28999,
    price: 22499,
    rating: 4.9,
    reviewsCount: 410,
    imageUrl: 'https://images.unsplash.com/photo-1595815771615-442ef57b85c7?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595815771615-442ef57b85c7?auto=format&fit=crop&w=800&q=80'
    ],
    hotelType: 'Super Deluxe Heritage Houseboat & Pine Resorts',
    highlights: [
      'Shikara Ride & Sunset at Dal Lake with Kahwa Tea',
      'Gulmarg Gondola Phase 1 & 2 High Altitude Cable Car',
      'Pony ride & White Water Rafting in Lidder River',
      'Mughal Gardens & Local Pashmina Silk Carpet Walk'
    ],
    isHoneybeePick: true
  },
  {
    id: 'pkg-japan-cherry',
    slug: 'japan-grand-tokyo-kyoto-osaka',
    title: 'Japan Grand Tour: Tokyo, Kyoto & Osaka',
    subtitle: 'Shinkansen Bullet Train, Fushimi Inari Torii Gates, Mt. Fuji & Dotonbori',
    destination: 'Tokyo, Mt. Fuji, Kyoto & Osaka',
    country: 'Japan',
    category: 'international',
    tag: 'PREMIUM LUXURY',
    duration: '9 Days / 8 Nights',
    nightsDays: '8N / 9D',
    originalPrice: 185000,
    price: 154999,
    rating: 5.0,
    reviewsCount: 95,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
    ],
    hotelType: '4 & 5-Star City Center Hotels with Onsen access',
    highlights: [
      'JR Pass Shinkansen Bullet Train Journey',
      'Lake Kawaguchiko & Panoramic Mt. Fuji Cable Car',
      'Kyoto Bamboo Grove & Golden Pavilion (Kinkaku-ji)',
      'Universal Studios Japan & TeamLab Planets Tokyo Tickets'
    ],
    isFeatured: true
  },
  {
    id: 'pkg-meghalaya-clouds',
    slug: 'meghalaya-living-root-bridges-dawki',
    title: 'Mystical Meghalaya & Crystal Dawki River',
    subtitle: 'Double Decker Living Root Bridges, Asia Cleanest Village & Nohkalikai Falls',
    destination: 'Shillong, Cherrapunji & Dawki',
    country: 'India',
    category: 'domestic',
    tag: 'EXPLORER PICK',
    duration: '6 Days / 5 Nights',
    nightsDays: '5N / 6D',
    originalPrice: 24999,
    price: 18999,
    rating: 4.9,
    reviewsCount: 320,
    imageUrl: 'https://images.unsplash.com/photo-1609137144820-22c6c1968884?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1609137144820-22c6c1968884?auto=format&fit=crop&w=800&q=80'
    ],
    hotelType: 'Luxury Boutique Cottages & Riverside Camps',
    highlights: [
      'Nongriat 3,500 Steps Double Decker Root Bridge Trek',
      'Transparent Umngot River Boating at Indo-Bangla Border',
      'Wei Sawdong 3-Tier Waterfall & Mawsmai Limestone Caves',
      'Bonfire & Barbecue nights with local tribal Khasi delicacies'
    ]
  },
  {
    id: 'pkg-spiti-valley',
    slug: 'spiti-valley-chandratal-expedition',
    title: 'Spiti Valley High Himalayan Expedition',
    subtitle: 'The Middle Land, Kaza, Key Monastery, Hikkim Highest Post Office & Chandratal',
    destination: 'Kaza, Tabo & Chandratal Lake',
    country: 'India',
    category: 'domestic',
    tag: 'EXPEDITION',
    duration: '9 Days / 8 Nights',
    nightsDays: '8N / 9D',
    originalPrice: 27999,
    price: 21999,
    rating: 4.9,
    reviewsCount: 450,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    hotelType: 'Handpicked Valley Homestays & Swiss Tents',
    highlights: [
      'Camping under the Milky Way at Turquoise Chandratal Lake',
      'Send a postcard from Hikkim — World’s Highest Post Office',
      '1,000-year-old Key & Dhankar Monasteries',
      'Kunzum Pass (14,931 ft) & Atal Tunnel crossings'
    ]
  },
  {
    id: 'pkg-dubai-luxury',
    slug: 'dubai-luxury-desert-safari-burj',
    title: 'Dazzling Dubai & Royal Desert Escape',
    subtitle: 'Burj Khalifa Top Floor, Luxury Marina Yacht Cruise & Premium Red Dune Safari',
    destination: 'Dubai & Abu Dhabi',
    country: 'United Arab Emirates',
    category: 'international',
    tag: 'LUXURY GETAWAY',
    duration: '5 Days / 4 Nights',
    nightsDays: '4N / 5D',
    originalPrice: 48999,
    price: 37999,
    rating: 4.8,
    reviewsCount: 510,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
    ],
    hotelType: '5-Star Downtown Hotel + Desert Glamping',
    highlights: [
      'At The Top - Burj Khalifa 124th & 125th Floor Observation',
      'VIP Desert Safari w/ Dune Bashing, Quad Biking & Belly Dance',
      'Dubai Marina Luxury Yacht Cruise with International Buffet',
      'Grand Sheikh Zayed Mosque Tour in Abu Dhabi'
    ]
  }
];

export const HONEYBEE_PILLARS = [
  {
    title: '100% Tailor-Made Itineraries',
    desc: 'No rigid schedules. Every itinerary is customized to your travel pace, preferences, and personal bucket list.',
    icon: 'Compass'
  },
  {
    title: 'Handpicked 4★ & 5★ Stays',
    desc: 'Personally vetted boutique resorts, private pool villas, and heritage stays that deliver utmost comfort.',
    icon: 'Hotel'
  },
  {
    title: '24/7 Dedicated Concierge',
    desc: 'Your personal trip manager is always on WhatsApp to assist with reservations, transfers, and real-time guidance.',
    icon: 'Headphones'
  },
  {
    title: 'Best Value & Zero Hidden Costs',
    desc: 'Transparent pricing with tax invoices, guaranteed best hotel rates, and premium inclusions from day one.',
    icon: 'ShieldCheck'
  }
];

export const HONEYBEE_TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Siddharth & Sneha Varma',
    city: 'Bengaluru',
    trip: 'Bali 7D Luxury Honeymoon',
    rating: 5,
    text: 'HoneybeeTrips made our honeymoon completely seamless! The private pool villa in Ubud and the Nusa Penida tour were straight out of a fairy tale. 24/7 WhatsApp support gave us so much peace of mind.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'test-2',
    name: 'Dr. Arjun Kulkarni',
    city: 'Mumbai',
    trip: 'The Traitors of Coorg Theme Escape',
    rating: 5,
    text: 'The Traitors theme trip was the most unique experience I have had in India. Nirjhara Estate was ultra-luxurious, and the murder mystery game kept 20 players on edge the whole time! Worth every penny.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'test-3',
    name: 'Meera Nambiar & Family',
    city: 'Hyderabad',
    trip: 'Kashmir Paradise Circuit',
    rating: 5,
    text: 'Traveling with elderly parents can be stressful, but HoneybeeTrips handled our transfers, private Shikara, and Gulmarg Gondola passes like clockwork. Truly 5-star service!',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  }
];

export const HONEYBEE_FAQS = [
  {
    question: 'What is HoneybeeTrips?',
    answer: 'HoneybeeTrips is a premier luxury travel and tour brand crafting bespoke international vacations, romantic honeymoons, domestic holidays, and signature themed experiences (like The Traitors Coorg) with end-to-end concierge support.'
  },
  {
    question: 'How do I book or customize a trip with HoneybeeTrips?',
    answer: 'Browse our curated packages on the website, click "Request Callback" or "Book via WhatsApp", and share your dates. Our travel architects will customize flights, stays, activities, and transfers to match your exact budget and vibe.'
  },
  {
    question: 'What is "The Traitors of Coorg" Theme Experience?',
    answer: 'It is our flagship 2-day live murder mystery and social deduction thriller getaway hosted at the 4-star Nirjhara Coffee Estate in Coorg. 20 players, 3 secret traitors, dramatic roundtables, physical trials, and a 100% refund prize for the winner(s)!'
  },
  {
    question: 'Do you provide Visa Assistance for International Holidays?',
    answer: 'Yes! We provide complete visa guidance, document verification, appointment booking, and flight/hotel reservation vouchers for destinations including Japan, Europe (Schengen), Vietnam, Dubai, Bali, and more.'
  },
  {
    question: 'What are your cancellation and refund policies?',
    answer: 'We offer flexible rescheduling and cancellation terms tailored to individual hotel and airline policies. Full details are shared transparently prior to booking confirmation.'
  }
];
