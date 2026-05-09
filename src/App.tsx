/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Zap, Cpu, Wifi } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 selection:bg-magenta-500 selection:text-white noise-bg scanline-container font-tech">
      {/* HUD Header */}
      <header className="border-b-4 border-magenta-500 p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-black/80 backdrop-blur-sm relative z-20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 animate-pulse block" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-magenta-500 font-pixel">Direct Access // Protocol 0x7F</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic glitch-text">
            NEON<span className="text-white">_VOX</span>
          </h1>
        </div>

        <div className="flex gap-8 text-[11px] uppercase tracking-[0.2em] font-pixel border-l border-zinc-800 pl-8">
          <div className="space-y-1">
            <p className="text-zinc-600">Secure Node</p>
            <p className="text-cyan-500">Node_Alpha_72</p>
          </div>
          <div className="space-y-1">
            <p className="text-zinc-600">Packet Integrity</p>
            <p className="text-magenta-500">99.9% CRC_32</p>
          </div>
          <div className="space-y-1 hidden sm:block">
            <p className="text-zinc-600">Environment</p>
            <p className="text-white">Void_Simulation</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Game Segment */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-7 border-2 border-cyan-500 p-2 bg-black shadow-[10px_10px_0_#ff00ff]"
        >
          <div className="border border-cyan-500/30 p-8 h-full bg-[radial-gradient(circle_at_center,_#111_0%,_transparent_100%)]">
            <SnakeGame />
          </div>
        </motion.section>

        {/* Audio Segment */}
        <motion.aside 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 border-2 border-magenta-500 p-2 bg-black shadow-[-10px_10px_0_#00ffff]"
        >
          <div className="border border-magenta-500/30 p-6 h-full min-h-[600px]">
            <MusicPlayer />
          </div>
        </motion.aside>
      </main>

      {/* Terminal Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t-2 border-zinc-800 bg-black/90 p-4 font-pixel text-[12px] uppercase tracking-[0.5em] flex justify-between items-center z-30">
        <div className="flex gap-6 items-center">
          <span className="text-zinc-700">© 1994-2077 // VOID_DATA</span>
          <span className="text-cyan-600 animate-pulse">Running: Mainframe_0.1.4</span>
        </div>
        <div className="flex gap-4">
          <span className="text-magenta-700">Encrypted_Link_Active</span>
          <Wifi className="w-3 h-3 text-white" />
        </div>
      </footer>
    </div>
  );
}

