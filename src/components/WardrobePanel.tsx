import React, { useState } from 'react';
import { FoalColor, HatAccessory, OutfitAccessory, FoalCustomization } from '../types';
import { X, Sparkles, Check, Shirt, Crown, Palette } from 'lucide-react';
import { sounds } from '../utils/audio';

interface WardrobePanelProps {
  customization: FoalCustomization;
  onUpdateCustomization: (newCustomization: Partial<FoalCustomization>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const WardrobePanel: React.FC<WardrobePanelProps> = ({
  customization,
  onUpdateCustomization,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'color' | 'hat' | 'outfit'>('color');

  if (!isOpen) return null;

  // Coat options
  const coatOptions: { id: FoalColor; name: string; desc: string; colorCode: string; borderCode: string }[] = [
    { id: 'brown', name: '갈색 (밤색)', desc: '클래식하고 따뜻한 체스넛 털', colorCode: '#8D4925', borderCode: '#5A260F' },
    { id: 'white', name: '하얀색 (백마)', desc: '순백의 신비로운 펄 화이트', colorCode: '#F8FAFC', borderCode: '#CBD5E1' },
    { id: 'black', name: '까만색 (흑마)', desc: '카리스마 넘치는 미드나잇 블랙', colorCode: '#26262E', borderCode: '#111115' },
    { id: 'cream', name: '크림색 (노란빛)', desc: '화사하고 달콤한 팔로미노 크림', colorCode: '#FDE047', borderCode: '#CA8A04' },
    { id: 'spotted', name: '점박이 (핀토)', desc: '귀여운 얼룩무늬 반점이 콕콕!', colorCode: '#9A5028', borderCode: '#753917' },
  ];

  // Hat options
  const hatOptions: { id: HatAccessory; name: string; desc: string; emoji: string }[] = [
    { id: 'none', name: '벗기 (기본)', desc: '단정한 본래 모습', emoji: '❌' },
    { id: 'straw_hat', name: '밀짚모자', desc: '빨간 리본이 달린 아늑한 농부 모자', emoji: '👒' },
    { id: 'crown', name: '귀여운 왕관', desc: '보석이 콕 박힌 반짝이는 황금 왕관', emoji: '👑' },
    { id: 'flower', name: '꽃장식 (화관)', desc: '봄 향기가 가득한 알록달록 꽃 화관', emoji: '🌸' },
    { id: 'cowboy', name: '카우보이모자', desc: '황금 별 뱃지가 빛나는 멋진 가죽 모자', emoji: '🤠' },
  ];

  // Outfit options
  const outfitOptions: { id: OutfitAccessory; name: string; desc: string; emoji: string }[] = [
    { id: 'none', name: '벗기 (기본)', desc: '자연스러운 모습', emoji: '❌' },
    { id: 'red_scarf', name: '빨간 스카프', desc: '흰 도트무늬가 사랑스러운 반다나', emoji: '🧣' },
    { id: 'bell_necklace', name: '방울 목걸이', desc: '걸을 때마다 딸랑거리는 황금 방울', emoji: '🔔' },
    { id: 'blue_vest', name: '파란색 조끼', desc: '단추가 달린 포근한 니트 베스트', emoji: '🦺' },
    { id: 'rainbow_cape', name: '무지개 망토', desc: '바람에 살랑이는 마법의 오색 망토', emoji: '🌈' },
  ];

  const handleSelect = (update: Partial<FoalCustomization>) => {
    sounds.playEquip();
    onUpdateCustomization(update);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-amber-950 border-4 border-amber-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 border-b border-amber-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-pink-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-amber-100 flex items-center gap-2">
                <span>아기 말 옷장 & 꾸미기</span>
              </h2>
              <p className="text-xs text-amber-300/80">원하는 털 색과 악세사리를 자유롭게 입혀보세요!</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-amber-800/80 hover:bg-amber-700 text-amber-200 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-3 bg-amber-900/60 p-1.5 border-b border-amber-800/80 gap-1.5 text-xs font-bold">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('color');
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'color'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-200 hover:bg-amber-800/60'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>털 색깔</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('hat');
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'hat'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-200 hover:bg-amber-800/60'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>모자 / 머리</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('outfit');
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'outfit'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-200 hover:bg-amber-800/60'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>목 / 옷 입히기</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
          {/* Tab 1: Coat Color */}
          {activeTab === 'color' && (
            <div className="space-y-2">
              {coatOptions.map((opt) => {
                const isSelected = customization.color === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect({ color: opt.id })}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-800/90 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                        : 'bg-amber-900/40 border-amber-800/80 hover:bg-amber-900/70 hover:border-amber-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Color Preview Swatch */}
                      <div
                        className="w-10 h-10 rounded-2xl border-2 shadow-inner relative flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: opt.colorCode,
                          borderColor: opt.borderCode,
                        }}
                      >
                        {opt.id === 'spotted' && (
                          <div className="w-4 h-4 rounded-full bg-white/90 absolute top-1 right-1" />
                        )}
                        {isSelected && <Check className="w-5 h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-amber-100">{opt.name}</div>
                        <div className="text-xs text-amber-300/80">{opt.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-amber-950">
                        적용중
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 2: Hats */}
          {activeTab === 'hat' && (
            <div className="space-y-2">
              {hatOptions.map((opt) => {
                const isSelected = customization.hat === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect({ hat: opt.id })}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-800/90 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                        : 'bg-amber-900/40 border-amber-800/80 hover:bg-amber-900/70 hover:border-amber-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-900/90 border border-amber-700 flex items-center justify-center text-xl shrink-0">
                        {opt.emoji}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-amber-100">{opt.name}</div>
                        <div className="text-xs text-amber-300/80">{opt.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-amber-950">
                        착용중
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 3: Outfits */}
          {activeTab === 'outfit' && (
            <div className="space-y-2">
              {outfitOptions.map((opt) => {
                const isSelected = customization.outfit === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect({ outfit: opt.id })}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-800/90 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                        : 'bg-amber-900/40 border-amber-800/80 hover:bg-amber-900/70 hover:border-amber-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-900/90 border border-amber-700 flex items-center justify-center text-xl shrink-0">
                        {opt.emoji}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-amber-100">{opt.name}</div>
                        <div className="text-xs text-amber-300/80">{opt.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-amber-950">
                        착용중
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-900/80 border-t border-amber-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            꾸미기 완료
          </button>
        </div>
      </div>
    </div>
  );
};
