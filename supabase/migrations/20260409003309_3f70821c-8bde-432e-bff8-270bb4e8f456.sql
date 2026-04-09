
-- Add user_id column (nullable for now to handle existing data)
ALTER TABLE public.checklist_items
  ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Anyone can view checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can update checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can insert checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can delete checklist items" ON public.checklist_items;

-- New user-scoped policies
CREATE POLICY "Users can view their own items"
  ON public.checklist_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items"
  ON public.checklist_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
  ON public.checklist_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
  ON public.checklist_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
