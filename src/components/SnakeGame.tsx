import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { GameState } from '../types';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION as any,
    score: 0,
    isPaused: true,
    isGameOver: false,
  });

  const directionRef = useRef(INITIAL_DIRECTION);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const generateFood = useCallback((snake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION as any,
      score: 0,
      isPaused: false,
      isGameOver: false,
    });
    directionRef.current = INITIAL_DIRECTION;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (!gameStateRef.current.isPaused && !gameStateRef.current.isGameOver) {
          e.preventDefault();
        }
      }
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameState.isPaused || gameState.isGameOver) return;

    const moveSnake = () => {
      setGameState(prev => {
        const newSnake = [...prev.snake];
        const head = { ...newSnake[0] };
        const direction = directionRef.current;

        switch (direction) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Check collisions
        if (
          head.x < 0 || head.x >= GRID_SIZE ||
          head.y < 0 || head.y >= GRID_SIZE ||
          newSnake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
          return { ...prev, isGameOver: true };
        }

        newSnake.unshift(head);

        // Check food
        if (head.x === prev.food.x && head.y === prev.food.y) {
          return {
            ...prev,
            snake: newSnake,
            food: generateFood(newSnake),
            score: prev.score + 10,
          };
        } else {
          newSnake.pop();
          return { ...prev, snake: newSnake };
        }
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [gameState.isPaused, gameState.isGameOver, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#ff00ff';
      ctx.shadowBlur = isHead ? 20 : 0;
      ctx.shadowColor = isHead ? '#00ffff' : 'transparent';
      
      const x = segment.x * cellSize + 1;
      const y = segment.y * cellSize + 1;
      const size = cellSize - 2;
      
      ctx.fillRect(x, y, size, size);
      
      if (isHead) {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, size, size);
      }
    });

    // Draw food
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#fff';
    const fx = gameState.food.x * cellSize + cellSize/2;
    const fy = gameState.food.y * cellSize + cellSize/2;
    ctx.beginPath();
    ctx.rect(fx - cellSize/4, fy - cellSize/4, cellSize/2, cellSize/2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [gameState.snake, gameState.food]);

  return (
    <div id="game-container" className="flex flex-col items-center gap-6 w-full font-pixel">
      <div className="flex justify-between w-full items-end pb-4 border-b-2 border-cyan-500/50">
        <div className="space-y-1">
          <p className="text-[14px] uppercase tracking-[0.2em] text-magenta-500">_SEC_SCORE</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white glitch-text">
              {gameState.score.toString().padStart(5, '0')}
            </span>
          </div>
        </div>
        
        <button
          id="pause-toggle"
          onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
          className="px-6 py-2 bg-black border-2 border-magenta-500 hover:bg-magenta-500 hover:text-black transition-all active:translate-y-1 uppercase tracking-[0.2em] text-sm font-bold"
        >
          {gameState.isPaused ? '>_EXEC' : '>_HALT'}
        </button>
      </div>

      <div className="relative aspect-square w-full border-4 border-cyan-500 bg-black overflow-hidden group/canvas shadow-[20px_20px_0_rgba(0,255,255,0.1)]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full block image-pixelated"
        />
        
        <AnimatePresence>
          {(gameState.isGameOver || gameState.isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex items-center justify-center text-center p-8 z-50"
            >
              <div className="space-y-8">
                {gameState.isGameOver ? (
                  <>
                    <div className="space-y-2">
                       <h2 className="text-6xl font-black uppercase tracking-tighter text-red-600 animate-glitch glitch-text">FATAL_ERR</h2>
                       <p className="text-white font-mono text-[12px] uppercase tracking-[0.5em]">Memory Corrupted // Overload</p>
                    </div>
                    <button
                      id="reset-game"
                      onClick={resetGame}
                      className="px-10 py-4 bg-white text-black font-black uppercase text-sm tracking-[0.3em] hover:bg-cyan-500 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                      REBOOT_SESSION
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                       <h2 className="text-6xl font-black uppercase tracking-tighter text-cyan-400">WAITING...</h2>
                       <p className="text-magenta-500 text-[12px] uppercase tracking-[0.5em]">Manual Override Required</p>
                    </div>
                    <button
                      id="resume-game"
                      onClick={() => setGameState(prev => ({ ...prev, isPaused: false }))}
                      className="px-10 py-4 bg-cyan-500 text-black font-black uppercase text-sm tracking-[0.3em] hover:bg-white transition-colors"
                    >
                      RESUME_LINK
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full text-[14px]">
        <div className="p-4 bg-black border-2 border-zinc-800">
           <p className="uppercase tracking-widest text-zinc-600 mb-2 font-bold">Signal</p>
           <div className="flex items-center gap-3">
             <div className={`w-3 h-3 ${gameState.isPaused ? 'bg-zinc-800' : 'bg-lime-500 animate-glitch'}`} />
             <span className="text-white uppercase">{gameState.isPaused ? 'Sync_Lost' : 'Streaming'}</span>
           </div>
        </div>
        <div className="p-4 bg-black border-2 border-zinc-800">
           <p className="uppercase tracking-widest text-zinc-600 mb-2 font-bold">Node_Area</p>
           <span className="text-white uppercase tracking-widest">{GRID_SIZE}x{GRID_SIZE} BIT_MAP</span>
        </div>
      </div>
    </div>
  );
};
