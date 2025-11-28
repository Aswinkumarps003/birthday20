export interface Letter {
  id: number;
  title: string;
  content: string;
  image: string; // URL to the image
  date?: string;
}

export interface CakeProps {
  isBlown: boolean;
  onBlow: () => void;
}

export interface PaperPlaneProps {
  trigger: boolean;
  onComplete: () => void;
}
