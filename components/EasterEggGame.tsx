
import React, { useState, useEffect, useRef } from 'react';

interface EasterEggGameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GameItem {
  id: number;
  x: number;
  y: number;
  type: 'contract' | 'dismissal';
  spawnTime: number;
  duration: number;
}

const INITIAL_SPAWN_RATE = 1200;
const MIN_SPAWN_RATE = 400;

// SFX Engine using Web Audio API
const playSFX = (type: 'score' | 'hit' | 'start' | 'end', muted: boolean) => {
  if (muted) return;
  try {
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'score') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(55, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'start') {
      osc.type = 'square';
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((f, i) => {
        osc.frequency.setValueAtTime(f, now + i * 0.1);
      });
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.3);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'end') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(392, now);
      osc.frequency.linearRampToValueAtTime(196, now + 0.6);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch (e) {
    console.error("Audio API not supported", e);
  }
};

const PixelContract = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="pixelated">
    <rect x="4" y="4" width="32" height="32" fill="white" />
    <path d="M4 4H36V8H32V12H28V16H24V20H20V24H16V28H12V32H8V36H4V4Z" fill="#F1F5F9" />
    <rect x="8" y="12" width="24" height="4" fill="#E2E8F0" />
    <rect x="8" y="20" width="24" height="4" fill="#E2E8F0" />
    <rect x="8" y="28" width="16" height="4" fill="#E2E8F0" />
    <path d="M28 24L32 28L36 20" stroke="#2563eb" strokeWidth="4" />
    <rect x="0" y="4" width="4" height="32" fill="#1E293B" />
    <rect x="4" y="0" width="32" height="4" fill="#1E293B" />
    <rect x="36" y="4" width="4" height="32" fill="#1E293B" />
    <rect x="4" y="36" width="32" height="4" fill="#1E293B" />
  </svg>
);

const PixelDismissal = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="pixelated">
    <rect x="4" y="4" width="32" height="32" fill="#FFF1F2" />
    <rect x="8" y="12" width="24" height="4" fill="#FECDD3" />
    <rect x="8" y="20" width="24" height="4" fill="#FECDD3" />
    <path d="M12 24L28 36M28 24L12 36" stroke="#E11D48" strokeWidth="4" />
    <rect x="0" y="4" width="4" height="32" fill="#1E293B" />
    <rect x="4" y="0" width="32" height="4" fill="#1E293B" />
    <rect x="36" y="4" width="4" height="32" fill="#1E293B" />
    <rect x="4" y="36" width="32" height="4" fill="#1E293B" />
  </svg>
);

