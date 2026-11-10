import React from 'react';
import { FoalColor, HatAccessory, OutfitAccessory, FoalActivity, FoalStats } from '../types';

interface FoalSvgProps {
  color: FoalColor;
  hat: HatAccessory;
  outfit: OutfitAccessory;
  activity: FoalActivity;
  stats: FoalStats;
  isPetting?: boolean;
}

export const FoalSvg: React.FC<FoalSvgProps> = ({
  color,
  hat,
  outfit,
  activity,
  stats,
  isPetting = false,
}) => {
  // Rich Artistic Color Palettes
  const palettes = {
    brown: {
      bodyMain: '#964B28',
      bodyDark: '#6E3215',
      bodyLight: '#B7663D',
      belly: '#C88358',
      maneMain: '#3E1C0A',
      maneDark: '#260F04',
      maneLight: '#5E2C12',
      muzzle: '#EBB48F',
      muzzleShade: '#D2946A',
      nostril: '#5C220E',
      hoof: '#382012',
      hoofLight: '#543622',
      innerEar: '#F8B4B4',
      fetlock: '#EBB48F',
      eyeIris: '#4E260E',
      eyePupil: '#1A0B04',
      blush: 'rgba(244, 63, 94, 0.4)',
    },
    white: {
      bodyMain: '#F8FAFC',
      bodyDark: '#CBD5E1',
      bodyLight: '#FFFFFF',
      belly: '#FFFFFF',
      maneMain: '#E2E8F0',
      maneDark: '#94A3B8',
      maneLight: '#F8FAFC',
      muzzle: '#FCE7F3',
      muzzleShade: '#F472B6',
      nostril: '#94A3B8',
      hoof: '#64748B',
      hoofLight: '#94A3B8',
      innerEar: '#FBCFE8',
      fetlock: '#FFFFFF',
      eyeIris: '#0284C7',
      eyePupil: '#082F49',
      blush: 'rgba(244, 114, 182, 0.45)',
    },
    black: {
      bodyMain: '#26262E',
      bodyDark: '#121217',
      bodyLight: '#3F3F4C',
      belly: '#32323D',
      maneMain: '#141418',
      maneDark: '#09090C',
      maneLight: '#2C2C36',
      muzzle: '#525263',
      muzzleShade: '#383845',
      nostril: '#111116',
      hoof: '#09090B',
      hoofLight: '#27272A',
      innerEar: '#71717A',
      fetlock: '#3F3F4C',
      eyeIris: '#3B82F6',
      eyePupil: '#0F172A',
      blush: 'rgba(251, 113, 133, 0.35)',
    },
    cream: {
      bodyMain: '#FDE047',
      bodyDark: '#CA8A04',
      bodyLight: '#FEF08A',
      belly: '#FEF9C3',
      maneMain: '#FEF9C3',
      maneDark: '#FDE047',
      maneLight: '#FFFFFF',
      muzzle: '#FFEDD5',
      muzzleShade: '#FDBA74',
      nostril: '#A16207',
      hoof: '#854D0E',
      hoofLight: '#A16207',
      innerEar: '#FED7AA',
      fetlock: '#FEF9C3',
      eyeIris: '#854D0E',
      eyePupil: '#451A03',
      blush: 'rgba(251, 146, 60, 0.4)',
    },
    spotted: {
      bodyMain: '#964B28',
      bodyDark: '#6E3215',
      bodyLight: '#B7663D',
      belly: '#C88358',
      maneMain: '#3E1C0A',
      maneDark: '#260F04',
      maneLight: '#5E2C12',
      muzzle: '#FCE7F3',
      muzzleShade: '#F472B6',
      nostril: '#5C220E',
      hoof: '#382012',
      hoofLight: '#543622',
      innerEar: '#F8B4B4',
      fetlock: '#FFFFFF',
      eyeIris: '#4E260E',
      eyePupil: '#1A0B04',
      blush: 'rgba(244, 63, 94, 0.4)',
    },
  };

  const c = palettes[color];

  const isSleeping = activity === 'sleeping';
  const isResting = activity === 'resting_sofa';
  const isEating = activity === 'eating';
  const isPlaying = activity === 'playing_ball' || activity === 'playing_balloon';
  const isBrushing = activity === 'brushing';

  // Emotional states
  const isVeryHungry = stats.hunger >= 65;
  const isVeryTired = stats.fatigue >= 70;
  const isVeryHappy =
    isPetting || isBrushing || isPlaying || (stats.happiness >= 75 && !isVeryHungry && !isVeryTired);

  return (
    <div className="relative flex items-center justify-center select-none pointer-events-none drop-shadow-xl">
      <svg
        viewBox="0 0 380 340"
        className={`w-60 h-52 sm:w-72 sm:h-64 md:w-84 md:h-72 transition-transform duration-500 ${
          isSleeping
            ? 'rotate-6 translate-y-4 scale-95'
            : isResting
            ? 'scale-95 translate-y-1'
            : isPlaying
            ? 'animate-bounce'
            : isEating
            ? 'scale-102'
            : ''
        }`}
      >
        <defs>
          {/* Soft Drop Shadow Filter */}
          <filter id="foalShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1e1008" floodOpacity="0.25" />
          </filter>

          {/* Gradients for rich 3D shading */}
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.bodyLight} />
            <stop offset="60%" stopColor={c.bodyMain} />
            <stop offset="100%" stopColor={c.bodyDark} />
          </linearGradient>

          <linearGradient id="maneGrad" x1="0%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={c.maneLight} />
            <stop offset="50%" stopColor={c.maneMain} />
            <stop offset="100%" stopColor={c.maneDark} />
          </linearGradient>

          <linearGradient id="muzzleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="30%" stopColor={c.muzzle} />
            <stop offset="100%" stopColor={c.muzzleShade} />
          </linearGradient>

          <linearGradient id="hoofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.hoofLight} />
            <stop offset="100%" stopColor={c.hoof} />
          </linearGradient>

          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="75%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        {/* 1. Ground Contact Shadow */}
        {!isSleeping && (
          <ellipse
            cx="180"
            cy="312"
            rx={isResting ? '85' : '95'}
            ry="18"
            fill="rgba(24, 12, 4, 0.28)"
            className="transition-all duration-300"
          />
        )}

        {/* 2. Fluffy Waving Tail (Behind Body) */}
        <g
          id="fluffy-tail"
          className="origin-[95px_200px]"
          style={{
            animation:
              isPlaying || isPetting || isVeryHappy
                ? 'foalTailWag 0.35s ease-in-out infinite alternate'
                : 'foalTailWag 1.8s ease-in-out infinite alternate',
          }}
        >
          {/* Main tail volume with layered luscious hair curls */}
          <path
            d="M95 195 C60 185 30 215 35 255 C38 275 55 295 75 285 C95 275 80 245 75 230 C88 235 95 220 95 195 Z"
            fill="url(#maneGrad)"
            filter="url(#foalShadow)"
          />
          {/* Secondary fluffy tail feather lock */}
          <path
            d="M90 200 C68 200 48 230 52 265 C55 280 68 275 75 260 C85 240 92 225 90 200 Z"
            fill={c.maneLight}
            opacity="0.8"
          />
          {/* Tail shine strand */}
          <path
            d="M82 205 C65 215 56 238 60 258"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
          />
        </g>

        {/* 3. Back Legs (Standing or Tucked) */}
        {!isSleeping && !isResting && (
          <g id="back-legs">
            {/* Back Right Leg */}
            <path
              d="M125 210 L112 280 Q108 290 102 296 L104 310 L126 310 L132 295 L145 220 Z"
              fill={c.bodyDark}
            />
            {/* Fetlock tuft (발목 깃털 털) */}
            <path
              d="M102 292 Q94 298 98 304 Q106 304 108 296 Z"
              fill={c.fetlock}
              opacity="0.9"
            />
            {/* Back Right Hoof */}
            <path
              d="M104 298 L104 310 L126 310 L128 298 Q116 295 104 298 Z"
              fill="url(#hoofGrad)"
            />
            <path d="M106 301 L106 307" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

            {/* Front Right Leg */}
            <path
              d="M225 210 L216 280 Q212 290 208 296 L210 310 L232 310 L238 295 L250 220 Z"
              fill={c.bodyDark}
            />
            <path
              d="M208 292 Q200 298 204 304 Q212 304 214 296 Z"
              fill={c.fetlock}
              opacity="0.9"
            />
            <path
              d="M210 298 L210 310 L232 310 L234 298 Q222 295 210 298 Z"
              fill="url(#hoofGrad)"
            />
            <path d="M212 301 L212 307" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          </g>
        )}

        {/* 4. Chubby Body (Torso & Fluffy Belly) */}
        <g id="torso" filter="url(#foalShadow)">
          {/* Main rounded muscular baby torso */}
          <path
            d="M110 170 C90 190 92 230 120 255 C160 275 225 265 255 225 C265 195 240 160 200 155 C165 152 130 155 110 170 Z"
            fill="url(#bodyGrad)"
          />

          {/* Soft Cream Belly Contour */}
          <path
            d="M130 220 C155 260 215 258 240 225 C220 240 170 242 130 220 Z"
            fill={c.belly}
            opacity="0.8"
          />

          {/* Pinto Spotted Markings (Natural organic patches) */}
          {color === 'spotted' && (
            <g fill="#FFFFFF" opacity="0.95">
              {/* Flank spot */}
              <path d="M125 180 C110 195 120 220 140 225 C155 210 145 180 125 180 Z" />
              {/* Back patch */}
              <path d="M180 160 C165 175 185 200 205 195 C220 180 205 160 180 160 Z" />
              {/* Rump patch */}
              <path d="M100 205 C95 220 110 235 120 225 C115 210 105 205 100 205 Z" />
            </g>
          )}

          {/* Rainbow Cape Back Layer */}
          {outfit === 'rainbow_cape' && (
            <path
              d="M210 150 C175 160 120 175 75 225 C70 205 125 160 200 145 Z"
              fill="url(#rainbowGrad)"
              className="origin-[200px_150px] animate-pulse"
            />
          )}

          {/* Blue Vest */}
          {outfit === 'blue_vest' && (
            <g id="vest">
              <path
                d="M160 162 C190 155 228 165 245 190 C235 240 165 242 150 205 Z"
                fill="#2563EB"
                stroke="#1D4ED8"
                strokeWidth="2.5"
              />
              {/* Knitted collar trim */}
              <path d="M165 175 Q195 195 235 180" stroke="#93C5FD" strokeWidth="3" fill="none" />
              {/* Shiny Gold Buttons */}
              <circle cx="198" cy="186" r="4" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1" />
              <circle cx="195" cy="204" r="4" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1" />
              <circle cx="190" cy="222" r="4" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1" />
            </g>
          )}
        </g>

        {/* 5. Resting Pose: Folded Tucked Hooves */}
        {isResting && (
          <g id="resting-hooves">
            <ellipse cx="140" cy="265" rx="36" ry="18" fill="url(#bodyGrad)" />
            <path d="M150 268 Q165 260 170 276 Q155 278 150 268 Z" fill="url(#hoofGrad)" />
            <ellipse cx="215" cy="265" rx="34" ry="17" fill="url(#bodyGrad)" />
            <path d="M225 268 Q240 260 245 276 Q230 278 225 268 Z" fill="url(#hoofGrad)" />
          </g>
        )}

        {/* 6. Front Standing Legs with Fetlock Tufts & Polished Hooves */}
        {!isSleeping && !isResting && (
          <g id="front-legs">
            {/* Front Left Leg */}
            <path
              d="M150 215 L146 280 Q142 290 134 296 L136 312 L160 312 L164 295 L172 220 Z"
              fill="url(#bodyGrad)"
            />
            <path
              d="M134 292 Q125 298 128 305 Q138 305 140 296 Z"
              fill={c.fetlock}
            />
            <path
              d="M136 298 L136 312 L160 312 L162 298 Q148 295 136 298 Z"
              fill="url(#hoofGrad)"
            />
            <path d="M139 301 L139 308" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />

            {/* Front Right (Fore) Leg */}
            <path
              d="M210 215 L208 280 Q204 290 196 296 L198 312 L222 312 L226 295 L232 220 Z"
              fill="url(#bodyGrad)"
            />
            <path
              d="M196 292 Q187 298 190 305 Q200 305 202 296 Z"
              fill={c.fetlock}
            />
            <path
              d="M198 298 L198 312 L222 312 L224 298 Q210 295 198 298 Z"
              fill="url(#hoofGrad)"
            />
            <path d="M201 301 L201 308" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          </g>
        )}

        {/* 7. Arched Neck */}
        <g id="neck">
          <path
            d="M200 185 C215 140 240 120 270 125 C285 155 255 195 240 210 Z"
            fill="url(#bodyGrad)"
          />
          {color === 'spotted' && (
            <path d="M220 155 Q245 145 250 170 Q230 185 220 155 Z" fill="#FFFFFF" opacity="0.95" />
          )}
        </g>

        {/* 8. Flowing Layered Mane (갈기) */}
        <g id="mane">
          {/* Main voluminous wavy locks cascading down the back of neck */}
          <path
            d="M215 175 C195 155 205 130 212 110 C225 112 235 100 242 85 C255 95 260 115 265 125 C250 135 252 155 242 175 C230 195 220 185 215 175 Z"
            fill="url(#maneGrad)"
            filter="url(#foalShadow)"
          />
          {/* Hair Lock 1 */}
          <path
            d="M210 160 C195 145 210 135 220 125 C215 140 220 150 210 160 Z"
            fill={c.maneLight}
            opacity="0.8"
          />
          {/* Hair Lock 2 */}
          <path
            d="M228 135 C218 120 230 108 240 98 C238 115 242 125 228 135 Z"
            fill={c.maneLight}
            opacity="0.85"
          />
          {/* Shimmer strand */}
          <path
            d="M232 105 Q242 125 235 150"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
          />
        </g>

        {/* 9. HEAD & FACIAL EXPRESSIONS */}
        <g id="head" className="origin-[275px_120px]">
          {/* Head Chubby Cheek Base */}
          <path
            d="M235 110 C225 75 265 55 305 70 C335 85 345 130 325 155 C300 180 255 175 238 150 C230 135 232 120 235 110 Z"
            fill="url(#bodyGrad)"
            filter="url(#foalShadow)"
          />

          {/* Pinto Face Blaze */}
          {color === 'spotted' && (
            <path
              d="M275 68 C285 85 292 100 300 120 C290 128 275 118 272 95 Z"
              fill="#FFFFFF"
              opacity="0.95"
            />
          )}

          {/* Soft Velvet Muzzle (주둥이) */}
          <path
            d="M295 125 C320 120 345 132 342 152 C338 168 312 174 290 165 C282 152 285 135 295 125 Z"
            fill="url(#muzzleGrad)"
          />

          {/* Cute Nostrils */}
          <ellipse cx="328" cy="145" rx="3.5" ry="4.5" fill={c.nostril} />
          <ellipse cx="338" cy="152" rx="3" ry="4.2" fill={c.nostril} />

          {/* Cute Mouth (Smiling / Eating / Whinny) */}
          {isEating ? (
            <path
              d="M312 158 Q324 168 334 158"
              stroke={c.nostril}
              strokeWidth="3.5"
              fill="#F472B6"
              className="animate-pulse"
            />
          ) : isVeryHungry && !isVeryHappy ? (
            <path
              d="M314 162 Q324 154 334 160"
              stroke={c.nostril}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M312 156 Q322 165 332 157"
              stroke={c.nostril}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Rosy Soft Cheek Blush */}
          <ellipse cx="276" cy="150" rx="14" ry="10" fill={c.blush} />

          {/* 10. Cute Fluffy Ears with Inner Velvet Fur */}
          {/* Back Ear */}
          <g id="back-ear">
            <path
              d="M246 80 C235 40 252 42 268 48 C278 60 270 85 260 92 Z"
              fill={c.bodyDark}
            />
            <path
              d="M250 72 C244 52 255 52 264 56 C268 65 264 78 258 84 Z"
              fill={c.innerEar}
              opacity="0.85"
            />
          </g>

          {/* Front Ear (Interactive twitch) */}
          <g
            id="front-ear"
            className="origin-[272px_75px] hover:rotate-6 transition-transform"
          >
            <path
              d="M266 75 C258 35 280 36 296 46 C306 60 296 85 284 94 Z"
              fill="url(#bodyGrad)"
            />
            {/* Inner ear velvet */}
            <path
              d="M272 68 C266 48 280 46 290 53 C296 64 290 78 282 86 Z"
              fill={c.innerEar}
            />
            {/* Fluffy inner hair tuft (귀 안쪽 보송보송 털) */}
            <path
              d="M270 78 Q278 70 285 76 Q280 82 274 84 Z"
              fill="#FFFFFF"
              opacity="0.8"
            />
          </g>

          {/* Forelock (이마 앞머리 뱅) */}
          <g id="forelock">
            <path
              d="M268 76 C285 68 305 78 312 92 C298 94 285 88 276 84 Z"
              fill="url(#maneGrad)"
            />
            <path
              d="M278 74 C292 68 308 76 312 86 C302 86 290 82 282 80 Z"
              fill={c.maneLight}
              opacity="0.7"
            />
          </g>

          {/* 11. EXPRESSIVE EYES */}
          {isSleeping ? (
            // Peaceful Sleeping Eyelashes
            <g transform="translate(278, 118)">
              <path
                d="M-3 0 Q10 12 24 0"
                stroke="#1E293B"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path d="M2 5 L0 9" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M10 7 L10 12" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M18 5 L20 9" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : isVeryHappy ? (
            // Joyful Smiling Squint Eyes (^^)
            <g transform="translate(280, 114)">
              <path
                d="M-2 6 Q11 -6 24 6"
                stroke="#1E293B"
                strokeWidth="4.5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Floating sweet heart sparkles in eye */}
              <text x="6" y="2" fontSize="13" fill="#EF4444" fontWeight="bold">♥</text>
            </g>
          ) : isVeryTired ? (
            // Sleepy Half-Drooping Eyelids
            <g transform="translate(282, 110)">
              {/* White */}
              <ellipse cx="12" cy="12" rx="12" ry="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
              {/* Pupil */}
              <ellipse cx="12" cy="12" rx="10" ry="10" fill={c.eyeIris} />
              <circle cx="9" cy="9" r="3.5" fill="#FFFFFF" />
              {/* Drooping eyelid */}
              <path d="M-1 8 Q12 18 25 8 L25 0 L-1 0 Z" fill={c.bodyMain} />
              <path d="M-1 8 Q12 18 25 8" stroke="#1E293B" strokeWidth="2.5" fill="none" />
            </g>
          ) : isVeryHungry ? (
            // Huge Watery Pleading Puppy Eyes
            <g transform="translate(280, 108)">
              <ellipse cx="13" cy="13" rx="14" ry="14" fill="#0F172A" />
              <ellipse cx="13" cy="13" rx="12" ry="12" fill={c.eyeIris} />
              {/* Huge glossy catchlights */}
              <circle cx="8" cy="8" r="5.5" fill="#FFFFFF" />
              <circle cx="17" cy="17" r="3" fill="#FFFFFF" />
              <circle cx="18" cy="8" r="2" fill="#93C5FD" opacity="0.8" />
              {/* Little tear drop */}
              <ellipse cx="11" cy="24" rx="2.5" ry="3.5" fill="#60A5FA" opacity="0.85" className="animate-pulse" />
            </g>
          ) : (
            // Gorgeous Bright Anime Chibi Eyes
            <g transform="translate(282, 108)">
              {/* Eyeliner contour */}
              <path d="M-2 4 Q12 -6 26 4" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Outer sclera */}
              <ellipse cx="12" cy="13" rx="13" ry="13" fill="#FFFFFF" />
              {/* Gradient Iris */}
              <ellipse cx="12" cy="13" rx="11" ry="11" fill={c.eyeIris} />
              <ellipse cx="12" cy="13" rx="8" ry="8" fill={c.eyePupil} />
              {/* Iris bottom glow */}
              <path d="M4 16 Q12 23 20 16 Q12 19 4 16 Z" fill="#60A5FA" opacity="0.6" />
              {/* Big Star Catchlight */}
              <circle cx="8" cy="8" r="4.5" fill="#FFFFFF" />
              {/* Secondary Catchlight */}
              <circle cx="17" cy="16" r="2.2" fill="#FFFFFF" />
              {/* Minor Sparkle */}
              <circle cx="17" cy="9" r="1.5" fill="#FFFFFF" opacity="0.8" />
            </g>
          )}

          {/* 12. OUTFIT: Neck Accessories */}
          {outfit === 'red_scarf' && (
            <g id="scarf" transform="translate(230, 155)">
              {/* Knotted Scarf Drape */}
              <path
                d="M10 0 Q35 22 55 12 Q42 55 24 60 Q12 32 10 0 Z"
                fill="#DC2626"
                stroke="#991B1B"
                strokeWidth="2"
              />
              {/* Scarf Polka Dots */}
              <circle cx="28" cy="22" r="2.8" fill="#FFFFFF" />
              <circle cx="40" cy="25" r="2.5" fill="#FFFFFF" />
              <circle cx="28" cy="42" r="2.5" fill="#FFFFFF" />
              {/* Knot Bow */}
              <ellipse cx="18" cy="8" rx="8" ry="7" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
              <path d="M14 12 L8 24 L14 26 Z" fill="#EF4444" />
            </g>
          )}

          {outfit === 'bell_necklace' && (
            <g id="bell" transform="translate(234, 160)">
              {/* Leather Collar Band */}
              <path
                d="M5 2 Q28 18 48 10"
                stroke="#78350F"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M6 3 Q28 17 46 11"
                stroke="#D97706"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Golden Bell with Shine */}
              <circle cx="28" cy="18" r="9" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2" />
              <circle cx="28" cy="18" r="2.5" fill="#713F12" />
              <line x1="28" y1="18" x2="28" y2="26" stroke="#713F12" strokeWidth="2" strokeLinecap="round" />
              {/* Highlight */}
              <circle cx="25" cy="14" r="2" fill="#FFFFFF" opacity="0.8" />
            </g>
          )}

          {/* 13. HAT ACCESSORIES */}
          {hat === 'straw_hat' && (
            <g id="straw-hat" transform="translate(238, 20)">
              {/* Wide curling straw brim with crosshatch pattern */}
              <ellipse cx="36" cy="46" rx="48" ry="16" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
              {/* Hat Crown */}
              <path
                d="M14 42 C14 20 58 20 58 42 Z"
                fill="#FACC15"
                stroke="#CA8A04"
                strokeWidth="2"
              />
              {/* Red Ribbon Band */}
              <path
                d="M14 38 Q36 44 58 38 L58 43 Q36 49 14 43 Z"
                fill="#EF4444"
              />
              {/* Dangling Ribbon Tails */}
              <path d="M12 40 L-2 56 L6 58 L16 44 Z" fill="#EF4444" />
              {/* Little Daisy on hat */}
              <circle cx="20" cy="40" r="5" fill="#FFFFFF" />
              <circle cx="20" cy="40" r="2" fill="#F59E0B" />
            </g>
          )}

          {hat === 'crown' && (
            <g id="crown" transform="translate(254, 25)">
              {/* Royal Gold Crown with Fleur-de-lis points */}
              <path
                d="M0 32 L6 10 L18 24 L30 6 L42 24 L54 10 L60 32 Z"
                fill="url(#goldGrad)"
                stroke="#B45309"
                strokeWidth="2"
              />
              <rect x="0" y="30" width="60" height="7" rx="3" fill="#EAB308" stroke="#B45309" strokeWidth="1.5" />
              {/* Sparkling Gemstones */}
              <circle cx="6" cy="10" r="3.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
              <circle cx="30" cy="6" r="4.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
              <circle cx="54" cy="10" r="3.5" fill="#10B981" stroke="#047857" strokeWidth="1" />
              <circle cx="30" cy="33" r="2.5" fill="#EF4444" />
              {/* White glints */}
              <circle cx="29" cy="4" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {hat === 'flower' && (
            <g id="flower-wreath" transform="translate(244, 40)">
              {/* Green Vine */}
              <path d="M-2 22 Q28 6 60 18" stroke="#16A34A" strokeWidth="4" fill="none" strokeLinecap="round" />
              {/* Blooming Cherry Blossom 1 */}
              <circle cx="8" cy="18" r="8" fill="#F472B6" />
              <circle cx="8" cy="18" r="3" fill="#FDE047" />
              {/* Sunflower 2 */}
              <circle cx="28" cy="12" r="9" fill="#FACC15" />
              <circle cx="28" cy="12" r="4" fill="#B45309" />
              {/* Bluebell 3 */}
              <circle cx="48" cy="16" r="8" fill="#60A5FA" />
              <circle cx="48" cy="16" r="3" fill="#FEF08A" />
              {/* Little Leaf */}
              <path d="M18 10 Q24 4 30 10 Z" fill="#22C55E" />
            </g>
          )}

          {hat === 'cowboy' && (
            <g id="cowboy-hat" transform="translate(232, 12)">
              {/* Curled Rancher Brim */}
              <path
                d="M-8 48 C18 36 68 36 94 48 C82 62 4 62 -8 48 Z"
                fill="#78350F"
                stroke="#451A03"
                strokeWidth="2"
              />
              {/* Creased Crown */}
              <path
                d="M16 44 C16 16 34 20 44 12 C54 20 72 16 72 44 Z"
                fill="#92400E"
                stroke="#451A03"
                strokeWidth="2"
              />
              {/* Leather Band with Golden Sheriff Star */}
              <path d="M16 40 Q44 46 72 40 L72 44 Q44 50 16 44 Z" fill="#B45309" />
              <polygon
                points="44,36 46,41 51,41 47,44 49,49 44,46 39,49 41,44 37,41 42,41"
                fill="url(#goldGrad)"
                stroke="#78350F"
                strokeWidth="0.8"
              />
            </g>
          )}
        </g>
      </svg>

      <style>{`
        @keyframes foalTailWag {
          0% {
            transform: rotate(-10deg);
          }
          100% {
            transform: rotate(20deg);
          }
        }
      `}</style>
    </div>
  );
};
