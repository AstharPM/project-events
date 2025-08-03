'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Crown, Check, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { tierColors, tierGradients, UserTier } from '@/lib/tier-utils';

interface TierUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: UserTier;
}

const tierFeatures: Record<UserTier, string[]> = {
  free: ['Access to community events', 'Basic networking opportunities'],
  silver: ['All Free features', 'Advanced workshops', 'Priority support'],
  gold: ['All Silver features', 'Exclusive bootcamps', 'Industry summits', '1-on-1 mentoring'],
  platinum: ['All Gold features', 'Executive forums', 'Innovation conferences', 'VIP networking'],
};

const tierPrices: Record<UserTier, string> = {
  free: 'Free',
  silver: '$29/month',
  gold: '$99/month',
  platinum: '$299/month',
};

export default function TierUpgradeModal({ isOpen, onClose, currentTier }: TierUpgradeModalProps) {
  const { user } = useUser();
  const [upgrading, setUpgrading] = useState<UserTier | null>(null);

  const handleUpgrade = async (newTier: UserTier) => {
    if (!user) return;
    
    setUpgrading(newTier);
    
    try {
      // Simulate upgrade process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user metadata
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          tier: newTier,
        },
      });
      
      onClose();
      window.location.reload(); // Refresh to show new events
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setUpgrading(null);
    }
  };

  const tiers: UserTier[] = ['free', 'silver', 'gold', 'platinum'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Upgrade Your Membership
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {tiers.map((tier) => {
            const isCurrentTier = tier === currentTier;
            const isUpgrade = tiers.indexOf(tier) > tiers.indexOf(currentTier);
            
            return (
              <div
                key={tier}
                className={`relative p-6 rounded-lg border-2 transition-all ${
                  isCurrentTier 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {isCurrentTier && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Current Plan
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <Crown className={`h-8 w-8 mx-auto mb-3 bg-gradient-to-r ${tierGradients[tier]} bg-clip-text text-transparent`} />
                  <h3 className="text-lg font-semibold capitalize mb-2">{tier}</h3>
                  <p className="text-2xl font-bold mb-4">{tierPrices[tier]}</p>
                  
                  <ul className="text-sm space-y-2 mb-6">
                    {tierFeatures[tier].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {isCurrentTier ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : isUpgrade ? (
                    <Button
                      onClick={() => handleUpgrade(tier)}
                      disabled={upgrading !== null}
                      className={`w-full bg-gradient-to-r ${tierGradients[tier]} hover:opacity-90`}
                    >
                      {upgrading === tier ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Upgrading...
                        </>
                      ) : (
                        `Upgrade to ${tier.charAt(0).toUpperCase() + tier.slice(1)}`
                      )}
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full">
                      Downgrade Not Available
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}