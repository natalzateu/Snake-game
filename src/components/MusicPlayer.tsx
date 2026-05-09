import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, Disc } from 'lucide-react';
import { MUSIC_TRACKS } from '../constants';
import { Track } from '../types';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = MUSIC_TRACKS[currentTrackIndex];

  const handleTogglePlay = useCallback(() => setIsPlaying(!isPlaying), [isPlaying]);

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
    setProgress(0);
    // Force play on next if it was already playing
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play().catch(console.error);
      }, 0);
    }
  }, [isPlaying]);

  const handlePrev = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
    setProgress(0);
    // Force play on prev if it was already playing
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play().catch(console.error);
      }, 0);
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Playback failed:", error);
          // Don't flip state immediately as it might be a temporary loading issue
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    const handleTrackEnd = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleTrackEnd);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrackIndex, handleNext]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedProgress = x / rect.width;
    audio.currentTime = clickedProgress * audio.duration;
  };

  return (
    <div id="music-player" className="flex flex-col gap-8 p-6 bg-black border-2 border-magenta-500 shadow-[10px_10px_0_rgba(255,0,255,0.2)] h-full relative overflow-hidden font-pixel">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
         <Music2 className="w-16 h-16 text-cyan-400 animate-glitch" />
      </div>

      <div>
        <p className="text-[14px] font-bold text-cyan-400 tracking-[0.3em] uppercase mb-4">_NOW_PLAYING</p>
        <motion.h3 
          key={currentTrack.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-black text-white italic truncate glitch-text"
        >
          {currentTrack.title}
        </motion.h3>
        <p className="text-lg text-magenta-500 font-bold uppercase tracking-widest mt-1">
          SRC: {currentTrack.artist.replace('AI Gen - ', '')} // PKT_{currentTrack.id}
        </p>
      </div>

      {/* Progress Section */}
      <div className="space-y-4">
        <div 
          className="relative h-4 w-full bg-zinc-900 border border-zinc-700 cursor-pointer overflow-hidden"
          onClick={handleProgressClick}
        >
           <motion.div 
             className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_15px_#00ffff]"
             style={{ width: `${progress}%` }}
           />
           <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] text-white mix-blend-difference uppercase font-bold tracking-widest pointer-events-none">
              <span>BUF_LOAD</span>
              <span>{Math.floor(progress)}%</span>
           </div>
        </div>
        <div className="flex justify-between text-[14px] font-bold text-zinc-600 uppercase">
          <span>00:00:00</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Control Cluster */}
      <div className="flex justify-center items-center gap-12 py-4">
        <button onClick={handlePrev} className="text-zinc-600 hover:text-white transition-colors p-2 border-2 border-transparent hover:border-cyan-500">
          <SkipBack className="w-8 h-8" />
        </button>
        
        <button 
          onClick={handleTogglePlay}
          className="w-20 h-20 bg-magenta-500 text-black flex items-center justify-center hover:scale-105 active:translate-y-1 transition-all shadow-[8px_8px_0_#fff]"
        >
          {isPlaying ? <Pause className="w-10 h-10 fill-black" /> : <Play className="w-10 h-10 fill-black ml-1" />}
        </button>
        
        <button onClick={handleNext} className="text-zinc-600 hover:text-white transition-colors p-2 border-2 border-transparent hover:border-magenta-500">
          <SkipForward className="w-8 h-8" />
        </button>
      </div>

      {/* Data List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar bg-zinc-950 border border-zinc-900 p-4">
        <p className="text-[12px] font-bold text-zinc-700 tracking-widest uppercase mb-4 border-b border-zinc-900 pb-2">_FREQ_PLAYLIST</p>
        <div className="space-y-2">
          {MUSIC_TRACKS.map((track, index) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              className={`flex items-center gap-4 w-full p-4 transition-all border-2 ${
                index === currentTrackIndex 
                ? 'bg-cyan-500 text-black border-white shadow-[4px_4px_0_#ff00ff]' 
                : 'bg-black text-zinc-500 border-zinc-900 hover:border-cyan-500 hover:text-cyan-500'
              }`}
            >
              <div className="flex-1 text-left">
                <p className="text-lg font-black uppercase tracking-tight">{track.title}</p>
                <p className="text-[10px] uppercase font-bold opacity-70 italic tracking-widest">{track.artist}</p>
              </div>
              <span className="text-sm font-bold opacity-40">{track.duration}</span>
            </button>
          ))}
        </div>
        
        {/* Visualizer Row */}
        <div className="mt-8 flex items-end gap-2 h-16 overflow-hidden">
            {[...Array(15)].map((_, i) => (
                <div 
                    key={i}
                    className={`flex-1 ${i % 3 === 0 ? 'bg-cyan-400' : 'bg-magenta-500'} opacity-40 animate-pulse`}
                    style={{ 
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: `${0.5 + Math.random()}s`
                    }}
                />
            ))}
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.audioUrl} />
    </div>
  );
};
