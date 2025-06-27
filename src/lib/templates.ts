export interface Product {
  id: number;
  slug: string;
  name: string;
  category: 'Sneakers' | 'Boots' | 'Sandals' | 'Formal';
  rating: number;
  description: string;
  price: number;
  features: string[];
  images: {
    main: string;
    previews: string[];
  };
}

export const products: Product[] = [
  {
    id: 1,
    slug: 'urban-runner',
    name: 'Urban Runner',
    category: 'Sneakers',
    rating: 5,
    price: 129.99,
    description: 'Lightweight and stylish sneakers for the modern city dweller. Features a breathable mesh upper and a responsive foam sole for all-day comfort.',
    features: ['Breathable mesh', 'Responsive foam sole', 'Durable rubber outsole', 'Multiple colorways'],
    images: {
      main: 'https://placehold.co/800x600.png',
      previews: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
    },
  },
  {
    id: 2,
    slug: 'mountain-trekker',
    name: 'Mountain Trekker',
    category: 'Boots',
    rating: 4,
    price: 189.99,
    description: 'Rugged and reliable boots for your next adventure. Waterproof leather and a high-traction outsole keep you comfortable and secure on any terrain.',
    features: ['Waterproof leather', 'High-traction outsole', 'Ankle support', 'Insulated lining'],
    images: {
      main: 'https://placehold.co/800x600.png',
      previews: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
    },
  },
  {
    id: 3,
    slug: 'riviera-sandal',
    name: 'Riviera Sandal',
    category: 'Sandals',
    rating: 5,
    price: 79.99,
    description: 'Elegant and comfortable sandals for sunny days. Handcrafted from supple leather with a cushioned footbed for a luxurious feel.',
    features: ['Genuine leather straps', 'Cushioned footbed', 'Arch support', 'Handcrafted quality'],
    images: {
      main: 'https://placehold.co/800x600.png',
      previews: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
    },
  },
  {
    id: 4,
    slug: 'executive-oxford',
    name: 'Executive Oxford',
    category: 'Formal',
    rating: 4,
    price: 249.99,
    description: 'Classic Oxford shoes for the discerning gentleman. Made from premium calfskin leather with a timeless silhouette for any formal occasion.',
    features: ['Premium calfskin leather', 'Goodyear welt construction', 'Leather sole', 'Classic broguing'],
    images: {
      main: 'https://placehold.co/800x600.png',
      previews: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
    },
  },
  {
    id: 5,
    slug: 'velocity-racer',
    name: 'Velocity Racer',
    category: 'Sneakers',
    rating: 5,
    price: 149.99,
    description: 'High-performance running shoes designed for speed and agility. The carbon-fiber plate and ultra-light materials help you achieve your personal best.',
    features: ['Carbon-fiber plate', 'Ultra-light construction', 'High-energy return foam', 'Engineered mesh upper'],
    images: {
      main: 'https://placehold.co/800x600.png',
      previews: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
    },
  },
  {
    id: 6,
    slug: 'chelsea-classic',
    name: 'Chelsea Classic',
    category: 'Boots',
    rating: 4,
    price: 199.99,
    description: 'A timeless Chelsea boot with a modern twist. Crafted from rich suede with elastic side panels for a perfect blend of style and convenience.',
    features: ['Rich suede upper', 'Elastic side panels', 'Pull-on design', 'Crepe rubber sole'],
    images: {
      main: 'https://placehold.co/800x600.png',
      previews: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
    },
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};
