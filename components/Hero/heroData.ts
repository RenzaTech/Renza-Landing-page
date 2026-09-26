export interface HeroSceneData {
  id: number;
  category: string;
  badgeLabel: string;
  image: string;
  alt: string;
  badgeTitle?: string;
  badgeSubtitle?: string;
  badgeType?: 'verified' | 'kitchen' | 'laundry' | 'booking' | 'rating' | string;
}

export const HERO_SCENES: HeroSceneData[] = [
  {
    id: 1,
    category: 'HOUSE CLEANING',
    badgeLabel: '✦ HOUSE CLEANING',
    image: '/images/renza-cleaning.jpg',
    alt: 'Professional RENZA helper deep cleaning a modern Indian home',
  },
  {
    id: 2,
    category: 'KITCHEN HELP',
    badgeLabel: '✦ KITCHEN HELP',
    image: '/images/renza-kitchen.jpg',
    alt: 'RENZA kitchen helper washing vessels and cleaning modern kitchen',
  },
  {
    id: 3,
    category: 'LAUNDRY ASSISTANCE',
    badgeLabel: '✦ LAUNDRY ASSISTANCE',
    image: '/images/renza-laundry.jpg',
    alt: 'RENZA helper neatly folding and organizing fresh laundry',
  },
  {
    id: 4,
    category: 'ON-DEMAND BOOKING',
    badgeLabel: '✦ ON-DEMAND BOOKING',
    image: '/images/renza-booking.jpg',
    alt: 'Customer using smartphone to book RENZA household helper in seconds',
  },
  {
    id: 5,
    category: 'HELPER ARRIVING',
    badgeLabel: '✦ HELPER ARRIVING',
    image: '/images/renza-helper-1.jpg',
    alt: 'Verified RENZA helper arriving promptly at customer home doorstep',
  },
  {
    id: 6,
    category: 'SERVICE COMPLETED',
    badgeLabel: '✦ SERVICE COMPLETED',
    image: '/images/renza-trust.jpg',
    alt: 'Warm and natural interaction between customer and trusted RENZA helper',
  },
];
