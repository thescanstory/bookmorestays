-- Add new columns for the Visual Validation engine
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS vibe_tags JSONB,
ADD COLUMN IF NOT EXISTS cinematic_video_url TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS official_website TEXT;

-- Create tour_requests table
CREATE TABLE IF NOT EXISTS public.tour_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_name TEXT NOT NULL,
    city TEXT,
    requested_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tour_requests
ALTER TABLE public.tour_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert requests
CREATE POLICY "Users can insert their own tour requests" 
ON public.tour_requests FOR INSERT 
WITH CHECK (auth.uid() = requested_by);

-- Allow anyone to read tour requests (optional, for admin panels)
CREATE POLICY "Anyone can read tour requests"
ON public.tour_requests FOR SELECT
USING (true);
