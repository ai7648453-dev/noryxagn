
-- Create marketplace listing status enum
CREATE TYPE public.listing_status AS ENUM ('pending', 'approved', 'rejected');

-- Create marketplace_listings table
CREATE TABLE public.marketplace_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  contact_email TEXT NOT NULL,
  status listing_status NOT NULL DEFAULT 'pending',
  is_admin_listing BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  submitted_by_user_id UUID,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved listings
CREATE POLICY "Anyone can view approved listings"
ON public.marketplace_listings
FOR SELECT
USING (status = 'approved');

-- Admins can view ALL listings (including pending/rejected)
CREATE POLICY "Admins can view all listings"
ON public.marketplace_listings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone (even anonymous) can submit a listing
CREATE POLICY "Anyone can submit a listing"
ON public.marketplace_listings
FOR INSERT
WITH CHECK (
  is_admin_listing = false
  AND status = 'pending'
);

-- Admins can insert (for admin listings)
CREATE POLICY "Admins can insert listings"
ON public.marketplace_listings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update
CREATE POLICY "Admins can update listings"
ON public.marketplace_listings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete listings"
ON public.marketplace_listings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_marketplace_listings_updated_at
BEFORE UPDATE ON public.marketplace_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
