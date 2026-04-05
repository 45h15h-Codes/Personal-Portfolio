-- 1. Projects Table
CREATE TABLE projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  detailed_description text,
  thumbnail text,
  images text[] DEFAULT '{}',
  tags text[] NOT NULL,
  demo_link text,
  github_link text,
  featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Skills Table
CREATE TABLE skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL, -- e.g., 'Frontend', 'Backend'
  name text NOT NULL,
  level integer NOT NULL, -- percentage
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Currently Building Table
CREATE TABLE building (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  progress integer NOT NULL,
  is_live boolean DEFAULT false,
  commits integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Guestbook Table
CREATE TABLE guestbook (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  project text,
  message text NOT NULL,
  color text NOT NULL,
  dark boolean DEFAULT false,
  rotate text NOT NULL,
  approved boolean DEFAULT false, -- Requires admin approval
  created_at timestamp with time zone DEFAULT now()
);

-- 5. Profile Table
CREATE TABLE profile (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  headline text NOT NULL,
  tagline text NOT NULL,
  description text NOT NULL,
  email text NOT NULL,
  years_exp text NOT NULL,
  projects_completed text NOT NULL,
  clients text NOT NULL
);

-- 6. Social Links Table
CREATE TABLE social_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  platform text NOT NULL, -- e.g., 'GitHub', 'Instagram'
  handle text NOT NULL,
  url text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- SETTING UP ROW LEVEL SECURITY (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE building ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- 1. CREATE POLICIES FOR PUBLIC READ ACCESS
CREATE POLICY "Public profiles are viewable by everyone." ON profile FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone." ON projects FOR SELECT USING (true);
CREATE POLICY "Public skills are viewable by everyone." ON skills FOR SELECT USING (true);
CREATE POLICY "Public building are viewable by everyone." ON building FOR SELECT USING (true);
CREATE POLICY "Public social links are viewable by everyone." ON social_links FOR SELECT USING (true);
-- Guestbook is only readable if approved = true
CREATE POLICY "Approved guestbook notes are viewable by everyone." ON guestbook FOR SELECT USING (approved = true);

-- 2. GUESTBOOK PUBLIC INSERT
CREATE POLICY "Anyone can insert guestbook notes" ON guestbook FOR INSERT WITH CHECK (true);

-- 3. ADMIN FULL ACCESS
CREATE POLICY "Admin can do everything on profile" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can do everything on projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can do everything on skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can do everything on building" ON building FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can do everything on social links" ON social_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can do everything on guestbook" ON guestbook FOR ALL USING (auth.role() = 'authenticated');

-- INITIAL DATA SEED
INSERT INTO profile (headline, tagline, description, email, years_exp, projects_completed, clients) 
VALUES (
  'Full Stack Developer & Creative Engineer',
  'Building Bold & Fast Experiences.',
  'I craft developer-focused, high-performance web apps with clean architecture, sharp design, and zero compromises.',
  'ashishvala2004@gmail.com',
  '1+', '20+', '10+'
);

INSERT INTO social_links (platform, handle, url) VALUES 
('GitHub', '@ashish-dev', 'https://github.com/ashish'),
('LinkedIn', 'in/ashish-dev', 'https://linkedin.com/in/ashish'),
('Twitter/X', '@ashish_dev', 'https://twitter.com/ashish_dev');

INSERT INTO skills (category, name, level) VALUES
('Frontend', 'React / Next.js', 90),
('Frontend', 'Tailwind CSS', 95),
('Backend', 'Node.js', 85),
('Backend', 'PostgreSQL', 80),
('DevOps', 'Docker', 75),
('Tools', 'Git & GitHub', 90);

-- 7. Contact Messages Table
CREATE TABLE contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can do everything on contact messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- 8. Storage Buckets (Run manually in Supabase SQL Editor if buckets UI is preferred)
INSERT INTO storage.buckets (id, name, public) VALUES ('project_images', 'project_images', true);
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'project_images' );
CREATE POLICY "Admin CRUD" ON storage.objects FOR ALL USING ( auth.role() = 'authenticated' AND bucket_id = 'project_images' );
