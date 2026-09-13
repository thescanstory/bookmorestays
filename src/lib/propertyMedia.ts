/**
 * Centralized Real Luxury Property & Destination Photography Registry
 * High-definition real architectural, bedroom, infinity pool, and landscape photography.
 */

export interface PropertyMedia {
  cover: string;
  gallery: string[];
}

const DESTINATION_GALLERIES: Record<string, string[]> = {
  coorg: [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=85', // Luxury villa exterior
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=85', // Luxury master bedroom
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=85', // Poolside estate
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=85', // Modern suite
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=85'  // Plantation resort
  ],
  udaipur: [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=85', // Palace architecture
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=85', // Royal bedroom
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=85', // Lakefront resort
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=85', // Courtyard pool
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=85'  // Heritage lounge
  ],
  goa: [
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=85', // Beachfront resort
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop&q=85', // Tropical pool villa
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop&q=85', // Luxury balcony sunset
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=85', // Private cabana
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=85'  // Sea view suite
  ],
  manali: [
    'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1200&auto=format&fit=crop&q=85', // Mountain chalet
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=85', // Alpine wooden suite
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=85', // Heated Jacuzzi deck
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=85'  // Snow peak panorama
  ],
  ooty: [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=85', // Tea estate mansion
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=85', // British colonial cottage
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=85', // Fireplace suite
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=85'  // Pine forest glasshouse
  ],
  kabini: [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=85', // River safari lodge
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=85', // Waterfront tented villa
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=85', // Wildlife observation deck
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=85'  // Plunge pool cottage
  ],
  bangalore: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=85', // 5-Star luxury hotel
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=85', // Penthouse suite
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=85', // Presidential bedroom
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop&q=85'  // Rooftop infinity pool
  ],
  jaipur: [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=85', // Royal palace
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=85', // Heritage courtyard
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=85', // Marble suite
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=85'  // Palace pavilion
  ],
  wayanad: [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=85', // Rainforest treehouse villa
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=85', // Valley view bedroom
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=85', // Infinity pool
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=85'  // Plantation estate
  ],
  chikmagalur: [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=85', // Coffee estate bungalow
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=85', // Pool villa
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=85', // Mountain suite
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=85'  // Glass cottage
  ],
  mysore: [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=85', // Royal heritage hotel
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=85', // Garden estate
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=85'  // Heritage suite
  ],
  default: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=85'
  ]
};

// Seed hash function to deterministically assign beautiful real photos
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns real high-definition cover and gallery pictures for any property.
 */
export function getPropertyRealMedia(propertyName: string = '', city: string = ''): PropertyMedia {
  const cityKey = (city || '').toLowerCase().trim();
  const galleryPool = DESTINATION_GALLERIES[cityKey] || DESTINATION_GALLERIES.default;
  
  const hash = hashString(`${propertyName}-${city}`);
  const startIndex = hash % galleryPool.length;
  
  // Create a reordered sequence for variety
  const reordered = [
    galleryPool[startIndex],
    ...galleryPool.slice(0, startIndex),
    ...galleryPool.slice(startIndex + 1)
  ];

  return {
    cover: reordered[0] || galleryPool[0],
    gallery: reordered
  };
}

export interface TraitorsSlideItem {
  id: number;
  url: string;
  title: string;
  subtitle: string;
  badge: string;
  category: 'story' | 'resort' | 'itinerary' | 'game' | 'action';
}

