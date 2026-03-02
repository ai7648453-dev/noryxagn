-- Drop the restrictive SELECT policy and replace with a permissive one
DROP POLICY IF EXISTS "Anyone can view enabled faqs" ON faqs;

CREATE POLICY "Anyone can view enabled faqs"
  ON faqs FOR SELECT
  TO public
  USING (is_enabled = true);