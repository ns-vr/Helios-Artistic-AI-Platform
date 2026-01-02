export interface Painter {
  id: string;
  name: string;
  era: string;
  movement: string;
  nationality: string;
  birthYear: number;
  deathYear?: number;
  imageUrl: string;
}

export interface Painting {
  id: string;
  title: string;
  painterId: string;
  year: number;
  imageUrl: string;
  technique: string;
  significance: string;
  movement: string;
}

export interface QuizQuestion {
  type: 'match-painting' | 'match-title' | 'mcq';
  paintingId?: string;
  painterId?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  relatedWork?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  color: string;
}

export const painters: Painter[] = [
  {
    id: 'van-gogh',
    name: 'Vincent van Gogh',
    era: '19th Century',
    movement: 'Post-Impressionism',
    nationality: 'Dutch',
    birthYear: 1853,
    deathYear: 1890,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/800px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg'
  },
  {
    id: 'monet',
    name: 'Claude Monet',
    era: '19th-20th Century',
    movement: 'Impressionism',
    nationality: 'French',
    birthYear: 1840,
    deathYear: 1926,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet_1899_Nadar_crop.jpg/800px-Claude_Monet_1899_Nadar_crop.jpg'
  },
  {
    id: 'frida',
    name: 'Frida Kahlo',
    era: '20th Century',
    movement: 'Surrealism',
    nationality: 'Mexican',
    birthYear: 1907,
    deathYear: 1954,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/800px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg'
  },
  {
    id: 'da-vinci',
    name: 'Leonardo da Vinci',
    era: 'Renaissance',
    movement: 'High Renaissance',
    nationality: 'Italian',
    birthYear: 1452,
    deathYear: 1519,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Leonardo_self.jpg/800px-Leonardo_self.jpg'
  },
  {
    id: 'picasso',
    name: 'Pablo Picasso',
    era: '20th Century',
    movement: 'Cubism',
    nationality: 'Spanish',
    birthYear: 1881,
    deathYear: 1973,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Pablo_picasso_1.jpg/800px-Pablo_picasso_1.jpg'
  },
  {
    id: 'vermeer',
    name: 'Johannes Vermeer',
    era: 'Dutch Golden Age',
    movement: 'Baroque',
    nationality: 'Dutch',
    birthYear: 1632,
    deathYear: 1675,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Cropped_version_of_Jan_Vermeer_van_Delft_002.jpg/800px-Cropped_version_of_Jan_Vermeer_van_Delft_002.jpg'
  },
  {
    id: 'klimt',
    name: 'Gustav Klimt',
    era: '19th-20th Century',
    movement: 'Art Nouveau',
    nationality: 'Austrian',
    birthYear: 1862,
    deathYear: 1918,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Klimt.jpg/800px-Klimt.jpg'
  },
  {
    id: 'rembrandt',
    name: 'Rembrandt van Rijn',
    era: 'Dutch Golden Age',
    movement: 'Baroque',
    nationality: 'Dutch',
    birthYear: 1606,
    deathYear: 1669,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg/800px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg'
  }
];

export const paintings: Painting[] = [
  {
    id: 'starry-night',
    title: 'The Starry Night',
    painterId: 'van-gogh',
    year: 1889,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    technique: 'Oil on canvas with swirling, expressive brushstrokes',
    significance: 'Revolutionary depiction of night sky, painted from memory in an asylum, exemplifies emotional intensity of Post-Impressionism',
    movement: 'Post-Impressionism'
  },
  {
    id: 'water-lilies',
    title: 'Water Lilies',
    painterId: 'monet',
    year: 1906,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg',
    technique: 'Oil on canvas with loose, impressionistic brushwork',
    significance: 'Part of 250 paintings series, revolutionized how artists captured light and reflection on water',
    movement: 'Impressionism'
  },
  {
    id: 'two-fridas',
    title: 'The Two Fridas',
    painterId: 'frida',
    year: 1939,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/Frida_Kahlo_%28self_portrait%29.jpg/800px-Frida_Kahlo_%28self_portrait%29.jpg',
    technique: 'Oil on canvas, surrealist style',
    significance: 'Deeply personal exploration of identity, heritage, and emotional pain through symbolic imagery',
    movement: 'Surrealism'
  },
  {
    id: 'mona-lisa',
    title: 'Mona Lisa',
    painterId: 'da-vinci',
    year: 1503,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
    technique: 'Oil on poplar panel, sfumato technique',
    significance: 'World\'s most famous painting, pioneered sfumato technique creating ethereal, lifelike quality',
    movement: 'High Renaissance'
  },
  {
    id: 'guernica',
    title: 'Guernica',
    painterId: 'picasso',
    year: 1937,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/7/74/Guernica.jpg',
    technique: 'Oil on canvas, cubist and surrealist elements',
    significance: 'Powerful anti-war statement responding to bombing of Guernica, became universal symbol of war\'s horrors',
    movement: 'Cubism'
  },
  {
    id: 'girl-pearl-earring',
    title: 'Girl with a Pearl Earring',
    painterId: 'vermeer',
    year: 1665,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg',
    technique: 'Oil on canvas, tronie style',
    significance: 'Called "Mona Lisa of the North", masterful use of light and enigmatic expression captivates viewers',
    movement: 'Baroque'
  },
  {
    id: 'the-kiss',
    title: 'The Kiss',
    painterId: 'klimt',
    year: 1908,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/800px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg',
    technique: 'Oil and gold leaf on canvas',
    significance: 'Iconic Art Nouveau masterpiece, gold leaf technique creates transcendent romantic imagery',
    movement: 'Art Nouveau'
  },
  {
    id: 'night-watch',
    title: 'The Night Watch',
    painterId: 'rembrandt',
    year: 1642,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/The_Night_Watch_-_HD.jpg/1280px-The_Night_Watch_-_HD.jpg',
    technique: 'Oil on canvas, dramatic chiaroscuro',
    significance: 'Revolutionary group portrait with dynamic composition, masterful use of light and shadow',
    movement: 'Baroque'
  }
];

