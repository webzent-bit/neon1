export interface BossConfig {
  name: string;
  color: string;
  accent: string;
  hp: number;
  /** velocidad horizontal px/s */
  speed: number;
  /** balas por abanico */
  fan: number;
  /** segundos entre abanicos */
  fanEvery: number;
  /** rayos láser verticales barredores */
  beams: boolean;
  /** misiles teledirigidos */
  missiles: boolean;
  /** balas en espiral */
  spiral: boolean;
  /** invoca secuaces */
  summon: boolean;
  /** dos fases: acelera al 50% de vida */
  phases: boolean;
}

export interface StageDifficulty {
  /** Maximum simultaneous enemies on screen */
  maxEnemies: number;
  /** Base enemies per wave (can vary with wave number) */
  baseWaveSize: number;
  /** Maximum enemies per wave */
  maxWaveSize: number;
  /** Probability of big enemies (0-1) */
  bigEnemyChance: number;
  /** Enemy speed multiplier */
  enemySpeedMult: number;
  /** Enemy health multiplier */
  enemyHealthMult: number;
  /** Enemy fire rate multiplier (lower = faster) */
  enemyFireRateMult: number;
  /** Projectile speed multiplier */
  projectileSpeedMult: number;
  /** Wave spawn interval multiplier (lower = faster waves) */
  waveSpawnRateMult: number;
  /** Health regeneration amount per interval */
  healthRegenAmount: number;
  /** Health regeneration interval (seconds) */
  healthRegenInterval: number;
  /** Bomb spawn chance (0-1) */
  bombSpawnChance: number;
  /** Enemy damage multiplier */
  enemyDamageMult: number;
  /** Boss damage multiplier */
  bossDamageMult: number;
  /** Boss attack speed multiplier (lower = faster) */
  bossAttackSpeedMult: number;
}

/** Un jefe por etapa, cada uno más duro que el anterior. */
export const BOSSES: BossConfig[] = [
  {
    name: "CRÁNEO NEÓN",
    color: "#ff2d55",
    accent: "#ffe000",
    hp: 260,
    speed: 60,
    fan: 5,
    fanEvery: 1.6,
    beams: false,
    missiles: false,
    spiral: false,
    summon: false,
    phases: false,
  },
  {
    name: "ARAÑA DE PLASMA",
    color: "#a855f7",
    accent: "#22e6ff",
    hp: 420,
    speed: 80,
    fan: 7,
    fanEvery: 1.4,
    beams: true,
    missiles: false,
    spiral: false,
    summon: false,
    phases: false,
  },
  {
    name: "TITÁN DE HIERRO",
    color: "#22e6ff",
    accent: "#7cff3f",
    hp: 620,
    speed: 95,
    fan: 7,
    fanEvery: 1.25,
    beams: true,
    missiles: true,
    spiral: false,
    summon: false,
    phases: true,
  },
  {
    name: "REINA VÓRTICE",
    color: "#ff8a00",
    accent: "#ff2d55",
    hp: 860,
    speed: 110,
    fan: 9,
    fanEvery: 1.15,
    beams: true,
    missiles: true,
    spiral: true,
    summon: true,
    phases: true,
  },
  {
    name: "SEÑOR DEL VACÍO",
    color: "#7cff3f",
    accent: "#a855f7",
    hp: 1200,
    speed: 135,
    fan: 11,
    fanEvery: 0.95,
    beams: true,
    missiles: true,
    spiral: true,
    summon: true,
    phases: true,
  },
];

export const MAX_STAGE = BOSSES.length;
export const LEVELS_PER_STAGE = 5;

/** Stage-based difficulty configuration */
export const STAGE_DIFFICULTY: StageDifficulty[] = [
  // ETAPA 1 - APRENDIZAJE
  {
    maxEnemies: 4,
    baseWaveSize: 1,
    maxWaveSize: 3,
    bigEnemyChance: 0.05,
    enemySpeedMult: 0.7,
    enemyHealthMult: 0.6,
    enemyFireRateMult: 1.5,
    projectileSpeedMult: 0.7,
    waveSpawnRateMult: 1.8,
    healthRegenAmount: 8,
    healthRegenInterval: 4,
    bombSpawnChance: 0.15,
    enemyDamageMult: 0.6,
    bossDamageMult: 0.7,
    bossAttackSpeedMult: 1.5,
  },
  // ETAPA 2 - FÁCIL / MEDIA
  {
    maxEnemies: 5,
    baseWaveSize: 1,
    maxWaveSize: 4,
    bigEnemyChance: 0.1,
    enemySpeedMult: 0.85,
    enemyHealthMult: 0.75,
    enemyFireRateMult: 1.3,
    projectileSpeedMult: 0.8,
    waveSpawnRateMult: 1.5,
    healthRegenAmount: 6,
    healthRegenInterval: 5,
    bombSpawnChance: 0.12,
    enemyDamageMult: 0.75,
    bossDamageMult: 0.8,
    bossAttackSpeedMult: 1.3,
  },
  // ETAPA 3 - MEDIA
  {
    maxEnemies: 6,
    baseWaveSize: 2,
    maxWaveSize: 5,
    bigEnemyChance: 0.15,
    enemySpeedMult: 1.0,
    enemyHealthMult: 0.9,
    enemyFireRateMult: 1.1,
    projectileSpeedMult: 0.9,
    waveSpawnRateMult: 1.2,
    healthRegenAmount: 4,
    healthRegenInterval: 6,
    bombSpawnChance: 0.1,
    enemyDamageMult: 0.9,
    bossDamageMult: 0.9,
    bossAttackSpeedMult: 1.1,
  },
  // ETAPA 4 - DIFÍCIL
  {
    maxEnemies: 7,
    baseWaveSize: 2,
    maxWaveSize: 6,
    bigEnemyChance: 0.2,
    enemySpeedMult: 1.15,
    enemyHealthMult: 1.1,
    enemyFireRateMult: 0.95,
    projectileSpeedMult: 1.0,
    waveSpawnRateMult: 1.0,
    healthRegenAmount: 3,
    healthRegenInterval: 7,
    bombSpawnChance: 0.08,
    enemyDamageMult: 1.0,
    bossDamageMult: 1.0,
    bossAttackSpeedMult: 1.0,
  },
  // ETAPA 5 - MUY DIFÍCIL / FINAL
  {
    maxEnemies: 8,
    baseWaveSize: 2,
    maxWaveSize: 7,
    bigEnemyChance: 0.25,
    enemySpeedMult: 1.3,
    enemyHealthMult: 1.2,
    enemyFireRateMult: 0.85,
    projectileSpeedMult: 1.1,
    waveSpawnRateMult: 0.85,
    healthRegenAmount: 2,
    healthRegenInterval: 8,
    bombSpawnChance: 0.06,
    enemyDamageMult: 1.1,
    bossDamageMult: 1.1,
    bossAttackSpeedMult: 0.85,
  },
];
