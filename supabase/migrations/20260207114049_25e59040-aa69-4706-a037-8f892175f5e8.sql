
-- Pages table for page management
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  meta_title text,
  meta_description text,
  og_image_url text,
  is_enabled boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view enabled pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Admins can insert pages" ON public.pages FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update pages" ON public.pages FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete pages" ON public.pages FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  tag text,
  icon_name text DEFAULT 'Monitor',
  price text,
  cta_text text DEFAULT 'Get More',
  display_order integer DEFAULT 0,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Site settings (key-value store)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site settings" ON public.site_settings FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Hero settings
CREATE TABLE public.hero_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  heading text NOT NULL DEFAULT 'Next-Level',
  heading_highlight text NOT NULL DEFAULT 'Digital Agency',
  heading_line2 text NOT NULL DEFAULT 'for Modern Brands',
  tagline text DEFAULT 'Design. Strategy. Growth. Built to perform.',
  description text,
  cta_primary_text text DEFAULT 'Start Your Project',
  cta_primary_link text DEFAULT '#contact',
  cta_secondary_text text DEFAULT 'View Services',
  cta_secondary_link text DEFAULT '#services',
  video_url text DEFAULT '/videos/hero-bg.mp4',
  video_enabled boolean NOT NULL DEFAULT true,
  overlay_opacity integer DEFAULT 70,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hero settings" ON public.hero_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update hero settings" ON public.hero_settings FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert hero settings" ON public.hero_settings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_hero_settings_updated_at BEFORE UPDATE ON public.hero_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Contact submissions
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  budget_range text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit (insert) but only admins can view/manage
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view submissions" ON public.contact_submissions FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update submissions" ON public.contact_submissions FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete submissions" ON public.contact_submissions FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Media library
CREATE TABLE public.media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  file_type text,
  file_size bigint,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media" ON public.media_library FOR SELECT USING (true);
CREATE POLICY "Admins can insert media" ON public.media_library FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete media" ON public.media_library FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

CREATE POLICY "Anyone can view media files" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins can upload media files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Admins can delete media files" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Seed default hero settings
INSERT INTO public.hero_settings (heading, heading_highlight, heading_line2, tagline, description, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, video_url, video_enabled, overlay_opacity)
VALUES ('Next-Level', 'Digital Agency', 'for Modern Brands', 'Design. Strategy. Growth. Built to perform.', 'NORYX is a global digital agency creating high-impact websites, brands, and digital experiences that help businesses stand out and scale with confidence.', 'Start Your Project', '#contact', 'View Services', '#services', '/videos/hero-bg.mp4', true, 70);

-- Seed default pages
INSERT INTO public.pages (title, slug, meta_title, meta_description, is_enabled, display_order) VALUES
('Home', '/', 'NORYX - Next-Level Digital Agency', 'NORYX is a global digital agency creating high-impact websites, brands, and digital experiences.', true, 0),
('Portfolio', '/portfolio', 'Portfolio - NORYX', 'View our latest projects and case studies.', true, 1),
('Contact', '/contact', 'Contact - NORYX', 'Get in touch with NORYX for your next project.', true, 2);

-- Seed default services
INSERT INTO public.services (title, description, tag, icon_name, price, cta_text, display_order) VALUES
('Website Design & Development', 'High-performance websites designed to look great, load fast, and convert visitors into customers.', 'Conversion-Focused', 'Monitor', '$2,500', 'Get More', 0),
('Brand Identity & Visual Design', 'Brand systems that communicate trust, personality, and value — from logos to complete visual identities.', 'Strategic & Distinctive', 'Palette', '$1,500', 'Get More', 1),
('E-Commerce Solutions', 'Custom e-commerce experiences optimized for product discovery, checkout flow, and long-term growth.', 'Built to Sell', 'ShoppingCart', '$3,000', 'Get More', 2),
('UI/UX & Digital Strategy', 'We design intuitive user experiences backed by research, behavior, and data.', 'User-Driven', 'Users', '$1,200', 'Get More', 3);

-- Seed default site settings
INSERT INTO public.site_settings (key, value) VALUES
('site_name', 'NORYX'),
('footer_copyright', '© {year} NORYX. All rights reserved.'),
('social_instagram', ''),
('social_twitter', ''),
('social_linkedin', ''),
('social_dribbble', '');
