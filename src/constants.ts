import { Track } from './types';

export const MUSIC_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Nebula',
    artist: 'AI Gen - SynthWave',
    duration: '3:45',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&h=300&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
    color: '#00f2ff', // Cyan
  },
  {
    id: '2',
    title: 'Cyber Circuit',
    artist: 'AI Gen - Glitch Hop',
    duration: '4:12',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&h=300&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder audio
    color: '#ff00ff', // Magenta
  },
  {
    id: '3',
    title: 'Void Runner',
    artist: 'AI Gen - Dark Ambient',
    duration: '5:02',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&h=300&auto=format&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Placeholder audio
    color: '#b3ff00', // Lime
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = 'UP';
export const GAME_SPEED = 150; // ms
