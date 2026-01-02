export interface Exhibition {
  id: string;
  title: string;
  venue: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  ticketUrl: string;
  price: string;
  genre: string;
  whyImportant: string;
  mustSee: boolean;
}

export const exhibitions: Exhibition[] = [
  {
    id: 'van-gogh-immersive-2026',
    title: 'Van Gogh: The Immersive Experience',
    venue: 'National Gallery of Modern Art',
    city: 'Bengaluru',
    country: 'India',
    startDate: '2026-02-15',
    endDate: '2026-05-30',
    imageUrl: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800',
    ticketUrl: 'https://example.com/tickets',
    price: '₹1,500',
    genre: 'Impressionism',
    whyImportant: 'First time Van Gogh\'s works are displayed with AI-enhanced projections in India. Features rare letters and sketches.',
    mustSee: true
  },
  {
    id: 'women-renaissance',
    title: 'Women of the Renaissance',
    venue: 'Uffizi Gallery',
    city: 'Florence',
    country: 'Italy',
    startDate: '2026-03-01',
    endDate: '2026-08-15',
    imageUrl: 'https://images.unsplash.com/photo-1574182245530-967d9b3831af?w=800',
    ticketUrl: 'https://example.com/tickets',
    price: '€25',
    genre: 'Renaissance',
    whyImportant: 'Groundbreaking exhibition focusing on overlooked female artists of the Renaissance period. Rare works finally displayed.',
    mustSee: true
  },
  {
    id: 'digital-art-tokyo',
    title: 'TeamLab Borderless 2026',
    venue: 'Azabudai Hills',
    city: 'Tokyo',
    country: 'Japan',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800',
    ticketUrl: 'https://example.com/tickets',
    price: '¥3,800',
    genre: 'Digital Art',
    whyImportant: 'World\'s largest digital art museum reopened with new interactive installations merging AI and traditional art forms.',
    mustSee: true
  },
  {
    id: 'picasso-blue-period',
    title: 'Picasso: The Blue Period',
    venue: 'Musée Picasso',
    city: 'Paris',
    country: 'France',
    startDate: '2026-04-10',
    endDate: '2026-09-20',
    imageUrl: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800',
    ticketUrl: 'https://example.com/tickets',
    price: '€18',
    genre: 'Modern Art',
    whyImportant: 'Comprehensive exploration of Picasso\'s emotional Blue Period, featuring works rarely shown together.',
    mustSee: false
  },
  {
    id: 'frida-mexico-city',
    title: 'Frida Kahlo: Pain & Passion',
    venue: 'Museo Frida Kahlo',
    city: 'Mexico City',
    country: 'Mexico',
    startDate: '2026-05-01',
    endDate: '2026-11-30',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    ticketUrl: 'https://example.com/tickets',
    price: '$250 MXN',
    genre: 'Surrealism',
    whyImportant: 'New exhibition at the Blue House featuring recently discovered personal letters and early works.',
    mustSee: true
  },
  {
    id: 'african-contemporary',
    title: 'Voices of Africa: Contemporary Masters',
    venue: 'Zeitz MOCAA',
    city: 'Cape Town',
    country: 'South Africa',
    startDate: '2026-06-15',
    endDate: '2026-12-15',
    imageUrl: 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?w=800',
    ticketUrl: 'https://example.com/tickets',
    price: 'R220',
    genre: 'Contemporary',
    whyImportant: 'Largest gathering of African contemporary artists, highlighting emerging voices reshaping global art discourse.',
    mustSee: true
  },
  {
    id: 'klimt-vienna',
    title: 'Klimt: Gold & Symbolism',
    venue: 'Belvedere Museum',
    city: 'Vienna',
    country: 'Austria',
    startDate: '2026-07-01',
    endDate: '2026-10-30',
    imageUrl: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=800',
    ticketUrl: 'https://example.com/tickets',
    price: '€22',
    genre: 'Art Nouveau',
    whyImportant: 'Celebrates Klimt\'s revolutionary gold leaf technique with side-by-side comparisons of original sketches.',
    mustSee: false
  },
  {
    id: 'monet-london',
    title: 'Monet: Capturing Light',
    venue: 'National Gallery',
    city: 'London',
    country: 'United Kingdom',
    startDate: '2026-08-20',
    endDate: '2026-01-15',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
    ticketUrl: 'https://example.com/tickets',
    price: '£24',
    genre: 'Impressionism',
    whyImportant: 'First UK exhibition to display all of Monet\'s London series paintings in one location.',
    mustSee: true
  }
];

export function searchExhibitions(query: string, filters?: {
  city?: string;
  genre?: string;
  priceRange?: string;
  dateRange?: { start: string; end: string };
}): Exhibition[] {
  let results = [...exhibitions];

  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(ex => 
      ex.title.toLowerCase().includes(lowerQuery) ||
      ex.venue.toLowerCase().includes(lowerQuery) ||
      ex.city.toLowerCase().includes(lowerQuery) ||
      ex.country.toLowerCase().includes(lowerQuery) ||
      ex.genre.toLowerCase().includes(lowerQuery) ||
      ex.whyImportant.toLowerCase().includes(lowerQuery)
    );
  }

  if (filters?.city) {
    results = results.filter(ex => 
      ex.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  if (filters?.genre) {
    results = results.filter(ex => 
      ex.genre.toLowerCase() === filters.genre!.toLowerCase()
    );
  }

  return results.sort((a, b) => {
    // Sort by must-see first, then by start date
    if (a.mustSee && !b.mustSee) return -1;
    if (!a.mustSee && b.mustSee) return 1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });
}

export function getGenres(): string[] {
  return [...new Set(exhibitions.map(ex => ex.genre))];
}

export function getCities(): string[] {
  return [...new Set(exhibitions.map(ex => ex.city))];
}
