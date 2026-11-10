import React, { useState } from 'react';
import { FoalStats } from '../types';
import { Volume2, VolumeX, Sparkles, Heart, Apple, Moon, Edit3, Check } from 'lucide-react';
import { sounds } from '../utils/audio';

interface StatusBarProps {
  stats: FoalStats;
  foalName: string;
  daysTogether: number;
  onUpdateName: (name: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenWardrobe: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  stats,
  foalName,
  daysTogether,
  onUpdateName,
  soundEnabled,
  onToggleSound,
  onOpenWardrobe,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(foalName);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  // Status helper colors
  const getHungerColor = (val: number) => {
    if (val < 35) return 'bg-emerald-500';
    if (val < 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getHungerLabel = (val: number) => {
    if (val < 35) return '든든함';
    if (val < 70) return '출출함';
    return '매우 배고픔!';
  };

  const getHappinessColor = (val: number) => {
    if (val > 65) return 'bg-pink-500';
    if (val > 35) return 'bg-amber-500';
    return 'bg-slate-500';
  };

  const getHappinessLabel = (val: number) => {
    if (val > 65) return '신남/행복';
    if (val > 35) return '보통';
    return '심심해요';
  };

  const getFatigueColor = (val: number) => {
    if (val < 40) return 'bg-sky-500';
    if (val < 70) return 'bg-amber-500';
    return 'bg-purple-600';
  };

  const getFatigueLabel = (val: number) => {
    if (val < 40) return '활기참';
    if (val < 70) return '나른함';
    return '매우 졸림!';
  };

  return (
    <div className="w-full bg-amber-900/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-amber-700/60 shadow-lg text-amber-50">
      {/* Top Header Row: Pet Profile & Utility Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-800/80">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-amber-700 flex items-center justify-center text-xl shadow-inner border border-amber-600">
            🐴
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              {isEditingName ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={10}
                    className="w-24 px-2 py-0.5 rounded bg-amber-950 text-white text-sm font-bold border border-amber-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 rounded bg-amber-600 hover:bg-amber-500 text-white cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-amber-100">
                    {foalName}
                  </span>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setNameInput(foalName);
                      setIsEditingName(true);
                    }}
                    className="text-amber-400 hover:text-amber-200 p-0.5 rounded cursor-pointer transition-colors"
                    title="이름 바꾸기"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-800/80 text-amber-300 border border-amber-700/60">
                함께한 지 {daysTogether}일째
              </span>
            </div>
            <p className="text-[11px] text-amber-300/80">사랑스러운 아기 망아지</p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Wardrobe Quick Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenWardrobe();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer border border-pink-400/50"
          >
            <Sparkles className="w-4 h-4" />
            <span>옷장 / 꾸미기</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleSound();
            }}
            className="p-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-200 hover:text-white transition-colors cursor-pointer border border-amber-700"
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-300" />}
          </button>
        </div>
      </div>

      {/* 3 Status Gauge Bars: Hunger, Happiness, Fatigue */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
        {/* 1. Hunger Gauge (0 ~ 100) */}
        <div className="bg-amber-950/60 rounded-xl p-2.5 border border-amber-800/60 shadow-inner">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <div className="flex items-center gap-1.5 text-amber-200">
              <Apple className="w-3.5 h-3.5 text-rose-400" />
              <span>배고픔</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-amber-300/80">{getHungerLabel(stats.hunger)}</span>
              <span className="font-extrabold text-amber-100">{Math.round(stats.hunger)}%</span>
            </div>
          </div>
          <div className="w-full h-3 rounded-full bg-amber-950 overflow-hidden border border-amber-800/80 relative">
            <div
              className={`h-full transition-all duration-500 rounded-full ${getHungerColor(stats.hunger)}`}
              style={{ width: `${Math.min(100, Math.max(0, stats.hunger))}%` }}
            />
          </div>
        </div>

        {/* 2. Happiness Gauge (0 ~ 100) */}
        <div className="bg-amber-950/60 rounded-xl p-2.5 border border-amber-800/60 shadow-inner">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <div className="flex items-center gap-1.5 text-pink-200">
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-current" />
              <span>행복도</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-pink-300/80">{getHappinessLabel(stats.happiness)}</span>
              <span className="font-extrabold text-pink-100">{Math.round(stats.happiness)}%</span>
            </div>
          </div>
          <div className="w-full h-3 rounded-full bg-amber-950 overflow-hidden border border-amber-800/80 relative">
            <div
              className={`h-full transition-all duration-500 rounded-full ${getHappinessColor(stats.happiness)}`}
              style={{ width: `${Math.min(100, Math.max(0, stats.happiness))}%` }}
            />
          </div>
        </div>

        {/* 3. Fatigue Gauge (0 ~ 100) */}
        <div className="bg-amber-950/60 rounded-xl p-2.5 border border-amber-800/60 shadow-inner">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <div className="flex items-center gap-1.5 text-sky-200">
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span>피로도</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-sky-300/80">{getFatigueLabel(stats.fatigue)}</span>
              <span className="font-extrabold text-sky-100">{Math.round(stats.fatigue)}%</span>
            </div>
          </div>
          <div className="w-full h-3 rounded-full bg-amber-950 overflow-hidden border border-amber-800/80 relative">
            <div
              className={`h-full transition-all duration-500 rounded-full ${getFatigueColor(stats.fatigue)}`}
              style={{ width: `${Math.min(100, Math.max(0, stats.fatigue))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
