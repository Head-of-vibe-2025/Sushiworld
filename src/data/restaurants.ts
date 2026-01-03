// Restaurant Data
// All restaurant information extracted from provided screenshots

import type { Restaurant } from '../types/restaurant.types';

// Pattern images from Supabase storage
const PATTERN_IMAGES = [
  'https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/1%20Pattern.png',
  'https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/2%20Pattern.png',
  'https://lymingynfnunsrriiama.supabase.co/storage/v1/object/public/assets/3%20Pattern.png',
];

// Helper function to get pattern image (cycles through the 3 patterns)
const getPatternImage = (index: number): string => {
  return PATTERN_IMAGES[index % PATTERN_IMAGES.length];
};

export const restaurants: Restaurant[] = [
  {
    id: 'bruxelles',
    name: 'Bruxelles',
    phone: '02/223.23.22',
    address: {
      street: 'Rue des Cultes 5',
      city: 'Bruxelles',
      postalCode: '1000',
    },
    openingHours: {
      monday: '11:00 - 14:30 | 17:30 - 22:00',
      tuesday: '11:00 - 14:30 | 17:30 - 22:00',
      wednesday: '11:00 - 14:30 | 17:30 - 22:00',
      thursday: '11:00 - 14:30 | 17:30 - 22:00',
      friday: '11:00 - 14:30 | 17:30 - 22:00',
      saturday: '17:30 - 22:00',
      sunday: 'Fermé',
    },
    deliveryInfo: {
      postalCodes: [
        '1000', '1020', '1040', '1050', '1060', '1070', '1080', '1081', '1082', '1083',
        '1090', '1030', '1210', '1140', '1150', '1160', '1170', '1180', '1190', '1200',
      ],
      restrictions: ['Nous ne livrons pas le samedi midi'],
    },
    image: getPatternImage(0),
    rating: 4.5,
    bookingUrl: 'https://bookings.zenchef.com/results?rid=371204&pid=1001',
  },
  {
    id: 'nivelles',
    name: 'Nivelles',
    phone: '067 .41.04.01',
    address: {
      street: 'Chaussée de Mons 18A',
      city: 'Nivelles',
      postalCode: '1400',
    },
    openingHours: {
      monday: '11:00 - 21:30',
      tuesday: '11:00 - 21:30',
      wednesday: '11:00 - 21:30',
      thursday: '11:00 - 21:30',
      friday: '11:00 - 21:30',
      saturday: '11:00 - 21:30',
      sunday: 'Fermé',
    },
    associatedLocations: [
      'Nivelles', 'Monstreux', 'Baulers', 'Lillois',
      'Rosseignies', 'Ecaussinnes', 'Ronquieres',
      'Ittre', 'Sart-a-Reves',
    ],
    image: getPatternImage(1),
    rating: 4.3,
    bookingUrl: 'https://bookings.zenchef.com/results?rid=379528&pid=1001',
  },
  {
    id: 'liege',
    name: 'Liège',
    phone: '04 372 90.94',
    address: {
      street: "Rue Pont d'Avroy 4",
      city: 'Liège',
      postalCode: '4000',
    },
    openingHours: {
      monday: '11:00 - 22:00',
      tuesday: '11:00 - 22:00',
      wednesday: '11:00 - 22:00',
      thursday: '11:00 - 22:00',
      friday: '11:00 - 22:00',
      saturday: '11:00 - 22:00',
      sunday: 'Fermé',
    },
    deliveryInfo: {
      radius: '9 km',
    },
    image: getPatternImage(2),
    rating: 4.6,
    bookingUrl: 'https://bookings.zenchef.com/results?rid=379531&pid=1001',
  },
  {
    id: 'louvain-la-neuve',
    name: 'Louvain-la-Neuve',
    phone: '010 81.21.21',
    address: {
      street: 'Rue Charlemagne 3',
      city: 'Louvain-la-Neuve',
      postalCode: '1348',
    },
    openingHours: {
      monday: '11:00 - 22:00',
      tuesday: '11:00 - 22:00',
      wednesday: '11:00 - 22:00',
      thursday: '11:00 - 22:00',
      friday: '11:00 - 22:00',
      saturday: '11:00 - 22:00',
      sunday: '17:30 - 22:00',
    },
    deliveryInfo: {
      radius: '10 km',
    },
    image: getPatternImage(0),
    rating: 4.4,
    bookingUrl: 'https://bookings.zenchef.com/results?rid=379534&pid=1001',
  },
  {
    id: 'waterloo',
    name: 'Waterloo',
    phone: '02.648.13..38',
    address: {
      street: '378 Chaussée de Bruxelles',
      city: 'Waterloo',
      postalCode: '1410',
      country: 'Belgique',
    },
    openingHours: {
      monday: '11H-21H30 non-stop',
      tuesday: '11H-21H30 non-stop',
      wednesday: '11H-21H30 non-stop',
      thursday: '11H-21H30 non-stop',
      friday: '11H-21H30 non-stop',
      saturday: '11H-21H30 non-stop',
      sunday: '11H-21H30 non-stop',
    },
    deliveryInfo: {
      radius: '15 km',
    },
    associatedLocations: [
      'Waterloo 1410',
      'Lasnes 1380',
      'Genval 1332',
      'Rhode-Saint-Genèse 1640',
      'La Hulpe 1310',
      'Beersel 1650',
      'Hoeilaart 1560',
      'Ohain 1380',
      'Overijse 3090',
      'Rixensart 1330',
      '1331',
      '1332',
    ],
    image: getPatternImage(1),
    rating: 4.7,
    bookingUrl: 'https://bookings.zenchef.com/results?rid=379526&pid=1001',
  },
  {
    id: 'namur',
    name: 'Namur',
    phone: '081/614132',
    address: {
      street: 'Rue de la Monnaie 12',
      city: 'Namur',
      postalCode: '5000',
      country: 'Belgium',
    },
    openingHours: {
      monday: '11:30 - 21:30',
      tuesday: '11:30 - 21:30',
      wednesday: '11:30 - 21:30',
      thursday: '11:30 - 21:30',
      friday: '11:30 - 21:30',
      saturday: '11:30 - 21:30',
      sunday: 'Fermé',
    },
    deliveryInfo: {
      radius: '15 km',
    },
    image: getPatternImage(2),
    rating: 4.2,
    bookingUrl: 'https://bookings.zenchef.com/results?rid=379530&pid=1001',
  },
  {
    id: 'gerpinnes',
    name: 'Gerpinnes',
    phone: '071/77.33.80',
    address: {
      street: 'Rue Neuve 2',
      city: 'Gerpinnes',
      postalCode: '6280',
      country: 'Belgium',
    },
    openingHours: {
      monday: '11:30 - 21:30',
      tuesday: '11:30 - 21:30',
      wednesday: '11:30 - 21:30',
      thursday: '11:30 - 21:30',
      friday: '11:30 - 21:30',
      saturday: '11:30 - 21:30',
      sunday: '17:30 - 21:30',
    },
    deliveryInfo: {
      radius: '15 km',
      restrictions: ['Nous ne livrons pas le dimanche midi'],
    },
    image: getPatternImage(0),
    rating: 4.1,
    bookingUrl: 'https://bookings.zenchef.com/results?rid=379529&pid=1001',
  },
  {
    id: 'gosselies',
    name: 'Gosselies',
    phone: '071/50.36.25',
    address: {
      street: 'Rue Pont à Migneloux 17',
      city: 'Gosselies',
      postalCode: '6041',
    },
    openingHours: {
      monday: '11:00 - 21:30',
      tuesday: '11:00 - 21:30',
      wednesday: '11:00 - 21:30',
      thursday: '11:00 - 21:30',
      friday: '11:00 - 21:30',
      saturday: '11:00 - 21:30',
      sunday: '17:00 - 21:30',
    },
    deliveryInfo: {
      radius: '15 km',
    },
    image: getPatternImage(1),
    rating: 4.0,
    bookingUrl: 'https://bookings.zenchef.com/results?rid=379527&pid=1001',
  },
];

// Helper function to get restaurant by ID
export const getRestaurantById = (id: string): Restaurant | undefined => {
  return restaurants.find(restaurant => restaurant.id === id);
};

