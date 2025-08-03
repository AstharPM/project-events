'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Calendar, Filter, Crown } from 'lucide-react';
import { supabase, Event } from '@/lib/supabase';
import { UserTier, getAccessibleTiers, tierColors } from '@/lib/tier-utils';
import Navbar from '@/components/navbar';
import EventCard from '@/components/event-card';
import LoadingSkeleton from '@/components/loading-skeleton';
import TierUpgradeModal from '@/components/tier-upgrade-modal';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EventsPage() {
  const { user, isLoaded } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const userTier = (user?.unsafeMetadata?.tier as UserTier) || 'free';
  const accessibleTiers = getAccessibleTiers(userTier);

  useEffect(() => {
    if (isLoaded) {
      fetchEvents();
    }
  }, [isLoaded]);

  useEffect(() => {
    filterEvents();
  }, [events, selectedTier, userTier]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError('Failed to fetch events. Please try again.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (selectedTier !== 'all') {
      filtered = events.filter(event => event.tier === selectedTier);
    }

    setFilteredEvents(filtered);
  };

  const accessibleEvents = filteredEvents.filter(event => 
    accessibleTiers.includes(event.tier)
  );

  const lockedEvents = filteredEvents.filter(event => 
    !accessibleTiers.includes(event.tier)
  );

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchEvents}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your Events
              </h1>
              <p className="text-gray-600">
                Discover events available to your {userTier} tier membership
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <Button
                onClick={() => setUpgradeModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Tier
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${tierColors[userTier]}`}>
              Your Tier: {userTier.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Accessible Events */}
        {accessibleEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Events ({accessibleEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accessibleEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  userTier={userTier}
                />
              ))}
            </div>
          </div>
        )}

        {/* Locked Events */}
        {lockedEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Premium Events ({lockedEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  userTier={userTier}
                  onUpgrade={() => setUpgradeModalOpen(true)}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Events */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No events found</h2>
            <p className="text-gray-600">
              {selectedTier === 'all' 
                ? 'No events are currently available.' 
                : `No ${selectedTier} tier events found.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <TierUpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentTier={userTier}
      />
    </div>
  );
}