export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  type: 'artwork' | 'collab' | 'discussion';
  isSpotlight?: boolean;
}

export interface LearningCircle {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  style: string;
  imageUrl: string;
  tags: string[];
}

export interface CollabRequest {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  description: string;
  seeking: string[];
  deadline?: string;
  responses: number;
  createdAt: string;
}

export const communityPosts: CommunityPost[] = [
  {
    id: 'spotlight-1',
    authorId: 'user-1',
    authorName: 'Luna Artistry',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    title: 'Dreaming in Gold',
    content: 'Inspired by Klimt\'s golden period, I created this digital piece exploring themes of connection and transcendence. Used Helios AI to enhance the gold leaf texture effect.',
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800',
    tags: ['Therapeutic', 'Digital Art', 'Klimt-inspired'],
    likes: 342,
    comments: 56,
    createdAt: '2026-01-02T10:30:00Z',
    type: 'artwork',
    isSpotlight: true
  },
  {
    id: 'post-2',
    authorId: 'user-2',
    authorName: 'Marcus Chen',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    title: 'Sunset Reflections',
    content: 'My latest watercolor experiment capturing the golden hour at the beach. Been practicing Monet\'s color layering techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    tags: ['Experimental', 'Watercolor', 'Impressionism'],
    likes: 128,
    comments: 23,
    createdAt: '2026-01-01T15:20:00Z',
    type: 'artwork'
  },
  {
    id: 'post-3',
    authorId: 'user-3',
    authorName: 'Sofia Rivera',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
    title: 'Inner Garden',
    content: 'A surrealist self-portrait inspired by Frida Kahlo. Created during my healing journey, expressing growth through pain.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    tags: ['Therapeutic', 'Surrealism', 'Self-portrait'],
    likes: 256,
    comments: 41,
    createdAt: '2026-01-01T09:15:00Z',
    type: 'artwork'
  },
  {
    id: 'discussion-1',
    authorId: 'user-4',
    authorName: 'Art History Buff',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=History',
    title: 'What makes a masterpiece timeless?',
    content: 'I\'ve been thinking about why certain paintings like the Mona Lisa or Starry Night resonate across centuries. Is it technique, emotion, or something deeper?',
    tags: ['Discussion', 'Art History', 'Philosophy'],
    likes: 89,
    comments: 67,
    createdAt: '2026-01-02T08:00:00Z',
    type: 'discussion'
  }
];

export const learningCircles: LearningCircle[] = [
  {
    id: 'circle-1',
    name: 'Impressionism Explorers',
    description: 'Discover the magic of light and color with fellow Impressionism enthusiasts',
    memberCount: 1243,
    style: 'Impressionism',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400',
    tags: ['Monet', 'Light Study', 'Color Theory']
  },
  {
    id: 'circle-2',
    name: 'Digital Art Revolution',
    description: 'Push boundaries with AI-assisted art creation and digital techniques',
    memberCount: 2156,
    style: 'Digital Art',
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400',
    tags: ['AI Art', 'Procreate', 'NFTs']
  },
  {
    id: 'circle-3',
    name: 'Lo-fi Album Art',
    description: 'Create dreamy, nostalgic visuals perfect for music covers',
    memberCount: 876,
    style: 'Lo-fi',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    tags: ['Album Covers', 'Aesthetic', 'Retro']
  },
  {
    id: 'circle-4',
    name: 'Renaissance Revival',
    description: 'Study classical techniques and apply them to modern works',
    memberCount: 654,
    style: 'Renaissance',
    imageUrl: 'https://images.unsplash.com/photo-1574182245530-967d9b3831af?w=400',
    tags: ['Classical', 'Technique', 'Old Masters']
  }
];

export const collabRequests: CollabRequest[] = [
  {
    id: 'collab-1',
    authorId: 'user-5',
    authorName: 'Melody Waves',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Melody',
    title: 'Album Cover Art Needed',
    description: 'Looking for a digital artist to create dreamy, Impressionist-style cover art for my upcoming ambient music EP.',
    seeking: ['Digital Artist', 'Illustrator'],
    deadline: '2026-02-15',
    responses: 12,
    createdAt: '2026-01-01T12:00:00Z'
  },
  {
    id: 'collab-2',
    authorId: 'user-6',
    authorName: 'AnimateStudio',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Animate',
    title: 'Animator for Art Documentary',
    description: 'Creating a short documentary about Van Gogh\'s life. Need someone to animate his paintings for key scenes.',
    seeking: ['Animator', 'Motion Designer'],
    responses: 8,
    createdAt: '2026-01-02T06:30:00Z'
  },
  {
    id: 'collab-3',
    authorId: 'user-7',
    authorName: 'Gallery Collective',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gallery',
    title: 'Virtual Gallery Exhibition',
    description: 'Organizing a virtual gallery showcasing emerging artists. Looking for 10 artists to feature in our spring collection.',
    seeking: ['Painters', 'Digital Artists', 'Sculptors'],
    deadline: '2026-03-01',
    responses: 34,
    createdAt: '2025-12-28T14:00:00Z'
  }
];

export function getTodaySpotlight(): CommunityPost | undefined {
  return communityPosts.find(post => post.isSpotlight);
}

export function getPostsByTag(tag: string): CommunityPost[] {
  return communityPosts.filter(post => 
    post.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

export function searchCommunity(query: string): {
  posts: CommunityPost[];
  circles: LearningCircle[];
  collabs: CollabRequest[];
} {
  const lowerQuery = query.toLowerCase();
  
  return {
    posts: communityPosts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.tags.some(t => t.toLowerCase().includes(lowerQuery))
    ),
    circles: learningCircles.filter(circle =>
      circle.name.toLowerCase().includes(lowerQuery) ||
      circle.description.toLowerCase().includes(lowerQuery) ||
      circle.style.toLowerCase().includes(lowerQuery)
    ),
    collabs: collabRequests.filter(collab =>
      collab.title.toLowerCase().includes(lowerQuery) ||
      collab.description.toLowerCase().includes(lowerQuery) ||
      collab.seeking.some(s => s.toLowerCase().includes(lowerQuery))
    )
  };
}