export const badges: Badge[] = [
  {
    id: 'impressionism-pro',
    name: 'Impressionism Pro',
    description: 'Master of light and color',
    icon: '🎨',
    requirement: 'Score 100% on 5 Impressionism questions',
    color: 'sky'
  },
  {
    id: 'renaissance-whisperer',
    name: 'Renaissance Whisperer',
    description: 'Scholar of the old masters',
    icon: '🏛️',
    requirement: 'Complete all Renaissance painter questions',
    color: 'gold'
  },
  {
    id: 'modern-maven',
    name: 'Modern Maven',
    description: 'Champion of 20th century art',
    icon: '🌟',
    requirement: 'Score 100% on modern art questions',
    color: 'rose'
  },
  {
    id: 'art-detective',
    name: 'Art Detective',
    description: 'Uncovering hidden meanings',
    icon: '🔍',
    requirement: 'Answer 20 MCQ questions correctly',
    color: 'primary'
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'On fire with 10 correct in a row',
    icon: '🔥',
    requirement: 'Maintain a 10-answer streak',
    color: 'gold'
  },
  {
    id: 'quick-eye',
    name: 'Quick Eye',
    description: 'Lightning fast recognition',
    icon: '⚡',
    requirement: 'Answer 5 questions in under 30 seconds each',
    color: 'accent'
  }
];

export function generateQuizQuestions(level: 1 | 2 | 3, count: number = 5): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const shuffledPaintings = [...paintings].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(count, shuffledPaintings.length); i++) {
    const painting = shuffledPaintings[i];
    const painter = painters.find(p => p.id === painting.painterId)!;
    const otherPainters = painters.filter(p => p.id !== painting.painterId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    if (level === 1) {
      // Match painting to painter
      const options = [painter.name, ...otherPainters.map(p => p.name)].sort(() => Math.random() - 0.5);
      questions.push({
        type: 'match-painting',
        paintingId: painting.id,
        question: 'Who painted this masterpiece?',
        options,
        correctAnswer: painter.name,
        explanation: `${painting.title} was created by ${painter.name} in ${painting.year}. ${painting.significance}`,
        relatedWork: paintings.find(p => p.painterId === painter.id && p.id !== painting.id)?.title
      });
    } else if (level === 2) {
      // Match painter to painting title
      const otherPaintings = paintings.filter(p => p.painterId !== painter.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = [painting.title, ...otherPaintings.map(p => p.title)].sort(() => Math.random() - 0.5);
      questions.push({
        type: 'match-title',
        painterId: painter.id,
        question: `Which painting was created by ${painter.name}?`,
        options,
        correctAnswer: painting.title,
        explanation: `${painter.name} created ${painting.title} in ${painting.year}. It belongs to the ${painting.movement} movement.`,
        relatedWork: paintings.find(p => p.painterId === painter.id && p.id !== painting.id)?.title
      });
    } else {
      // MCQ about significance
      const wrongAnswers = [
        `It was the first painting to use digital techniques`,
        `It was created as a royal commission for the king`,
        `It pioneered the use of synthetic paints`
      ];
      const options = [painting.significance.slice(0, 80), ...wrongAnswers].sort(() => Math.random() - 0.5);
      questions.push({
        type: 'mcq',
        paintingId: painting.id,
        question: `Why is "${painting.title}" historically significant?`,
        options,
        correctAnswer: painting.significance.slice(0, 80),
        explanation: `${painting.title} by ${painter.name}: ${painting.significance}`,
        relatedWork: paintings.find(p => p.movement === painting.movement && p.id !== painting.id)?.title
      });
    }
  }

  return questions;
}

export function getPainterById(id: string): Painter | undefined {
  return painters.find(p => p.id === id);
}

export function getPaintingById(id: string): Painting | undefined {
  return paintings.find(p => p.id === id);
}