export const TRAITORS_COORG_SLIDES: TraitorsSlideItem[] = [
  {
    id: 1,
    url: '/traitors/official/traitors_slide_14.jpeg',
    title: 'The Traitors of Coorg',
    subtitle: 'A Weekend Of Lies, Deception & Betrayal In A 4 Star Boutique Resort',
    badge: 'Exclusive Premiere',
    category: 'story'
  },
  {
    id: 2,
    url: '/traitors/official/traitors_slide_8.jpeg',
    title: 'Day 1: The Game Begins...',
    subtitle: '20 Players. 3 Traitors (Trying To Kill You). Figure out who is the Traitor or get killed by one.',
    badge: 'The Stakes',
    category: 'game'
  },
  {
    id: 3,
    url: '/traitors/official/traitors_slide_9.jpeg',
    title: 'The Game of Deception',
    subtitle: 'Starts as soon as you enter. Secret alliances, whispered clues, and round table trials.',
    badge: 'Social Deduction',
    category: 'game'
  },
  {
    id: 4,
    url: '/traitors/official/traitors_slide_7.jpeg',
    title: "Everything's Provided",
    subtitle: 'All gourmet meals, luxury estate amenities, curated games, private sightseeing & 4-star boutique resort sanctuary.',
    badge: 'All-Inclusive Luxury',
    category: 'resort'
  },
  {
    id: 5,
    url: '/traitors/official/traitors_slide_13.jpeg',
    title: 'The Stay: Nirjhara Coorg',
    subtitle: 'A beautiful property tucked away amidst lush nature near Somwarpet with streams & waterfall.',
    badge: '4-Star Sanctuary',
    category: 'resort'
  },
  {
    id: 6,
    url: '/traitors/official/traitors_slide_2.jpeg',
    title: 'A Walk Through A Coffee Plantation',
    subtitle: 'Misty morning plantation strolls, hidden clues, and lush green estate immersion.',
    badge: 'Estate Trails',
    category: 'itinerary'
  },
  {
    id: 7,
    url: '/traitors/official/traitors_slide_3.jpeg',
    title: 'Visit A Chocolate Factory',
    subtitle: 'Artisanal handcrafted chocolate tastings and private plantation confectionery tour.',
    badge: 'Gourmet Experience',
    category: 'itinerary'
  },
  {
    id: 8,
    url: '/traitors/official/traitors_slide_11.jpeg',
    title: 'Private Stream & Waterfall + Multi Cuisine Dining',
    subtitle: 'Cascading natural waters inside the resort estate and multi-cuisine gourmet dining.',
    badge: 'Natural Waterfall',
    category: 'resort'
  },
  {
    id: 9,
    url: '/traitors/official/traitors_slide_12.jpeg',
    title: 'The Swimming Pool',
    subtitle: 'Heated twilight waters and panoramic jungle canopy deck.',
    badge: 'Infinity Pool',
    category: 'resort'
  },
  {
    id: 10,
    url: '/traitors/official/traitors_slide_10.jpeg',
    title: 'Bonfire Courtyard',
    subtitle: 'Illuminated stone arena for evening round-table discussions and heated debates.',
    badge: 'Night Arena',
    category: 'resort'
  },
  {
    id: 11,
    url: '/traitors/official/traitors_slide_4.jpeg',
    title: "The Fun Doesn't End",
    subtitle: 'Bonfire night, barbecue feasts, music, and fireside round table bonding — sleep or don’t!',
    badge: 'Night Banquet',
    category: 'itinerary'
  },
  {
    id: 12,
    url: '/traitors/official/traitors_slide_6.jpeg',
    title: 'See The Sunrise At Mandalpatti',
    subtitle: 'Day 2 early morning 4x4 Jeep safari above the rolling sea of clouds.',
    badge: 'Mandalpatti Peak',
    category: 'itinerary'
  },
  {
    id: 13,
    url: '/traitors/official/traitors_slide_5.jpeg',
    title: 'Day 2: The Winner Gets The Prize Money',
    subtitle: 'The game ends but the experience doesn’t. 100% trip refund for the victorious players.',
    badge: 'Prize Bounty',
    category: 'game'
  },
  {
    id: 14,
    url: '/traitors/official/traitors_slide_1.jpeg',
    title: 'Interested In Joining Us?',
    subtitle: 'Limited to 20 players only. Request your invite today and secure your spot.',
    badge: 'Invite Only',
    category: 'action'
  }
];

export const TRAITORS_COORG_MEDIA = {
  id: 'DdMP_hKGaZZ',
  instagram_url: 'https://www.instagram.com/p/DdMP_hKGaZZ/?hl=en&img_index=1',
  bookmore_instagram: 'https://www.instagram.com/bookmore.stays/?hl=en',
  nirjhara_instagram: 'https://www.instagram.com/nirjhara_coorg/',
  traitors_uk_instagram: 'https://www.instagram.com/ukthetraitors/?hl=en',
  title: 'The Traitors of Coorg',
  subtitle: '2-Day Mystery Stay & Social Deduction Getaway',
  tagline: "Everyone's got a trip planned. This one's got a plot twist.",
  dates: 'September 26th - 27th, 2026',
  destination: 'Bengaluru <> Coorg',
  estate: 'Nirjhara Coorg — 4-Star Boutique Resort, Somwarpet',
  players: '20 Players & 3 Traitors',
  prize: 'Winner Takes It All — For Free! Beat everyone, and your entire trip is on the house.',
  direct_price: 14999,
  mmt_price: 21999,
  whatsapp_number: '+919738397933',
  whatsapp_community_link: 'https://wa.me/919738397933?text=Hey!%20I%20would%20like%20to%20join%20the%20Bookmore%20Stays%20WhatsApp%20Community%20🗡️',
  whatsapp_message: 'Hi Bookmorestays, I want to request an invite for The Traitors of Coorg (Sep 26-27). Please share available slots!',
  slides: TRAITORS_COORG_SLIDES,
  images: TRAITORS_COORG_SLIDES.map(s => s.url),
  video_url: 'https://assets.mixkit.co/videos/preview/mixkit-infinity-pool-in-a-luxury-hotel-4131-large.mp4',
  highlights: [
    'Private Waterfall Inside the Resort Estate',
    'Artisan Chocolate Factory Tour & Tasting',
    'Mandalpatti Cloud-Peak Sunrise Safari',
    'Coffee Plantation Secret Trails',
    'Banishment Round Tables & Murder Missions',
    'Bengaluru <> Coorg Luxury AC Coach Transfers',
    'All Gourmet Multi-Cuisine Meals & Bonfire Feast'
  ]
};

/**
 * Parses clean Instagram reel/post shortcode from any IG URL format
 */
export function parseInstagramShortcode(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:instagram\.com\/(?:p|reel|tv)\/)([A-Za-z0-9_-]+)/i);
  return match ? match[1] : null;
}

/**
 * Constructs clean Instagram reel thumbnail preview CDN link
 */
export function getInstagramThumbnailUrl(shortcode: string): string {
  if (!shortcode) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
  return `https://www.instagram.com/p/${shortcode}/media/?size=l`;
}

