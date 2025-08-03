'use client';

import { useEffect, useState } from 'react';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Calendar, Crown, Users, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/navbar';
import Link from 'next/link';

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to Your Event Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover exclusive events tailored to your membership tier
          </p>
          <Link href="/events">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              View My Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Exclusive Events for
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {' '}Every Tier
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our tier-based event platform and unlock access to premium workshops, 
            conferences, and networking opportunities based on your membership level.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Get Started Free
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-xl font-semibold mb-2">Tier-Based Access</h3>
              <p className="text-gray-600">
                Access events based on your membership tier - from free community meetups to exclusive platinum conferences.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">Premium Events</h3>
              <p className="text-gray-600">
                From beginner workshops to executive forums - find events that match your professional level and interests.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Networking</h3>
              <p className="text-gray-600">
                Connect with like-minded professionals and industry leaders at events tailored to your tier.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tiers Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Tier</h2>
          <p className="text-xl text-gray-600">
            Start free and upgrade as you grow
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Free', color: 'gray', events: 'Community Events' },
            { name: 'Silver', color: 'slate', events: 'Advanced Workshops' },
            { name: 'Gold', color: 'yellow', events: 'Exclusive Bootcamps' },
            { name: 'Platinum', color: 'purple', events: 'Executive Forums' },
          ].map((tier) => (
            <Card key={tier.name} className="text-center p-6 hover:shadow-lg transition-all hover:scale-105">
              <CardContent className="pt-6">
                <Crown className={`h-8 w-8 mx-auto mb-3 text-${tier.color}-500`} />
                <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                <p className="text-gray-600 text-sm">{tier.events}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}