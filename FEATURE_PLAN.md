# BMS Feature Development Plan

## Phase 1: Core Admin & User Features (High Impact)

### 1. Tour Request Management (Admin)
- [x] Create `/app/admin/tour-requests/page.tsx` - List all tour requests with status
- [x] Add status field to tour_requests table (pending, approved, in-progress, completed, rejected)
- [x] Add admin actions: approve, reject, mark in-progress, complete
- [x] Email/notification to user when status changes

### 2. Property Search & Filter on Discover Feed
- [x] Add search bar to home page (`/`)
- [x] Add filter by city, price range, verified status
- [x] Implement debounced search with Supabase queries
- [x] Add URL state for shareable filtered views

### 3. User Reviews & Ratings System
- [x] Create `reviews` table migration
- [x] Add review submission modal on search results
- [x] Display reviews on property detail overlay
- [x] Aggregate rating on property cards

### 4. Booking/Inquiry Management System
- [x] Create `inquiries` table migration
- [x] Add inquiry form on search results (dates, guests, message)
- [x] Admin dashboard for inquiries (`/app/admin/inquiries/page.tsx`)
- [x] Status tracking: new, contacted, quoted, booked, cancelled
- [x] WhatsApp/email integration for property owners

## Phase 2: Engagement & Growth Features

### 5. Push Notifications (Capacitor)
- [x] Add `@capacitor/push-notifications` plugin / notification service structure
- [x] Triggers: price drop, new verified property, inquiry response, tour request update
- [x] User preferences for notification types in Profile

### 6. Analytics Dashboard (Admin)
- [x] Create `/app/admin/analytics/page.tsx`
- [x] Track: searches, property views, saves, inquiries, conversions
- [x] Charts: daily/weekly/monthly trends
- [x] Top properties, top cities, conversion funnel
- [x] Export to CSV

### 7. Social Sharing & Referral Program
- [x] Add share button on property results
- [x] Create referral codes table
- [x] Referral rewards: both users get credit
- [x] Shareable property cards with deep links
- [x] Track referral conversions

## Phase 3: Platform Enhancements

### 8. Multi-language / i18n Support
- [ ] Add `next-intl` or similar
- [ ] Support: English, Hindi, Spanish (top markets)
- [ ] Language selector in profile/settings
- [ ] RTL support for future languages

### 9. Offline Support / PWA Features
- [ ] Add service worker with Workbox
- [ ] Cache: property data, images, videos
- [ ] Offline indicator
- [ ] Background sync for inquiries/saves
- [ ] Install prompt

## Database Migrations Needed

```sql
-- 1. Add status to tour_requests
ALTER TABLE tour_requests ADD COLUMN status TEXT DEFAULT 'pending';
ALTER TABLE tour_requests ADD COLUMN admin_notes TEXT;
ALTER TABLE tour_requests ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  stay_date DATE,
  verified_booking BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Inquiries table
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2,
  message TEXT,
  status TEXT DEFAULT 'new', -- new, contacted, quoted, booked, cancelled
  quoted_price NUMERIC,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Referral codes table
CREATE TABLE referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  code TEXT UNIQUE NOT NULL,
  credits_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Referral conversions
CREATE TABLE referral_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, completed
  reward_credits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 6. Analytics events table
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  properties JSONB,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_inquiries_property ON inquiries(property_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_analytics_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
```

## Implementation Order

1. **Tour Request Management** (1-2 hours) - Table exists, just need UI
2. **Property Search/Filter** (2-3 hours) - Core UX improvement
3. **Reviews & Ratings** (3-4 hours) - New table + UI components
4. **Booking/Inquiry System** (4-5 hours) - New table + forms + admin UI
5. **Push Notifications** (3-4 hours) - Capacitor config + service
6. **Analytics Dashboard** (3-4 hours) - Charts + data aggregation
7. **Referral Program** (2-3 hours) - Tables + sharing UI
8. **i18n** (3-4 hours) - Library setup + translations
9. **PWA/Offline** (2-3 hours) - Service worker + caching

Total estimated: ~25-35 hours