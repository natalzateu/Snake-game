export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
  color: string;
}

export interface GameState {
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  score: number;
  isPaused: boolean;
  isGameOver: boolean;
}
