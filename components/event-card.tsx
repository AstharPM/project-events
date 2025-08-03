'use client';

import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Lock } from 'lucide-react';
import { Event } from '@/lib/supabase';
import { tierColors, tierGradients, UserTier, canAccessEvent } from '@/lib/tier-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: Event;
  userTier: UserTier;
  onUpgrade?: () => void;
}

export default function EventCard({ event, userTier, onUpgrade }: EventCardProps) {
  const hasAccess = canAccessEvent(userTier, event.tier);
  const eventDate = new Date(event.event_date);

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
      hasAccess ? 'hover:scale-105' : 'opacity-75'
    }`}>
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Calendar className="h-16 w-16 text-blue-300" />
          )}
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge className={`${tierColors[event.tier]} font-medium`}>
            {event.tier.toUpperCase()}
          </Badge>
        </div>

        {!hasAccess && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Tier Locked</p>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {event.title}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{format(eventDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{format(eventDate, 'HH:mm')}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm line-clamp-3">
          {event.description}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        {hasAccess ? (
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            View Event Details
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full border-dashed"
            onClick={onUpgrade}
          >
            Upgrade to {event.tier.charAt(0).toUpperCase() + event.tier.slice(1)} to Access
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}