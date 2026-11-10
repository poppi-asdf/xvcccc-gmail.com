import React, { useState } from 'react';
import { FoalActivity, FoalColor, HatAccessory, OutfitAccessory, FoalStats } from '../types';
import { FoalSvg } from './FoalSvg';
import { Foal3DViewer } from './Foal3DViewer';
import { sounds } from '../utils/audio';
import { Sparkles, Moon, Sun, Heart, Coffee, Box } from 'lucide-react';

interface BarnEnvironmentProps {
  color: FoalColor;
  hat: HatAccessory;
  outfit: OutfitAccessory;
  activity: FoalActivity;
  stats: FoalStats;
  foalName: string;
  isPetting: boolean;
  onPetFoal: () => void;
  onWakeUp: () => void;
  isNightModeManual?: boolean;
}

export const BarnEnvironment: React.FC<BarnEnvironmentProps> = ({
  color,
  hat,
  outfit,
  activity,
  stats,
  foalName,
  isPetting,
  onPetFoal,
  onWakeUp,
}) => {
  const [lanternLit, setLanternLit] = useState(true);
  const [birdFlown, setBirdFlown] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false); // Default to detailed 2D SVG character!

  const isSleeping = activity === 'sleeping';
  const isResting = activity === 'resting_sofa';

  // Barn Lighting: dim when sleeping or when lantern is turned off
  const isNight = isSleeping;

  // Compute dynamic speech bubble text
  const getSpeechBubble = () => {
    if (isSleeping) {
      return '쿨쿨... Zzz... 💭 (달콤한 각설탕 꿈을 꿔요)';
    }
    if (isResting) {
      return '푹신한 소파에서 쉬니까 나른하고 편안해요~ ☕';
    }
    if (isPetting) {
      return '히히힝~! 쓰다듬어 주셔서 너무 기분 좋아요! 💕';
    }
    if (activity === 'eating') {
      return '아삭아삭 냠냠! 세상에서 제일 맛있어요! 😋';
    }
    if (activity === 'playing_ball') {
      return '통통 튀는 공놀이 최고! 폴짝폴짝! ⚽✨';
    }
    if (activity === 'playing_balloon') {
      return '둥실둥실 풍선 잡기 놀이! 🎈';
    }
    if (activity === 'brushing') {
      return '털이 찰랑찰랑 윤기가 흘러요~ 시원해라! 🪮✨';
    }
    // Condition checks
    if (stats.hunger >= 75) {
      return '배가 너무 고파요... 꼬르륵! 당근이나 사과 주세요 히히힝~ 🥕';
    }
    if (stats.fatigue >= 80) {
      return '눈꺼풀이 천근만근... 졸려요... 이불 덮어주세요 Zzz 🥱';
    }
    if (stats.happiness <= 30) {
      return '심심해요... 저랑 공놀이나 빗질 놀이 해주세요! 🥺';
    }
    if (stats.hunger >= 50) {
      return '슬슬 배가 출출해요~ 맛있는 간식 없을까요? 🍎';
    }
    if (stats.happiness >= 80) {
      return `오늘 하루도 ${foalName}는 주인님이 제일 좋아요! 히히힝~ 💖`;
    }
    return '히히힝~ 마구간에서 즐거운 시간 보내고 있어요! 🌿';
  };

  const handleWindowClick = () => {
    sounds.playBalloon();
    setBirdFlown(true);
    setTimeout(() => setBirdFlown(false), 3000);
  };

  const toggleLantern = () => {
    sounds.playClick();
    setLanternLit((prev) => !prev);
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-900/40 select-none transition-colors duration-700 bg-amber-950">
      {/* 1. Wood Plank Wall Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#5c3317] via-[#482811] to-[#341d0c]">
        {/* Wood grain vertical planks */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #2b1708 0px, #2b1708 2px, transparent 2px, transparent 48px), repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 6px)',
          }}
        />
        {/* Horizontal support beam */}
        <div className="absolute top-12 left-0 right-0 h-4 bg-[#381e0b] border-y border-[#261306] shadow-md opacity-70" />
        <div className="absolute top-28 left-0 right-0 h-3 bg-[#381e0b] border-y border-[#261306] shadow-sm opacity-50" />
      </div>

      {/* 2. Arched Window with Outdoor View */}
      <div
        onClick={handleWindowClick}
        title="창문을 눌러보세요!"
        className="absolute top-6 left-1/2 -translate-x-1/2 w-36 h-40 sm:w-44 sm:h-44 rounded-t-full rounded-b-lg border-4 border-amber-800 bg-amber-900 shadow-inner overflow-hidden cursor-pointer group z-0"
      >
        {/* Outside Sky: Day vs Night */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            isNight
              ? 'bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900'
              : 'bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-200'
          }`}
        >
          {isNight ? (
            <>
              {/* Crescent Moon */}
              <div className="absolute top-4 right-5 w-8 h-8 rounded-full bg-amber-100 shadow-[0_0_12px_#fde047]">
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-indigo-950" />
              </div>
              {/* Twinkling stars */}
              <div className="absolute top-5 left-4 text-amber-200 text-xs animate-ping">✦</div>
              <div className="absolute top-12 left-10 text-white text-xs opacity-80">★</div>
              <div className="absolute top-8 right-14 text-amber-100 text-[10px] animate-pulse">✦</div>
              <div className="absolute top-16 left-6 text-white text-[8px] opacity-60">★</div>
            </>
          ) : (
            <>
              {/* Sun & warm glow */}
              <div className="absolute top-3 left-4 w-10 h-10 rounded-full bg-amber-300 shadow-[0_0_20px_#f59e0b] opacity-90" />
              {/* Fluffy clouds */}
              <div className="absolute top-8 right-3 flex items-center opacity-85">
                <div className="w-8 h-5 rounded-full bg-white" />
                <div className="w-10 h-7 rounded-full bg-white -ml-3 -mt-2" />
                <div className="w-7 h-4 rounded-full bg-white -ml-2" />
              </div>
              {/* Flying bird easter egg */}
              {birdFlown && (
                <div className="absolute top-10 left-0 text-amber-900 text-xs font-bold animate-[moveAcross_2.5s_linear_forwards]">
                  🕊️~
                </div>
              )}
            </>
          )}

          {/* Rolling green hills outside */}
          <div className="absolute -bottom-6 -left-6 w-32 h-20 rounded-full bg-emerald-600/70" />
          <div className="absolute -bottom-6 -right-6 w-36 h-22 rounded-full bg-emerald-500/80" />
          <div className="absolute -bottom-10 left-6 w-32 h-18 rounded-full bg-emerald-700/60" />
        </div>

        {/* Window Wooden Crossbars */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-amber-800 shadow" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-amber-800 shadow" />
        <div className="absolute bottom-0 inset-x-0 h-3 bg-amber-900 border-t border-amber-950" />
      </div>

      {/* 3. Barn Wall Props: Hanging Horseshoe, 3D Mode Toggle & Lantern */}
      {/* Horseshoe on left */}
      <div className="absolute top-8 left-10 sm:left-16 flex flex-col items-center">
        <div
          title="행운을 부르는 말발굽"
          className="w-10 h-10 border-4 border-amber-600 rounded-t-full border-b-0 flex items-center justify-center shadow-md rotate-180 text-amber-500"
        >
          <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
        </div>
        <span className="text-[10px] text-amber-300/70 font-medium mt-1">행운의 말발굽</span>
      </div>

      {/* 3D / 2D Character Toggle Pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() => {
            sounds.playClick();
            setIs3DMode((prev) => !prev);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-lg border transition-all cursor-pointer active:scale-95 ${
            !is3DMode
              ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white border-pink-300 ring-2 ring-pink-400/40'
              : 'bg-amber-900/90 text-amber-200 border-amber-700/80 hover:bg-amber-800'
          }`}
          title="디테일 일러스트(SVG)와 3D 입체 캐릭터 모드를 전환해요"
        >
          <Sparkles className={`w-3.5 h-3.5 ${!is3DMode ? 'text-yellow-200 animate-spin' : 'text-amber-300'}`} />
          <span>{!is3DMode ? '✨ 귀여운 디테일 SVG 모드' : '🎮 3D 입체 캐릭터 모드'}</span>
        </button>
      </div>

      {/* Hanging Lantern on right */}
      <div
        onClick={toggleLantern}
        title="랜턴을 켜고 끌 수 있어요"
        className="absolute top-4 right-10 sm:right-16 flex flex-col items-center cursor-pointer group z-10"
      >
        {/* Wire */}
        <div className="w-0.5 h-6 bg-amber-950" />
        {/* Lantern Body */}
        <div className="relative w-8 h-12 bg-amber-950 rounded-lg border-2 border-amber-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <div
            className={`w-5 h-8 rounded transition-all duration-300 ${
              lanternLit
                ? 'bg-amber-300 shadow-[0_0_24px_#fbbf24]'
                : 'bg-amber-900/60'
            }`}
          >
            {lanternLit && (
              <div className="w-2 h-4 mx-auto mt-2 rounded-full bg-orange-400 animate-pulse" />
            )}
          </div>
        </div>
        <span className="text-[10px] text-amber-300/80 font-medium mt-1">
          {lanternLit ? '조명 끄기' : '조명 켜기'}
        </span>
      </div>

      {/* 4. Floor Hay & Straw Bedding */}
      <div className="absolute bottom-0 inset-x-0 h-44 sm:h-48 bg-gradient-to-t from-[#B48443] via-[#CA9A52] to-[#dfae62] shadow-[inset_0_12px_18px_rgba(0,0,0,0.3)]">
        {/* Scattered straw strands (SVG pattern) */}
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="20" x2="60" y2="40" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="60" x2="130" y2="50" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="160" y1="30" x2="210" y2="45" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <line x1="260" y1="55" x2="310" y2="35" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
          <line x1="380" y1="25" x2="430" y2="60" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <line x1="500" y1="40" x2="550" y2="20" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="90" x2="110" y2="110" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
          <line x1="220" y1="120" x2="280" y2="100" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
          <line x1="390" y1="110" x2="440" y2="130" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <line x1="540" y1="95" x2="600" y2="115" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="130" y1="135" x2="180" y2="140" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="470" y1="140" x2="520" y2="135" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        {/* Fluffy Straw Tufts along the bottom */}
        <div className="absolute -top-3 inset-x-0 flex justify-around opacity-90 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-8 h-4 bg-amber-300 rounded-t-full rotate-6 transform"
              style={{
                transform: `rotate(${i % 2 === 0 ? '-12deg' : '12deg'}) translateY(${i % 3}px)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 5. Left Side: 푹신한 빈백 소파 (Plush Beanbag Sofa) */}
      <div
        className={`absolute bottom-8 left-3 sm:left-6 md:left-10 w-28 sm:w-36 md:w-44 flex flex-col items-center transition-all duration-300 ${
          isResting ? 'scale-105 drop-shadow-xl' : 'hover:scale-102'
        }`}
      >
        {/* Cozy Label */}
        <div className="flex items-center gap-1 mb-1 px-2 py-0.5 rounded-full bg-amber-900/60 backdrop-blur-xs text-[10px] text-amber-200 border border-amber-700/50">
          <Coffee className="w-2.5 h-2.5 text-amber-300" />
          <span>폭신 소파</span>
        </div>

        {/* Sofa Beanbag SVG */}
        <div className="relative w-full h-24 sm:h-28">
          <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-md">
            {/* Beanbag Base (Plush warm terracotta / mustard quilted) */}
            <ellipse cx="80" cy="75" rx="72" ry="40" fill="#EA580C" />
            <ellipse cx="80" cy="70" rx="66" ry="34" fill="#F97316" />
            <ellipse cx="80" cy="62" rx="55" ry="26" fill="#FB923C" />
            {/* Quilted stitching lines */}
            <path d="M40 70 Q80 85 120 70" stroke="#EA580C" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M50 55 Q80 70 110 55" stroke="#EA580C" strokeWidth="2" fill="none" opacity="0.6" />
            {/* Back cushion */}
            <ellipse cx="80" cy="38" rx="42" ry="26" fill="#F97316" />
            <ellipse cx="80" cy="35" rx="36" ry="20" fill="#FDBA74" />
            {/* Cute throw pillow */}
            <rect
              x="35"
              y="40"
              width="26"
              height="26"
              rx="6"
              fill="#FDE047"
              transform="rotate(-15 48 53)"
              stroke="#EAB308"
              strokeWidth="1.5"
            />
            <circle cx="46" cy="50" r="3" fill="#EA580C" />
          </svg>
        </div>
      </div>

      {/* 6. Right Side: 건초 위 포근한 침대 (Hay Bed with Warm Plaid Blanket) */}
      <div
        className={`absolute bottom-6 right-3 sm:right-6 md:right-10 w-36 sm:w-44 md:w-52 flex flex-col items-center transition-all duration-300 ${
          isSleeping ? 'scale-105 drop-shadow-2xl' : 'hover:scale-102'
        }`}
      >
        {/* Cozy Label */}
        <div className="flex items-center gap-1 mb-1 px-2 py-0.5 rounded-full bg-amber-900/60 backdrop-blur-xs text-[10px] text-amber-200 border border-amber-700/50">
          <Moon className="w-2.5 h-2.5 text-amber-300" />
          <span>따뜻한 건초 침대</span>
        </div>

        {/* Bed with Fluffy Hay, Soft Pillow, and Plaid Blanket */}
        <div className="relative w-full h-28 sm:h-32">
          {/* Wooden Bed Frame / Slat Box */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-amber-900 rounded-b-xl border-2 border-amber-950 flex items-center justify-center">
            <span className="text-[10px] text-amber-300/80 font-bold tracking-wider">포근한 잠자리</span>
          </div>

          {/* Golden Hay Mound Mattress */}
          <div className="absolute bottom-6 inset-x-2 h-14 bg-amber-400 rounded-t-2xl shadow-inner border border-amber-500 overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:8px_8px]" />
          </div>

          {/* Soft White Cloud Pillow */}
          <div className="absolute bottom-14 left-4 w-16 h-9 rounded-2xl bg-white shadow-md border border-slate-200 rotate-[-6deg] flex items-center justify-center">
            <div className="w-12 h-5 rounded-full bg-slate-100" />
          </div>

          {/* Warm Tartan Plaid Blanket (체크무늬 담요) */}
          <div className="absolute bottom-4 right-2 w-28 sm:w-32 h-16 rounded-xl shadow-lg overflow-hidden border-2 border-red-900">
            {/* Red and Green Tartan Plaid Pattern */}
            <div
              className="w-full h-full"
              style={{
                backgroundColor: '#b91c1c',
                backgroundImage: `
                  repeating-linear-gradient(0deg, rgba(254, 240, 138, 0.4) 0px, rgba(254, 240, 138, 0.4) 2px, transparent 2px, transparent 18px),
                  repeating-linear-gradient(90deg, rgba(254, 240, 138, 0.4) 0px, rgba(254, 240, 138, 0.4) 2px, transparent 2px, transparent 18px),
                  repeating-linear-gradient(0deg, rgba(22, 101, 52, 0.5) 0px, rgba(22, 101, 52, 0.5) 6px, transparent 6px, transparent 18px),
                  repeating-linear-gradient(90deg, rgba(22, 101, 52, 0.5) 0px, rgba(22, 101, 52, 0.5) 6px, transparent 6px, transparent 18px)
                `,
              }}
            />
            {/* Blanket folded top trim */}
            <div className="absolute top-0 inset-x-0 h-3 bg-red-800 border-b border-amber-300/60" />
          </div>
        </div>
      </div>

      {/* 7. BABY FOAL (Center or Sitting in Sofa or Tucked in Bed) */}
      <div
        className={`absolute bottom-6 sm:bottom-8 transition-all duration-700 flex flex-col items-center ${
          isResting
            ? 'left-8 sm:left-14 md:left-20 translate-y-3'
            : isSleeping
            ? 'right-10 sm:right-16 md:right-24 translate-y-2'
            : 'left-1/2 -translate-x-1/2'
        }`}
      >
        {/* Interactive Floating Speech Bubble */}
        <div
          className={`mb-2 max-w-[260px] sm:max-w-[320px] px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 text-xs sm:text-sm font-bold shadow-xl border-2 transition-all duration-300 relative ${
            isSleeping
              ? 'border-indigo-300 animate-pulse'
              : stats.hunger >= 70 || stats.fatigue >= 75
              ? 'border-rose-400'
              : 'border-amber-400'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-amber-700 font-extrabold text-[11px] bg-amber-100 px-1.5 py-0.5 rounded-full shrink-0">
              {foalName}
            </span>
            <span className="leading-tight">{getSpeechBubble()}</span>
          </div>
          {/* Speech bubble tail pointer */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
        </div>

        {/* Foal Clickable / Pet Target */}
        <div className="relative group transition-transform">
          {is3DMode ? (
            <div className="w-56 h-48 sm:w-68 sm:h-56 md:w-80 md:h-64 relative flex items-center justify-center">
              <Foal3DViewer
                color={color}
                hat={hat}
                outfit={outfit}
                activity={activity}
                stats={stats}
                isPetting={isPetting}
                onPet={onPetFoal}
              />
              {/* Petting heart hover cue on 3D */}
              <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-rose-500/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow pointer-events-none flex items-center gap-1 z-20">
                <Heart className="w-3 h-3 fill-current" />
                <span>드래그 360° / 클릭 쓰다듬기</span>
              </div>
            </div>
          ) : (
            <div
              onClick={onPetFoal}
              className="cursor-pointer active:scale-95 transition-transform"
              title="아기 말을 직접 클릭해서 쓰다듬어 주세요! ❤️"
            >
              <FoalSvg
                color={color}
                hat={hat}
                outfit={outfit}
                activity={activity}
                stats={stats}
                isPetting={isPetting}
              />
              {/* Petting heart hover cue */}
              <div className="absolute -top-3 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-rose-500/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow pointer-events-none flex items-center gap-1">
                <Heart className="w-3 h-3 fill-current" />
                <span>쓰다듬기</span>
              </div>
            </div>
          )}

          {/* Sleeping Blanket Covering Effect (Tucked into bed!) */}
          {isSleeping && (
            <div className="absolute -bottom-2 -right-4 w-44 h-24 rounded-2xl overflow-hidden shadow-2xl border-2 border-red-900 pointer-events-none rotate-[-4deg]">
              <div
                className="w-full h-full"
                style={{
                  backgroundColor: '#b91c1c',
                  backgroundImage: `
                    repeating-linear-gradient(0deg, rgba(254, 240, 138, 0.4) 0px, rgba(254, 240, 138, 0.4) 2px, transparent 2px, transparent 18px),
                    repeating-linear-gradient(90deg, rgba(254, 240, 138, 0.4) 0px, rgba(254, 240, 138, 0.4) 2px, transparent 2px, transparent 18px),
                    repeating-linear-gradient(0deg, rgba(22, 101, 52, 0.5) 0px, rgba(22, 101, 52, 0.5) 6px, transparent 6px, transparent 18px),
                    repeating-linear-gradient(90deg, rgba(22, 101, 52, 0.5) 0px, rgba(22, 101, 52, 0.5) 6px, transparent 6px, transparent 18px)
                  `,
                }}
              />
              <div className="absolute top-0 inset-x-0 h-3 bg-red-800 border-b border-amber-300" />
            </div>
          )}

          {/* Zzz sleeping bubbles drifting up */}
          {isSleeping && (
            <div className="absolute -top-12 right-2 flex flex-col items-center pointer-events-none select-none">
              <span className="text-indigo-200 font-extrabold text-lg animate-bounce">Z</span>
              <span className="text-indigo-300 font-extrabold text-sm -mt-1 animate-pulse">z</span>
              <span className="text-indigo-400 font-extrabold text-xs -mt-1">z</span>
            </div>
          )}
        </div>

        {/* Wake Up Button when sleeping */}
        {isSleeping && (
          <button
            onClick={onWakeUp}
            className="mt-2 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-full shadow-lg border border-amber-200 cursor-pointer flex items-center gap-1 transition-transform active:scale-95"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>아기 말 깨우기</span>
          </button>
        )}
      </div>

      {/* 8. Night / Dimming Overlay during Sleep */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          isNight ? 'opacity-70 bg-indigo-950/80 backdrop-brightness-75' : !lanternLit ? 'opacity-40 bg-black/60' : 'opacity-0'
        }`}
      />

      {/* Warm Ambient Lantern Glow Circle when lantern is on */}
      {lanternLit && (
        <div
          className="absolute top-8 right-16 w-64 h-64 rounded-full pointer-events-none opacity-20 bg-amber-400 filter blur-3xl"
        />
      )}
    </div>
  );
};
