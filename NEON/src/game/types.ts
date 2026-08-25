export type WeaponId = "basic" | "multi" | "laser" | "fire";

export interface Weapon {
  id: WeaponId;
  name: string;
  color: string;
  glow: string;
  /** milliseconds between shots at level 1 */
  cooldown: number;
  damage: number;
}

/** Máximo nivel de un arma: al llegar aquí ese bonus deja de caer. */
export const MAX_WEAPON_LEVEL = 3;

export const WEAPONS: Record<WeaponId, Weapon> = {
  basic: {
    id: "basic",
    name: "BÁSICO",
    color: "#22e6ff",
    glow: "#7ff5ff",
    cooldown: 220,
    damage: 1,
  },
  multi: {
    id: "multi",
    name: "MULTI x5",
    color: "#ffe000",
    glow: "#fff59b",
    cooldown: 260,
    damage: 1,
  },
  laser: {
    id: "laser",
    name: "LÁSER",
    color: "#7cff3f",
    glow: "#d4ffb8",
    cooldown: 300,
    damage: 3,
  },
  fire: {
    id: "fire",
    name: "FUEGO",
    color: "#ff6b1a",
    glow: "#ffd08a",
    cooldown: 150,
    damage: 2,
  },
};

export type Screen = "menu" | "playing" | "gameover" | "victory";

export interface HudState {
  score: number;
  combo: number;
  best: number;
  hp: number;
  maxHp: number;
  time: number;
  level: number;
  /** Etapa actual 1..5 */
  stage: number;
  wave: number;
  weapon: WeaponId;
  weaponLevel: number;
  kills: number;
  /** Dynamic difficulty 0..1 (progress + combo pressure) */
  heat: number;
  bossActive: boolean;
  bossName: string;
  bossHp: number;
  bossMaxHp: number;
  /** Giros evasivos disponibles */
  dodges: number;
  /** Bombas disponibles */
  bombs: number;
}
