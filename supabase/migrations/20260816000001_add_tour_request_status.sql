-- Add status and tracking fields to tour_requests
ALTER TABLE public.tour_requests 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add check constraint for valid statuses
ALTER TABLE public.tour_requests 
ADD CONSTRAINT tour_requests_status_check 
CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'rejected'));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_tour_requests_updated_at ON public.tour_requests;
CREATE TRIGGER update_tour_requests_updated_at
    BEFORE UPDATE ON public.tour_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();