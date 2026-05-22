
-- Grant permissions to the chatbot table
GRANT ALL ON TABLE ai_estimate_chatbot TO authenticated, service_role;

-- Disable RLS temporarily to ensure it works, or you can add proper policies
ALTER TABLE ai_estimate_chatbot DISABLE ROW LEVEL SECURITY;

-- If you want to keep RLS, use these policies instead (optional):
-- CREATE POLICY "Allow users to manage their own chat history" ON ai_estimate_chatbot
-- FOR ALL TO authenticated USING (auth.uid() = user_id);
