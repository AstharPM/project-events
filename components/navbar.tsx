'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Crown, Calendar } from 'lucide-react';
import Link from 'next/link';
import { tierColors, tierGradients, UserTier } from '@/lib/tier-utils';

export default function Navbar() {
  const { user } = useUser();
  const userTier = (user?.unsafeMetadata?.tier as UserTier) || 'free';

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">EventTier</span>
          </Link>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-gray-500" />
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${tierColors[userTier]}`}>
                  {userTier.toUpperCase()}
                </span>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}