import React, { useState } from 'react';
import { FoalActivity, FoodType, ToyType } from '../types';
import { Heart, Utensils, Gamepad2, Coffee, Moon, Sun, ChevronUp } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ActionToolbarProps {
  activity: FoalActivity;
  onPet: () => void;
  onFeed: (food: FoodType) => void;
  onPlayToy: (toy: ToyType) => void;
  onRestSofa: () => void;
  onSleep: () => void;
  onWakeUp: () => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  activity,
  onPet,
  onFeed,
  onPlayToy,
  onRestSofa,
  onSleep,
  onWakeUp,
}) => {
  const [foodMenuOpen, setFoodMenuOpen] = useState(false);
  const [toyMenuOpen, setToyMenuOpen] = useState(false);

  const isSleeping = activity === 'sleeping';
  const isResting = activity === 'resting_sofa';

  const handleSelectFood = (food: FoodType) => {
    setFoodMenuOpen(false);
    onFeed(food);
  };

  const handleSelectToy = (toy: ToyType) => {
    setToyMenuOpen(false);
    onPlayToy(toy);
  };

  return (
    <div className="relative w-full">
      {/* 1. Food Submenu Popover */}
      {foodMenuOpen && !isSleeping && (
        <div className="absolute bottom-full mb-3 left-1/4 sm:left-1/3 -translate-x-1/2 bg-amber-950/95 backdrop-blur-md border-2 border-amber-600 rounded-2xl p-2.5 shadow-2xl z-30 flex flex-col gap-1.5 w-60 sm:w-64 animate-fade-in">
          <div className="text-[11px] font-bold text-amber-300 px-2 py-0.5 border-b border-amber-800 flex items-center justify-between">
            <span>맛있는 먹이 고르기</span>
            <span className="text-[10px] text-amber-400/80">배고픔 해결</span>
          </div>

          {/* Carrot */}
          <button
            onClick={() => handleSelectFood('carrot')}
            className="flex items-center justify-between p-2 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-100 transition-colors cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">🥕</span>
              <div>
                <div className="text-xs font-bold">아삭한 당근</div>
                <div className="text-[10px] text-amber-300/80">말들이 가장 좋아하는 간식!</div>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
              배고픔 -30
            </span>
          </button>

          {/* Apple */}
          <button
            onClick={() => handleSelectFood('apple')}
            className="flex items-center justify-between p-2 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-100 transition-colors cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">🍎</span>
              <div>
                <div className="text-xs font-bold">달콤한 사과</div>
                <div className="text-[10px] text-amber-300/80">과즙이 팡팡 터져요</div>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
              배고픔 -25
            </span>
          </button>

          {/* Sugar Cube */}
          <button
            onClick={() => handleSelectFood('sugar')}
            className="flex items-center justify-between p-2 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-100 transition-colors cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">🧊</span>
              <div>
                <div className="text-xs font-bold">달콤한 각설탕</div>
                <div className="text-[10px] text-amber-300/80">기분이 번쩍 좋아져요</div>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-pink-400 bg-pink-950/60 px-1.5 py-0.5 rounded">
              행복도 +15
            </span>
          </button>
        </div>
      )}

      {/* 2. Toy Submenu Popover */}
      {toyMenuOpen && !isSleeping && (
        <div className="absolute bottom-full mb-3 left-1/2 sm:left-1/2 -translate-x-1/2 bg-amber-950/95 backdrop-blur-md border-2 border-amber-600 rounded-2xl p-2.5 shadow-2xl z-30 flex flex-col gap-1.5 w-60 sm:w-64 animate-fade-in">
          <div className="text-[11px] font-bold text-amber-300 px-2 py-0.5 border-b border-amber-800 flex items-center justify-between">
            <span>놀아줄 장난감 고르기</span>
            <span className="text-[10px] text-pink-400/80">행복도 상승!</span>
          </div>

          {/* Bouncy Ball */}
          <button
            onClick={() => handleSelectToy('ball')}
            className="flex items-center justify-between p-2 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-100 transition-colors cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">⚽</span>
              <div>
                <div className="text-xs font-bold">탱탱볼 (공놀이)</div>
                <div className="text-[10px] text-amber-300/80">통통 튀는 공 따라 폴짝!</div>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-pink-400 bg-pink-950/60 px-1.5 py-0.5 rounded">
              행복도 +25
            </span>
          </button>

          {/* Red Balloon */}
          <button
            onClick={() => handleSelectToy('balloon')}
            className="flex items-center justify-between p-2 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-100 transition-colors cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">🎈</span>
              <div>
                <div className="text-xs font-bold">빨간 풍선</div>
                <div className="text-[10px] text-amber-300/80">코로 툭툭 치며 놀아요</div>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-pink-400 bg-pink-950/60 px-1.5 py-0.5 rounded">
              행복도 +20
            </span>
          </button>

          {/* Grooming Brush */}
          <button
            onClick={() => handleSelectToy('brush')}
            className="flex items-center justify-between p-2 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-100 transition-colors cursor-pointer text-left group"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">🪮</span>
              <div>
                <div className="text-xs font-bold">브러시 (빗질해주기)</div>
                <div className="text-[10px] text-amber-300/80">갈기와 털을 부드럽게 쓰담</div>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-pink-400 bg-pink-950/60 px-1.5 py-0.5 rounded">
              행복도 +22
            </span>
          </button>
        </div>
      )}

      {/* Main Bottom Toolbar Dock */}
      <div className="w-full bg-gradient-to-t from-amber-950 via-amber-900 to-amber-950 p-2 sm:p-3 rounded-2xl border-2 border-amber-700/80 shadow-2xl flex flex-wrap items-center justify-center sm:justify-between gap-2">
        {/* Button 1: 쓰다듬기 */}
        <button
          onClick={() => {
            setFoodMenuOpen(false);
            setToyMenuOpen(false);
            onPet();
          }}
          disabled={isSleeping}
          className={`flex-1 min-w-[90px] py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
            isSleeping
              ? 'bg-amber-950/40 text-amber-600/40 cursor-not-allowed'
              : 'bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white border border-rose-300/40'
          }`}
          title="아기 말을 쓰다듬어 주면 행복도가 올라가요!"
        >
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 fill-current text-rose-200" />
            <span className="text-sm">❤️</span>
          </div>
          <span>쓰다듬기</span>
        </button>

        {/* Button 2: 먹이 주기 */}
        <button
          onClick={() => {
            sounds.playClick();
            setToyMenuOpen(false);
            setFoodMenuOpen((prev) => !prev);
          }}
          disabled={isSleeping}
          className={`flex-1 min-w-[90px] py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer relative ${
            isSleeping
              ? 'bg-amber-950/40 text-amber-600/40 cursor-not-allowed'
              : foodMenuOpen
              ? 'bg-amber-600 text-white ring-2 ring-amber-300'
              : 'bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white border border-amber-400/40'
          }`}
          title="당근, 사과, 각설탕을 먹여요"
        >
          <div className="flex items-center gap-1">
            <Utensils className="w-4 h-4 text-amber-200" />
            <span className="text-sm">🥕</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span>먹이 주기</span>
            <ChevronUp className={`w-3 h-3 transition-transform ${foodMenuOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Button 3: 장난감으로 놀기 */}
        <button
          onClick={() => {
            sounds.playClick();
            setFoodMenuOpen(false);
            setToyMenuOpen((prev) => !prev);
          }}
          disabled={isSleeping}
          className={`flex-1 min-w-[90px] py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer relative ${
            isSleeping
              ? 'bg-amber-950/40 text-amber-600/40 cursor-not-allowed'
              : toyMenuOpen
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
              : 'bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white border border-emerald-400/40'
          }`}
          title="탱탱볼, 풍선, 브러시로 놀아줘요"
        >
          <div className="flex items-center gap-1">
            <Gamepad2 className="w-4 h-4 text-emerald-200" />
            <span className="text-sm">⚽</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span>장난감 놀기</span>
            <ChevronUp className={`w-3 h-3 transition-transform ${toyMenuOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Button 4: 소파에서 쉬기 */}
        <button
          onClick={() => {
            sounds.playClick();
            setFoodMenuOpen(false);
            setToyMenuOpen(false);
            if (isResting) {
              onWakeUp();
            } else {
              onRestSofa();
            }
          }}
          disabled={isSleeping}
          className={`flex-1 min-w-[90px] py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
            isSleeping
              ? 'bg-amber-950/40 text-amber-600/40 cursor-not-allowed'
              : isResting
              ? 'bg-amber-500 text-amber-950 ring-2 ring-amber-300 font-extrabold'
              : 'bg-gradient-to-b from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700 text-white border border-orange-400/40'
          }`}
          title="푹신한 빈백 소파에서 편안하게 휴식해요"
        >
          <div className="flex items-center gap-1">
            <Coffee className="w-4 h-4 text-orange-200" />
            <span className="text-sm">🛋️</span>
          </div>
          <span>{isResting ? '소파에서 일어나기' : '소파에서 쉬기'}</span>
        </button>

        {/* Button 5: 이불 덮고 코 자기 */}
        <button
          onClick={() => {
            sounds.playClick();
            setFoodMenuOpen(false);
            setToyMenuOpen(false);
            if (isSleeping) {
              onWakeUp();
            } else {
              onSleep();
            }
          }}
          className={`flex-1 min-w-[90px] py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
            isSleeping
              ? 'bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-extrabold ring-2 ring-amber-200 animate-pulse'
              : 'bg-gradient-to-b from-indigo-700 to-indigo-900 hover:from-indigo-600 hover:to-indigo-800 text-white border border-indigo-400/40'
          }`}
          title="마구간 조명을 끄고 따뜻한 체크무늬 담요를 덮고 잠을 자요"
        >
          <div className="flex items-center gap-1">
            {isSleeping ? (
              <Sun className="w-4 h-4 text-amber-950" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-200" />
            )}
            <span className="text-sm">{isSleeping ? '☀️' : '🌙'}</span>
          </div>
          <span>{isSleeping ? '일어나기 (기상)' : '이불 덮고 자기'}</span>
        </button>
      </div>
    </div>
  );
};
