
-- Create the ai_estimate_chatbot table
CREATE TABLE IF NOT EXISTS public.ai_estimate_chatbot (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_page_id uuid NOT NULL REFERENCES public.ai_estimate_results(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query text NOT NULL,
  response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_estimate_chatbot ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own chat history" ON public.ai_estimate_chatbot
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages" ON public.ai_estimate_chatbot
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ai_chatbot_page_id ON public.ai_estimate_chatbot(estimate_page_id);
CREATE INDEX IF NOT EXISTS idx_ai_chatbot_user_id ON public.ai_estimate_chatbot(user_id);
