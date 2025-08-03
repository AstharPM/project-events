-- Create events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  image_url TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'silver', 'gold', 'platinum')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read events
CREATE POLICY "Allow authenticated users to read events" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insert sample events data
INSERT INTO events (title, description, event_date, image_url, tier) VALUES
  (
    'Community Meetup',
    'Join our monthly community meetup to network with fellow developers and share knowledge.',
    '2024-02-15T18:00:00Z',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
    'free'
  ),
  (
    'Web Development Intro',
    'Learn the basics of web development with HTML, CSS, and JavaScript.',
    '2024-02-20T19:00:00Z',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    'free'
  ),
  (
    'JavaScript Workshop',
    'Deep dive into modern JavaScript features and best practices.',
    '2024-02-25T14:00:00Z',
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop',
    'silver'
  ),
  (
    'UI/UX Masterclass',
    'Master the principles of user interface and user experience design.',
    '2024-03-01T10:00:00Z',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    'silver'
  ),
  (
    'Full-Stack Bootcamp',
    'Comprehensive bootcamp covering frontend, backend, and database development.',
    '2024-03-05T09:00:00Z',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
    'gold'
  ),
  (
    'Cloud Architecture Summit',
    'Learn about cloud-native architecture and deployment strategies.',
    '2024-03-10T11:00:00Z',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    'gold'
  ),
  (
    'Executive Forum',
    'Exclusive forum for tech executives to discuss industry trends and strategies.',
    '2024-03-15T16:00:00Z',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    'platinum'
  ),
  (
    'AI Conference',
    'Cutting-edge AI conference featuring industry leaders and breakthrough technologies.',
    '2024-03-20T13:00:00Z',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    'platinum'
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 