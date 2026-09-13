-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_name TEXT NOT NULL,
    properties JSONB,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for admin analytics)
CREATE POLICY "Public Read Access" 
ON public.analytics_events 
FOR SELECT 
TO public 
USING (true);

-- Allow system to insert events
CREATE POLICY "System can insert events" 
ON public.analytics_events FOR INSERT 
WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON public.analytics_events(session_id);