export interface Template {
  id: number;
  slug: string;
  name: string;
  category: 'Fashion' | 'Electronics' | 'Home Goods' | 'Beauty';
  rating: number;
  description: string;
  features: string[];
  images: {
    main: string;
    previews: string[];
  };
}

export const templates: Template[] = [
  {
    id: 1,
    slug: 'maison-chic',
    name: 'Maison Chic',
    category: 'Fashion',
    rating: 5,
    description: 'An elegant and minimalist template designed for high-end fashion brands. Features clean lines, beautiful typography, and a focus on large, stunning imagery.',
    features: ['Quick view', 'Variant swatches', 'Lookbook page', 'Size guide'],
    images: {
      main: 'https://placehold.co/800x600/673AB7/F3E5F5.png',
      previews: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
    },
  },
  {
    id: 2,
    slug: 'tech-sphere',
    name: 'Tech Sphere',
    category: 'Electronics',
    rating: 4,
    description: 'A modern, dark-themed template perfect for electronics stores. Built to showcase product specifications and features in a clear, concise manner.',
    features: ['Advanced filtering', 'Product comparison', '360° product view', 'Customer reviews'],
    images: {
      main: 'https://placehold.co/800x600/3F51B5/F3E5F5.png',
      previews: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
    },
  },
  {
    id: 3,
    slug: 'hearth-home',
    name: 'Hearth & Home',
    category: 'Home Goods',
    rating: 5,
    description: 'A warm and inviting template for home decor and furniture shops. Its cozy design and intuitive layout make browsing a pleasure for customers.',
    features: ['Room builder visualization', 'Color swatches', 'Shop the look', 'Gift registry'],
    images: {
      main: 'https://placehold.co/800x600/E91E63/F3E5F5.png',
      previews: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
    },
  },
  {
    id: 4,
    slug: 'glow-up',
    name: 'Glow Up',
    category: 'Beauty',
    rating: 4,
    description: 'A vibrant and stylish template for cosmetics and skincare brands. Designed to be mobile-first, with features that highlight product ingredients and benefits.',
    features: ['Video tutorials', 'Subscription boxes', 'Shade finder quiz', 'Before & after slider'],
    images: {
      main: 'https://placehold.co/800x600/F06292/FFFFFF.png',
      previews: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
    },
  },
  {
    id: 5,
    slug: 'atelier-noir',
    name: 'Atelier Noir',
    category: 'Fashion',
    rating: 5,
    description: 'A sophisticated, dark-mode template for luxury apparel and accessories. Its bold typography and editorial layout create a high-fashion experience.',
    features: ['Full-screen video background', 'Interactive lookbook', 'Pre-order functionality', 'Appointment booking'],
    images: {
      main: 'https://placehold.co/800x600/212121/FFFFFF.png',
      previews: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
    },
  },
  {
    id: 6,
    slug: 'gadget-grid',
    name: 'Gadget Grid',
    category: 'Electronics',
    rating: 4,
    description: 'A clean, grid-based template ideal for stores with a large inventory of gadgets and accessories. Fast, responsive, and highly customizable.',
    features: ['Mega menu', 'Deal of the day countdown', 'Bundle products', 'Advanced search'],
    images: {
      main: 'https://placehold.co/800x600/4CAF50/FFFFFF.png',
      previews: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
    },
  },
];

export const getTemplateBySlug = (slug: string): Template | undefined => {
  return templates.find(t => t.slug === slug);
};
