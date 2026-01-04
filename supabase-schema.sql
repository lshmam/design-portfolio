-- SQL schema for Supabase portfolios table
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Create portfolios table
CREATE TABLE portfolios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    
    -- Personal info
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    headline TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT,
    website TEXT,
    linkedin_url TEXT,
    photo_url TEXT,
    
    -- Portfolio data (stored as JSONB)
    experiences JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    
    -- Settings
    template_style TEXT NOT NULL DEFAULT 'modern',
    hosting_option TEXT NOT NULL DEFAULT 'hosted',
    custom_domain TEXT,
    color_accent TEXT DEFAULT '#6366f1',
    
    -- Status
    is_paid BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster slug lookups
CREATE INDEX idx_portfolios_slug ON portfolios(slug);

-- Create index for published portfolios
CREATE INDEX idx_portfolios_published ON portfolios(is_published) WHERE is_published = true;

-- Enable Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published portfolios
CREATE POLICY "Public can view published portfolios" ON portfolios
    FOR SELECT
    USING (is_published = true);

-- Allow anonymous inserts (for creating portfolios without auth)
CREATE POLICY "Anyone can create portfolios" ON portfolios
    FOR INSERT
    WITH CHECK (true);

-- Allow updates to own portfolios (for now, allow all - you can add auth later)
CREATE POLICY "Anyone can update portfolios" ON portfolios
    FOR UPDATE
    USING (true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON portfolios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
