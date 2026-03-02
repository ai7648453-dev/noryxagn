
-- Create faqs table
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer DEFAULT 0,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Public read for enabled FAQs
CREATE POLICY "Anyone can view enabled faqs" ON public.faqs
  FOR SELECT USING (true);

-- Admin full CRUD
CREATE POLICY "Admins can insert faqs" ON public.faqs
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update faqs" ON public.faqs
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete faqs" ON public.faqs
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed existing FAQs
INSERT INTO public.faqs (question, answer, display_order) VALUES
  ('How long does a typical project take?', 'Most projects take 3–6 weeks depending on scope, content readiness, and feedback cycles.', 1),
  ('Do you work with international clients?', 'Yes. NORYX works with clients worldwide using streamlined remote collaboration.', 2),
  ('What platforms do you build on?', 'We work with modern, scalable platforms and custom solutions based on your needs — always choosing what fits the project best.', 3),
  ('Can you redesign an existing website?', 'Absolutely. We frequently redesign outdated or underperforming websites.', 4),
  ('Do you provide ongoing support?', 'Yes. Maintenance, updates, and ongoing optimization are available after launch.', 5),
  ('Is SEO included?', 'We build with SEO best practices in mind. Advanced SEO services can be added if needed.', 6),
  ('Do you help with content?', 'Yes. We can assist with structure, messaging, and UX-focused copy.', 7),
  ('What do you need from us to start?', 'A clear goal, basic business information, and timely feedback during the process.', 8),
  ('How do payments work?', 'Projects are typically split into milestone payments.', 9);
