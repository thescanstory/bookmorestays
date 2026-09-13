-- Create properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  video_url TEXT,
  direct_price NUMERIC,
  mmt_price NUMERIC,
  whatsapp_number TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public Read Access" 
ON properties 
FOR SELECT 
TO public 
USING (true);

-- Insert mock data
INSERT INTO properties (name, city, video_url, direct_price, mmt_price, whatsapp_number, description)
VALUES 
('The Goa Villa', 'Goa', 'https://example.com/goa_villa_tour.mp4', 25000, 30000, '+919876543210', 'A luxurious sea-facing villa in North Goa with a private pool.'),
('The Jaipur Palace', 'Jaipur', 'https://example.com/jaipur_palace_tour.mp4', 45000, 52000, '+919876543211', 'Live like royalty in this heritage palace with authentic Rajasthani architecture.');

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-videos', 'property-videos', true)
ON CONFLICT (id) DO NOTHING;
