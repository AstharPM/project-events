# Tier-Based Event Showcase

A responsive web application that allows logged-in users to view events based on their membership tier (Free, Silver, Gold, Platinum). Built with Next.js 14, Clerk authentication, and Supabase.

## 🚀 How I Built This Project

### Development Process

1. **Project Initialization**
   - Created a new Next.js 14 project with TypeScript
   - Set up Tailwind CSS for styling
   - Integrated shadcn/ui for beautiful, accessible components

2. **Authentication Setup**
   - Integrated Clerk.dev for secure user authentication
   - Configured sign-in/sign-up pages with custom styling
   - Set up middleware for route protection
   - Implemented user metadata for tier management

3. **Database Design**
   - Designed PostgreSQL schema with Supabase
   - Created events table with tier-based access control
   - Implemented Row Level Security (RLS) policies
   - Added sample data for all tiers

4. **Frontend Development**
   - Built responsive event cards with tier indicators
   - Implemented tier-based filtering logic
   - Created loading states and error handling
   - Added tier upgrade simulation feature

5. **UI/UX Enhancements**
   - Color-coded tier badges and visual hierarchy
   - Smooth animations and hover effects
   - Mobile-first responsive design
   - Professional layout with proper spacing

## ✨ Features

- **Tier-Based Access Control**: Users can only see events available to their tier or lower
- **Authentication**: Secure login/signup with Clerk.dev
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Data**: Events stored and fetched from Supabase PostgreSQL
- **Tier Upgrades**: Simulate tier upgrades with metadata updates
- **Loading States**: Smooth loading experiences and error handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Authentication**: Clerk.dev
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **TypeScript**: For type safety
- **Form Handling**: React Hook Form with Zod validation

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js 18+** installed on your system
- **Git** for cloning the repository
- **Supabase account** and project created
- **Clerk.dev account** and application created
- **Code editor** (VS Code recommended)

## 🚀 Complete Setup Instructions

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repository-url>
cd tier-based-event-showcase

# Install dependencies
npm install
```

### Step 2: Set Up Supabase Database

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Set Up Database Schema**
   
   **Option A: Using SQL Editor (Recommended)**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `database-setup.sql`:

```sql
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
```

   **Option B: Using the Seed Script**
   ```bash
   # Set up environment variables first (see Step 3)
   # Then run the seed script
   node scripts/seed-database.js
   ```

3. **Get Supabase Credentials**
   - Go to Settings > API in your Supabase dashboard
   - Copy the Project URL and anon key
   - For the service role key, go to Settings > API > Project API keys

### Step 3: Set Up Clerk Authentication

1. **Create a Clerk Application**
   - Go to [clerk.dev](https://clerk.dev)
   - Create a new application
   - Choose "Next.js" as your framework

2. **Configure Clerk Settings**
   - In your Clerk dashboard, go to "User & Authentication" > "Metadata"
   - Add a public metadata field:
     - **Field name**: `tier`
     - **Type**: String
     - **Possible values**: `free`, `silver`, `gold`, `platinum`
     - **Default value**: `free`

3. **Get Clerk Credentials**
   - Go to API Keys in your Clerk dashboard
   - Copy the Publishable Key and Secret Key

### Step 4: Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### Step 5: Run the Application

```bash
# Start the development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Step 6: Test Different Tiers

To test the tier-based functionality:

1. **Create Test Accounts**
   - Sign up with different email addresses
   - Each new user starts with the "free" tier

2. **Update User Tiers in Clerk Dashboard**
   - Go to your Clerk dashboard > Users
   - Click on a user
   - Go to "Metadata" tab
   - Update the `tier` field to one of: `free`, `silver`, `gold`, `platinum`

3. **Or Use In-App Tier Upgrade**
   - Log in to the application
   - Click on a premium event
   - Use the tier upgrade modal to simulate upgrades



## 🎯 Tier Access Rules

- **Free**: Can access Free events only
- **Silver**: Can access Free + Silver events
- **Gold**: Can access Free + Silver + Gold events
- **Platinum**: Can access all events (Free + Silver + Gold + Platinum)

## 🔧 Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   - Make sure `.env.local` is in the root directory
   - Restart the development server after adding environment variables
   - Check that all keys are copied correctly

2. **Database Connection Issues**
   - Verify your Supabase URL and keys are correct
   - Check that Row Level Security is enabled
   - Ensure the events table exists and has data

3. **Authentication Problems**
   - Verify Clerk keys are correct
   - Check that user metadata is configured properly
   - Clear browser cache and cookies

4. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors with `npm run lint`
   - Verify all imports are correct

### Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev



