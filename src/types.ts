export type FoalColor = 'brown' | 'white' | 'black' | 'cream' | 'spotted';

export type HatAccessory = 'none' | 'straw_hat' | 'crown' | 'flower' | 'cowboy';

export type OutfitAccessory = 'none' | 'red_scarf' | 'bell_necklace' | 'blue_vest' | 'rainbow_cape';

export type FoodType = 'carrot' | 'apple' | 'sugar';

export type ToyType = 'ball' | 'balloon' | 'brush';

export type FoalActivity =
  | 'idle'
  | 'resting_sofa'
  | 'sleeping'
  | 'eating'
  | 'playing_ball'
  | 'playing_balloon'
  | 'brushing'
  | 'petting';

export interface FoalStats {
  hunger: number; // 0 to 100 (0 = 배부름, 100 = 극도로 배고픔)
  happiness: number; // 0 to 100 (100 = 최고로 행복)
  fatigue: number; // 0 to 100 (0 = 기운 넘침, 100 = 극도로 피곤)
}

export interface FoalCustomization {
  color: FoalColor;
  hat: HatAccessory;
  outfit: OutfitAccessory;
}

export interface FloatingParticle {
  id: string;
  x: number;
  y: number;
  emoji: string;
  scale?: number;
}
