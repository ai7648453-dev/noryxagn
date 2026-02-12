
-- Add phone and page_source columns to contact_submissions
ALTER TABLE public.contact_submissions
  ADD COLUMN phone text,
  ADD COLUMN page_source text;
