import { Letter } from './types';

// Handwritten letters served from public/new items (1.jpg ... 20.jpg)
const letterImagePaths = Array.from({ length: 20 }, (_, i) => `/new items/${i + 1}.jpg`);

export const LETTERS: Letter[] = letterImagePaths.map((image, index) => ({
  id: index + 1,
  title: `Letter #${index + 1}`,
  content: '',
  image,
}));
