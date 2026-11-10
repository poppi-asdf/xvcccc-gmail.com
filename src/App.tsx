import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FoalStats,
  FoalCustomization,
  FoalActivity,
  FoodType,
  ToyType,
  FloatingParticle,
} from './types';
import { BarnEnvironment } from './components/BarnEnvironment';
import { StatusBar } from './components/StatusBar';
import { ActionToolbar } from './components/ActionToolbar';
import { WardrobePanel } from './components/WardrobePanel';
import { MiniToyAnimations } from './components/MiniToyAnimations';
import { sounds } from './utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Info, RefreshCw, Play, Pause } from 'lucide-react';

const STORAGE_KEY = 'cozy_foal_tamagotchi_save_v1';

export default function App() {
  // 1. Foal Stats State
  const [stats, setStats] = useState<FoalStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.stats) return parsed.stats;
      } catch {
        // fallback
      }
    }
    return {
      hunger: 35, // 0 = 배부름, 100 = 극도로 배고픔
      happiness: 85, // 100 = 최고
      fatigue: 25, // 0 = 쌩쌩, 100 = 지침
    };
  });

  // 2. Foal Customization (Color & Clothes)
  const [customization, setCustomization] = useState<FoalCustomization>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.customization) return parsed.customization;
      } catch {
        // fallback
      }
    }
    return {
      color: 'brown',
      hat: 'straw_hat',
      outfit: 'red_scarf',
    };
  });

  // 3. Foal Identity & Days
  const [foalName, setFoalName] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.foalName) return parsed.foalName;
      } catch {
        // fallback
      }
    }
    return '초코';
  });

  const [daysTogether, setDaysTogether] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.daysTogether) return parsed.daysTogether;
      } catch {
        // fallback
      }
    }
    return 1;
  });

  // 4. Current Activity & Interaction
  const [activity, setActivity] = useState<FoalActivity>('idle');
  const [currentFood, setCurrentFood] = useState<FoodType | null>(null);
  const [currentToy, setCurrentToy] = useState<ToyType | null>(null);
  const [isPetting, setIsPetting] = useState(false);
  const [wardrobeOpen, setWardrobeOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const activityTimeoutRef = useRef<number | null>(null);

  // Sound sync
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  // Save to localStorage on changes
  useEffect(() => {
    const payload = {
      stats,
      customization,
      foalName,
      daysTogether,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [stats, customization, foalName, daysTogether]);

  // Helper to spawn floating hearts / emojis
  const spawnParticle = (emoji: string) => {
    const newP: FloatingParticle = {
      id: Math.random().toString(),
      x: 50 + (Math.random() - 0.5) * 20, // percentage around center
      y: 60 + (Math.random() - 0.5) * 15,
      emoji,
    };
    setParticles((prev) => [...prev, newP]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newP.id));
    }, 1200);
  };

  // 5. Tamagotchi Natural Life Loop (every 3.5 seconds)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setStats((prev) => {
        let newHunger = prev.hunger;
        let newHappiness = prev.happiness;
        let newFatigue = prev.fatigue;

        if (activity === 'sleeping') {
          // Fast fatigue recovery during sleep, slow hunger increase
          newFatigue = Math.max(0, prev.fatigue - 8);
          newHunger = Math.min(100, prev.hunger + 1.2);
          newHappiness = Math.min(100, prev.happiness + 0.8);
          if (Math.random() > 0.6) {
            sounds.playSleepSnore();
          }
        } else if (activity === 'resting_sofa') {
          // Moderate fatigue recovery, relax
          newFatigue = Math.max(0, prev.fatigue - 4);
          newHunger = Math.min(100, prev.hunger + 1);
          newHappiness = Math.min(100, prev.happiness + 1.2);
        } else {
          // Idle decay over time
          newHunger = Math.min(100, prev.hunger + 1.2);
          newFatigue = Math.min(100, prev.fatigue + 0.7);
          newHappiness = Math.max(0, prev.happiness - 0.8);
        }

        return {
          hunger: Number(newHunger.toFixed(1)),
          happiness: Number(newHappiness.toFixed(1)),
          fatigue: Number(newFatigue.toFixed(1)),
        };
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [activity, isPaused]);

  // 6. Action Handlers

  // Petting (쓰다듬기)
  const handlePet = useCallback(() => {
    sounds.playPet();
    sounds.playNeigh();
    setIsPetting(true);
    spawnParticle('💖');
    spawnParticle('✨');

    setStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
    }));

    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = window.setTimeout(() => {
      setIsPetting(false);
    }, 1500);
  }, []);

  // Feeding (먹이 주기)
  const handleFeed = useCallback((food: FoodType) => {
    if (activity === 'sleeping') return;
    sounds.playChomp();
    setCurrentFood(food);
    setActivity('eating');

    let hungerDelta = 25;
    let happyDelta = 5;
    let emoji = '🥕';

    if (food === 'carrot') {
      hungerDelta = 30;
      happyDelta = 6;
      emoji = '🥕';
    } else if (food === 'apple') {
      hungerDelta = 25;
      happyDelta = 10;
      emoji = '🍎';
    } else if (food === 'sugar') {
      hungerDelta = 15;
      happyDelta = 18;
      emoji = '🧊';
    }

    spawnParticle(emoji);
    spawnParticle('😋');

    setStats((prev) => ({
      ...prev,
      hunger: Math.max(0, prev.hunger - hungerDelta),
      happiness: Math.min(100, prev.happiness + happyDelta),
    }));

    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = window.setTimeout(() => {
      setActivity('idle');
      setCurrentFood(null);
    }, 2200);
  }, [activity]);

  // Playing with Toy (장난감 놀기)
  const handlePlayToy = useCallback((toy: ToyType) => {
    if (activity === 'sleeping') return;
    setCurrentToy(toy);

    let happyDelta = 20;
    let fatigueDelta = 8;

    if (toy === 'ball') {
      sounds.playBounce();
      setActivity('playing_ball');
      happyDelta = 25;
      fatigueDelta = 10;
      spawnParticle('⚽');
      spawnParticle('🌟');
    } else if (toy === 'balloon') {
      sounds.playBalloon();
      setActivity('playing_balloon');
      happyDelta = 20;
      fatigueDelta = 7;
      spawnParticle('🎈');
      spawnParticle('✨');
    } else if (toy === 'brush') {
      sounds.playBrush();
      setActivity('brushing');
      happyDelta = 22;
      fatigueDelta = 4;
      spawnParticle('🪮');
      spawnParticle('✨');
      spawnParticle('💖');
    }

    setStats((prev) => {
      const nextHappy = Math.min(100, prev.happiness + happyDelta);
      if (nextHappy >= 95) {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
      return {
        ...prev,
        happiness: nextHappy,
        fatigue: Math.min(100, prev.fatigue + fatigueDelta),
      };
    });

    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = window.setTimeout(() => {
      setActivity('idle');
      setCurrentToy(null);
    }, 2800);
  }, [activity]);

  // Rest on Sofa (소파에서 쉬기)
  const handleRestSofa = useCallback(() => {
    sounds.playClick();
    setActivity('resting_sofa');
    spawnParticle('☕');
    setStats((prev) => ({
      ...prev,
      fatigue: Math.max(0, prev.fatigue - 8),
    }));
  }, []);

  // Sleep in Bed (이불 덮고 자기)
  const handleSleep = useCallback(() => {
    sounds.playSleepSnore();
    setActivity('sleeping');
    spawnParticle('💤');
    spawnParticle('🌙');
    setStats((prev) => ({
      ...prev,
      fatigue: Math.max(0, prev.fatigue - 15),
    }));
  }, []);

  // Wake Up (일어나기)
  const handleWakeUp = useCallback(() => {
    sounds.playNeigh();
    setActivity('idle');
    spawnParticle('☀️');
    spawnParticle('✨');
  }, []);

  // Reset Game
  const handleResetGame = () => {
    if (window.confirm('아기 말 상태를 처음으로 초기화할까요?')) {
      localStorage.removeItem(STORAGE_KEY);
      setStats({ hunger: 30, happiness: 85, fatigue: 20 });
      setCustomization({ color: 'brown', hat: 'straw_hat', outfit: 'red_scarf' });
      setFoalName('초코');
      setDaysTogether(1);
      setActivity('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#2c1808] text-amber-50 flex flex-col items-center justify-center p-3 sm:p-5 selection:bg-amber-500 selection:text-white">
      {/* Handheld Tamagotchi / Cozy Wooden Barn Frame */}
      <div className="w-full max-w-3xl bg-[#3f210d] rounded-[36px] p-4 sm:p-6 border-4 sm:border-8 border-[#5f3316] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative flex flex-col gap-3">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between px-2 text-xs text-amber-300 font-extrabold tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🌾</span>
            <span>마구간 다마고찌 힐링 포니</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-900 hover:bg-amber-800 text-[11px] text-amber-200 cursor-pointer border border-amber-700/60"
              title={isPaused ? '게임 재개' : '시간 일시정지'}
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-300" />}
              <span>{isPaused ? '일시정지됨' : '실시간'}</span>
            </button>
            <button
              onClick={handleResetGame}
              className="p-1 rounded-full bg-amber-900/60 hover:bg-amber-800 text-amber-400 cursor-pointer"
              title="게임 초기화"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 1. Status Bar (Hunger, Happiness, Fatigue Gauges) */}
        <StatusBar
          stats={stats}
          foalName={foalName}
          daysTogether={daysTogether}
          onUpdateName={setFoalName}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onOpenWardrobe={() => setWardrobeOpen(true)}
        />

        {/* 2. Barn Environment & Interactive Foal */}
        <div className="relative">
          <BarnEnvironment
            color={customization.color}
            hat={customization.hat}
            outfit={customization.outfit}
            activity={activity}
            stats={stats}
            foalName={foalName}
            isPetting={isPetting}
            onPetFoal={handlePet}
            onWakeUp={handleWakeUp}
          />

          {/* Floating Food & Toy Animation Effects */}
          <MiniToyAnimations
            activity={activity}
            currentFood={currentFood}
            currentToy={currentToy}
          />

          {/* Floating Petting Heart / Emoji Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute text-2xl sm:text-3xl pointer-events-none select-none z-30 animate-[floatUp_1.2s_ease-out_forwards]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>

        {/* 3. Action Toolbar (Petting, Food, Toys, Sofa, Bed) */}
        <ActionToolbar
          activity={activity}
          onPet={handlePet}
          onFeed={handleFeed}
          onPlayToy={handlePlayToy}
          onRestSofa={handleRestSofa}
          onSleep={handleSleep}
          onWakeUp={handleWakeUp}
        />

        {/* Helpful Tips bar */}
        <div className="flex items-center justify-between text-[11px] text-amber-400/80 px-2 pt-1">
          <div className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>팁: 3D 아기 말을 마우스/터치로 드래그하여 360도 둘러보고, 클릭해서 쓰다듬을 수 있어요!</span>
          </div>
          <button
            onClick={() => setWardrobeOpen(true)}
            className="text-pink-300 hover:text-pink-100 font-bold underline cursor-pointer shrink-0 ml-2"
          >
            옷장 열기 ✨
          </button>
        </div>
      </div>

      {/* Wardrobe Modal */}
      <WardrobePanel
        customization={customization}
        onUpdateCustomization={(update) => setCustomization((prev) => ({ ...prev, ...update }))}
        isOpen={wardrobeOpen}
        onClose={() => setWardrobeOpen(false)}
      />

      {/* Global CSS for particle float animation */}
      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translate(-50%, 0px) scale(0.8);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -60px) scale(1.3);
          }
        }
      `}</style>
    </div>
  );
}