const PixelHeart = ({ filled }: { filled: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="pixelated">
    <path d="M4 4H8V8H4V4ZM8 4H12V8H8V4ZM12 4H16V8H12V4ZM16 4H20V8H16V4ZM4 8H8V12H4V8ZM20 8H16V12H20V8ZM4 12H8V16H4V12ZM20 12H16V16H20V12ZM8 16H12V20H8V16ZM12 16H16V20H12V16ZM12 20H8V24H12V20Z" fill="#1E293B" />
    <path d="M8 8H12V12H8V8ZM12 8H16V12H12V8ZM8 12H12V16H8V12ZM12 12H16V16H12V12ZM12 16H8V20H12V16Z" fill={filled ? "#E11D48" : "#94A3B8"} />
    <rect x="8" y="8" width="4" height="4" fill={filled ? "#FB7185" : "#CBD5E1"} />
  </svg>
);

const EasterEggGame: React.FC<EasterEggGameProps> = ({ isOpen, onClose }) => {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'ended'>('waiting');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [items, setItems] = useState<GameItem[]>([]);
  const [spawnRate, setSpawnRate] = useState(INITIAL_SPAWN_RATE);
  const [isMuted, setIsMuted] = useState(false);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const spawnRef = useRef<number | null>(null);
  const difficultyRef = useRef<number | null>(null);
  const bgmIntervalRef = useRef<number | null>(null);

  // Reset logic: when isOpen changes to true, always return to 'waiting'
  useEffect(() => {
    if (isOpen) {
      setGameState('waiting');
      setScore(0);
      setLives(3);
      setItems([]);
      setSpawnRate(INITIAL_SPAWN_RATE);
    } else {
      // Cleanup sounds when closed
      if (bgmIntervalRef.current) clearInterval(bgmIntervalRef.current);
    }
  }, [isOpen]);

  // Soundtrack and gameplay loops
  useEffect(() => {
    if (!isOpen) return;

    if (gameState === 'playing') {
      // Start Spawning
      const scheduleSpawn = () => {
        spawnItem();
        spawnRef.current = window.setTimeout(scheduleSpawn, spawnRate);
      };
      spawnRef.current = window.setTimeout(scheduleSpawn, spawnRate);

      // Progressive Difficulty
      difficultyRef.current = window.setInterval(() => {
        setSpawnRate(prev => Math.max(MIN_SPAWN_RATE, prev - 50));
      }, 3000);

      // Retro Soundtrack (8-bit Bassline)
      if (!isMuted) {
        try {
          const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
          const bgmCtx = new AudioContextClass();
          const notes = [110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83];
          let step = 0;
          
          bgmIntervalRef.current = window.setInterval(() => {
            const osc = bgmCtx.createOscillator();
            const gain = bgmCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(notes[step % notes.length], bgmCtx.currentTime);
            gain.gain.setValueAtTime(0.015, bgmCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, bgmCtx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(bgmCtx.destination);
            osc.start();
            osc.stop(bgmCtx.currentTime + 0.2);
            step++;
          }, 250);
        } catch (e) {
          console.error("BGM failed", e);
        }
      }
    }

    return () => {
      if (spawnRef.current) clearTimeout(spawnRef.current);
      if (difficultyRef.current) clearInterval(difficultyRef.current);
      if (bgmIntervalRef.current) clearInterval(bgmIntervalRef.current);
    };
  }, [gameState, isOpen, spawnRate, isMuted]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setItems([]);
    setSpawnRate(INITIAL_SPAWN_RATE);
    setGameState('playing');
    playSFX('start', isMuted);
  };

  const endGame = () => {
    setGameState('ended');
    if (spawnRef.current) clearTimeout(spawnRef.current);
    if (difficultyRef.current) clearInterval(difficultyRef.current);
    if (bgmIntervalRef.current) clearInterval(bgmIntervalRef.current);
    setItems([]);
    playSFX('end', isMuted);
  };

  const spawnItem = () => {
    if (!gameAreaRef.current) return;
    const { width, height } = gameAreaRef.current.getBoundingClientRect();
    const margin = 60;
    
    const isDismissal = Math.random() < 0.2;
    const duration = Math.max(800, 2000 - score * 10);

    const newItem: GameItem = {
      id: Date.now() + Math.random(),
      x: margin + Math.random() * (width - margin * 2),
      y: margin + Math.random() * (height - margin * 2),
      type: isDismissal ? 'dismissal' : 'contract',
      spawnTime: Date.now(),
      duration
    };

    setItems((prev) => [...prev, newItem]);

    setTimeout(() => {
      setItems((prev) => {
        const item = prev.find(i => i.id === newItem.id);
        if (item && item.type === 'contract') {
          handleMiss();
        }
        return prev.filter(i => i.id !== newItem.id);
      });
    }, duration);
  };

  const handleMiss = () => {
    playSFX('hit', isMuted);
    setLives(l => {
      const next = l - 1;
      if (next <= 0) setTimeout(endGame, 0);
      return next;
    });
  };

  const handleItemClick = (e: React.MouseEvent, item: GameItem) => {
    e.stopPropagation();
    
    if (item.type === 'dismissal') {
      handleMiss();
      setItems((prev) => prev.filter(i => i.id !== item.id));
      return;
    }
    
    playSFX('score', isMuted);
    setScore((prev) => prev + 1);
    setItems((prev) => prev.filter(i => i.id !== item.id));
  };

  const getJobTitle = () => {
    if (score < 10) return "CANDIDATO FANTASMA";
    if (score < 25) return "ESTAGIÁRIO PIXELADO";
    if (score < 50) return "PLENO DE 8-BITS";
    if (score < 80) return "SENIOR DAS ANTIGAS";
    return "DEUS DO RECRUTAMENTO";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white p-2 pixel-border w-full max-w-2xl h-[70vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Retro Header */}
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center font-pixel text-[10px]">
          <div className="flex items-center gap-4">
             <div className="flex gap-1">
               <PixelHeart filled={lives >= 1} />
               <PixelHeart filled={lives >= 2} />
               <PixelHeart filled={lives >= 3} />
             </div>
             <button 
              onClick={() => setIsMuted(!isMuted)} 
              className="ml-2 hover:text-blue-400 transition-colors"
              title={isMuted ? "Ativar Áudio" : "Mutar"}
             >
               <span className="material-symbols-outlined text-[18px]">
                 {isMuted ? 'volume_off' : 'volume_up'}
               </span>
             </button>
          </div>
          <div className="text-blue-400">SCORE: {score.toString().padStart(5, '0')}</div>
          <button onClick={onClose} className="hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Pixel Game Area */}
        <div 
          ref={gameAreaRef}
          className="flex-1 relative overflow-hidden bg-slate-50 cursor-crosshair select-none border-4 border-slate-900 mt-2"
          style={{ backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 0)', backgroundSize: '20px 20px' }}
        >
          {gameState === 'waiting' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-8 font-pixel">
              <div className="pixelated scale-150 mb-4 drop-shadow-md">
                <PixelContract />
              </div>
              <h2 className="text-lg text-slate-900 leading-tight tracking-tighter">CONTRATO HUNTER 8-BIT</h2>
              <div className="space-y-4 text-[8px] text-slate-500 leading-loose uppercase tracking-widest">
                <p>1. CLIQUE NOS CONTRATOS PARA PONTUAR (+1)</p>
                <p>2. SE O CONTRATO SUMIR, VOCÊ PERDE 1 VIDA</p>
                <p className="text-rose-600">3. CLICAR EM DEMISSÃO TIRA 1 VIDA!</p>
              </div>
              <button 
                onClick={startGame}
                className="pixel-btn px-8 py-4 text-[12px] bg-blue-600 border-slate-900"
              >
                INICIAR JOGO
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <>
              {items.map((item) => (
                <button
                  key={item.id}
                  onMouseDown={(e) => handleItemClick(e, item)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform active:scale-125"
                  style={{ left: item.x, top: item.y }}
                >
                  <div className="animate-in zoom-in duration-100 drop-shadow-sm">
                    {item.type === 'contract' ? <PixelContract /> : <PixelDismissal />}
                  </div>
                </button>
              ))}
            </>
          )}

          {gameState === 'ended' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-6 font-pixel animate-in zoom-in duration-300">
              <h2 className="text-2xl text-rose-600 mb-2">GAME OVER</h2>
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400">PONTUAÇÃO FINAL</p>
                <p className="text-xl text-blue-600">{score}</p>
              </div>
              <div className="bg-slate-100 p-4 border-2 border-dashed border-slate-300">
                <p className="text-[8px] text-slate-500 tracking-tighter">CARGO CONQUISTADO:</p>
                <p className="text-[10px] text-slate-900 mt-2">{getJobTitle()}</p>
              </div>
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={onClose}
                  className="text-[8px] text-slate-500 hover:text-slate-900 transition-colors"
                >
                  [ SAIR ]
                </button>
                <button 
                  onClick={startGame}
                  className="pixel-btn px-6 py-3 text-[10px] bg-blue-600"
                >
                  REPETIR
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 text-center font-pixel text-[6px] text-slate-400 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} CVFACIL ENTERTAINMENT SYSTEM
        </div>
      </div>
    </div>
  );
};

export default EasterEggGame;
