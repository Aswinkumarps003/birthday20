import { Letter } from './types';

// Replace these placeholder images with your actual photos of the handwritten letters.
// Ensure the images are high quality and readable (portrait orientation works best).
export const LETTERS: Letter[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Letter #${i + 1}`,
  content: "", // Content is now in the image
  image: `https://picsum.photos/seed/letter${i + 1}/600/800` // Portrait aspect ratio placeholders
}));
