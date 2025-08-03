export type UserTier = 'free' | 'silver' | 'gold' | 'platinum';

export const tierHierarchy: Record<UserTier, number> = {
  free: 0,
  silver: 1,
  gold: 2,
  platinum: 3,
};

export const tierColors: Record<UserTier, string> = {
  free: 'bg-gray-100 text-gray-800 border-gray-200',
  silver: 'bg-slate-100 text-slate-800 border-slate-200',
  gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  platinum: 'bg-purple-100 text-purple-800 border-purple-200',
};

export const tierGradients: Record<UserTier, string> = {
  free: 'from-gray-400 to-gray-600',
  silver: 'from-slate-400 to-slate-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600',
};

export function canAccessEvent(userTier: UserTier, eventTier: UserTier): boolean {
  return tierHierarchy[userTier] >= tierHierarchy[eventTier];
}

export function getAccessibleTiers(userTier: UserTier): UserTier[] {
  const userLevel = tierHierarchy[userTier];
  return Object.entries(tierHierarchy)
    .filter(([_, level]) => level <= userLevel)
    .map(([tier]) => tier as UserTier);
}