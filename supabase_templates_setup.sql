-- SQL to create the templates table in Supabase
CREATE TABLE IF NOT EXISTS public.templates (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    html_content TEXT NOT NULL,
    type TEXT CHECK (type IN ('invoice', 'estimate')),
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the Premium Template
INSERT INTO public.templates (name, type, html_content)
VALUES ('Premium Blue', 'invoice', '<!DOCTYPE html><html>...</html>');
