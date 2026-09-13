-- Create referral_codes table
CREATE TABLE IF NOT EXISTS public.referral_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    code TEXT UNIQUE NOT NULL,
    credits_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own referral code
CREATE POLICY "Users can read their own referral code" 
ON public.referral_codes 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow users to insert their own referral code
CREATE POLICY "Users can insert their own referral code" 
ON public.referral_codes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create referral_conversions table
CREATE TABLE IF NOT EXISTS public.referral_conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    reward_credits INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Add check constraint for valid statuses
ALTER TABLE public.referral_conversions 
ADD CONSTRAINT referral_conversions_status_check 
CHECK (status IN ('pending', 'completed'));

-- Enable RLS
ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own conversions (as referrer or referred)
CREATE POLICY "Users can read their own conversions" 
ON public.referral_conversions 
FOR SELECT 
TO authenticated 
USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Allow system to insert conversions
CREATE POLICY "System can insert conversions" 
ON public.referral_conversions FOR INSERT 
WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_referral_codes_user ON public.referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referrer ON public.referral_conversions(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referred ON public.referral_conversions(referred_id);