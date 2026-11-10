import React, { useEffect, useState } from 'react';
import { FoalActivity, FoodType, ToyType } from '../types';

interface MiniToyAnimationsProps {
  activity: FoalActivity;
  currentFood: FoodType | null;
  currentToy: ToyType | null;
}

export const MiniToyAnimations: React.FC<MiniToyAnimationsProps> = ({
  activity,
  currentFood,
  currentToy,
}) => {
  // Crumbs particle effect during eating
  const [crumbs, setCrumbs] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (activity === 'eating') {
      const newCrumbs = Array.from({ length: 8 }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 60,
        y: -Math.random() * 40 - 20,
      }));
      setCrumbs(newCrumbs);
      const timer = setTimeout(() => setCrumbs([]), 1400);
      return () => clearTimeout(timer);
    }
  }, [activity, currentFood]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {/* 1. Food Flying & Chomping Effect */}
      {activity === 'eating' && currentFood && (
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
          <div className="text-4xl sm:text-5xl drop-shadow-lg scale-125 transition-transform">
            {currentFood === 'carrot' ? '🥕' : currentFood === 'apple' ? '🍎' : '🧊'}
          </div>
          {/* Crumbs bursting */}
          {crumbs.map((c) => (
            <span
              key={c.id}
              className="absolute text-xs animate-ping"
              style={{
                transform: `translate(${c.x}px, ${c.y}px)`,
              }}
            >
              ✨
            </span>
          ))}
          <span className="text-xs font-black text-amber-900 bg-amber-100/95 px-2 py-0.5 rounded-full mt-2 shadow border border-amber-300">
            냠냠 아삭아삭!
          </span>
        </div>
      )}

      {/* 2. Toy 1: Bouncing Ball (탱탱볼) */}
      {activity === 'playing_ball' && (
        <div className="absolute inset-x-0 bottom-16 sm:bottom-20 flex justify-center">
          <div className="relative w-72 sm:w-96 h-28">
            <div className="absolute bottom-2 text-4xl sm:text-5xl animate-[ballBounce_0.75s_infinite_ease-in-out]">
              ⚽
            </div>
            <div className="absolute bottom-0 text-xl opacity-60 animate-[ballBounce_0.75s_infinite_ease-in-out]">
              💨
            </div>
          </div>
        </div>
      )}

      {/* 3. Toy 2: Red Balloon (빨간 풍선) */}
      {activity === 'playing_balloon' && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center animate-[balloonFloat_2s_infinite_ease-in-out]">
          <div className="text-5xl sm:text-6xl drop-shadow-xl">🎈</div>
          <div className="flex gap-1 text-xs text-amber-200 mt-1 font-bold animate-pulse">
            <span>둥실둥실~ 🎈</span>
          </div>
        </div>
      )}

      {/* 4. Toy 3: Grooming Brush (브러시 빗질) */}
      {activity === 'brushing' && (
        <div className="absolute top-[46%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-[brushSweep_1s_infinite_ease-in-out]">
          <div className="text-4xl sm:text-5xl drop-shadow-lg rotate-12">🪮</div>
          {/* Sparkles trailing the brush */}
          <div className="absolute -top-4 -right-4 text-amber-300 text-lg animate-spin">✨</div>
          <div className="absolute -bottom-2 -left-4 text-yellow-200 text-sm animate-ping">✦</div>
          <span className="text-xs font-black text-amber-950 bg-amber-100/90 px-2.5 py-0.5 rounded-full shadow border border-amber-300 mt-2">
            쓱싹쓱싹 빗질 중 ✨
          </span>
        </div>
      )}

      {/* Animation Keyframes */}
      <style>{`
        @keyframes ballBounce {
          0%, 100% {
            transform: translate(20px, 0px) scale(1.15, 0.85);
          }
          50% {
            transform: translate(160px, -70px) scale(0.9, 1.1) rotate(180deg);
          }
        }
        @keyframes balloonFloat {
          0%, 100% {
            transform: translateY(0px) rotate(-4deg);
          }
          50% {
            transform: translateY(-24px) rotate(6deg);
          }
        }
        @keyframes brushSweep {
          0%, 100% {
            transform: translate(0px, 0px) rotate(-15deg);
          }
          50% {
            transform: translate(50px, -20px) rotate(20deg);
          }
        }
      `}</style>
    </div>
  );
};
