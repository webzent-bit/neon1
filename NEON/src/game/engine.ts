import { MAX_WEAPON_LEVEL, WEAPONS, type HudState, type WeaponId } from "./types";
import { BOSSES, LEVELS_PER_STAGE, MAX_STAGE, STAGE_DIFFICULTY, type BossConfig } from "./bosses";

export const W = 420;
export const H = 760;
const PLAYER_Y = H - 96;
const LEVEL_TIME = 45;


interface Enemy {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  size: number;
  big: boolean;
  fireIn: number;
  hitFlash: number;
  color: string;
  bob: number;
}

interface PBullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dmg: number;
  kind: WeaponId;
  r: number;
  life: number;
}

interface EBullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  color: string;
  r: number;
}

interface Pickup {
  x: number;
  y: number;
  weapon: WeaponId;
  spin: number;
  isBomb: boolean;
}

interface FloatText {
  x: number;
  y: number;
  text: string;
  age: number;
  color: string;
  size: number;
}

interface Star {
  x: number;
  y: number;
  z: number;
}

interface Boss {
  cfg: BossConfig;
  x: number;
  y: number;
  vx: number;
  hp: number;
  maxHp: number;
  t: number;
  fireIn: number;
  beamIn: number;
  missileIn: number;
  summonIn: number;
  spiralA: number;
  hitFlash: number;
  entering: boolean;
  rage: boolean;
}

interface Missile {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Beam {
  x: number;
  charge: number;
  active: number;
}



const ENEMY_COLORS = ["#ff2d55", "#e11d9c", "#ff8a00", "#a855f7", "#ff3d3d"];

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export class Game {
  ctx: CanvasRenderingContext2D;
  onHud: (h: HudState) => void;
  onGameOver: (score: number) => void;
  onVictory: (score: number) => void;

  enemies: Enemy[] = [];
  pBullets: PBullet[] = [];
  eBullets: EBullet[] = [];
  parts: Particle[] = [];
  pickups: Pickup[] = [];
  texts: FloatText[] = [];
  stars: Star[] = [];
  missiles: Missile[] = [];
  beams: Beam[] = [];
  boss: Boss | null = null;

  score = 0;
  best = 0;
  combo = 0;
  bestCombo = 0;
  kills = 0;
  hp = 100;
  maxHp = 100;
  stage = 1;
  level = 1;
  wave = 1;
  time = LEVEL_TIME;
  weapon: WeaponId = "basic";
  weaponLevel = 1;
  shootCd = 0;
  waveIn = 1;
  pickupIn = 6;
  shake = 0;
  elapsed = 0;
  running = false;

  // Bullet capture tracking
  consecutivePickups = 0;
  blockedWeapon: WeaponId | null = null;

  // Evasive maneuver system
  dodges = 3;
  maxDodges = 3;
  dodgeActive = false;
  dodgeTime = 0;
  dodgeDuration = 0.8; // Duration of evasive maneuver in seconds
  dodgeCooldown = 0;

  // Bomb system
  bombs = 2;
  maxBombs = 2;

  // Health regeneration
  lastRegenTime = 0;

  playerX = W / 2;
  targetX = W / 2;
  private tilt = 0;
  private raf = 0;
  private last = 0;
  private hudAcc = 0;
  private muzzle = 0;
  private thrust = 0;

  constructor(
    ctx: CanvasRenderingContext2D,
    onHud: (h: HudState) => void,
    onGameOver: (score: number) => void,
    best = 0,
    onVictory: (score: number) => void = () => {},
  ) {
    this.ctx = ctx;
    this.onHud = onHud;
    this.onGameOver = onGameOver;
    this.onVictory = onVictory;
    this.best = best;
    for (let i = 0; i < 70; i++) {
      this.stars.push({ x: Math.random() * W, y: Math.random() * H, z: rand(0.3, 1) });
    }
  }

  start() {
    this.enemies = [];
    this.pBullets = [];
    this.eBullets = [];
    this.parts = [];
    this.pickups = [];
    this.texts = [];
    this.missiles = [];
    this.beams = [];
    this.boss = null;
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.kills = 0;
    this.hp = this.maxHp;
    this.stage = 1;
    this.level = 1;
    this.wave = 1;
    this.time = LEVEL_TIME;
    this.weapon = "basic";
    this.weaponLevel = 1;
    this.playerX = W / 2;
    this.targetX = W / 2;
    this.waveIn = 0.8;
    this.pickupIn = 6;
    this.elapsed = 0;
    this.running = true;
    this.consecutivePickups = 0;
    this.blockedWeapon = null;
    this.last = performance.now();
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(this.loop);
    
    // Reset new systems
    this.dodges = this.maxDodges;
    this.bombs = this.maxBombs;
    this.dodgeActive = false;
    this.dodgeTime = 0;
    this.dodgeCooldown = 0;
    this.lastRegenTime = 0;
    
    this.pushHud();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** Move the ship toward a canvas-space x position. */
  moveTo(x: number) {
    this.targetX = Math.max(38, Math.min(W - 38, x));
  }

  /** Get current stage difficulty configuration */
  private getStageDifficulty() {
    return STAGE_DIFFICULTY[Math.min(this.stage, MAX_STAGE) - 1]!;
  }

  /** Trigger evasive maneuver with spacebar */
  triggerDodge() {
    if (!this.running || this.dodgeActive || this.dodges <= 0 || this.dodgeCooldown > 0) return;
    
    this.dodges--;
    this.dodgeActive = true;
    this.dodgeTime = this.dodgeDuration;
    this.dodgeCooldown = 0.5; // Short cooldown after dodge
    this.shake = 8;
    this.addText(this.playerX, PLAYER_Y - 40, "¡ESQUIVA!", "#7cff3f", 20);
    this.pushHud();
  }

  /** Trigger bomb with Q key */
  triggerBomb() {
    if (!this.running || this.bombs <= 0) return;
    
    this.bombs--;
    this.shake = 20;
    this.addText(W / 2, H / 2, "¡BOMBA!", "#ff8a00", 48);
    
    // Apply bomb damage to enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i]!;
      let damageChance: number;
      
      // Determine damage chance based on enemy size
      if (e.size < 1.2) {
        damageChance = 1.0; // 100% for small enemies
      } else if (e.size < 1.6) {
        damageChance = 0.75; // 75% for medium enemies
      } else {
        damageChance = 0.3; // 30% for large enemies
      }
      
      if (Math.random() < damageChance) {
        this.kill(e);
      } else {
        // Even if not killed, still deal significant damage
        e.hp = Math.max(0, e.hp - e.maxHp * 0.5);
        e.hitFlash = 0.2;
        if (e.hp <= 0) this.kill(e);
      }
    }
    
    // Clear enemy bullets
    this.eBullets = [];
    
    // Also damage boss if active
    if (this.boss) {
      const bossDamage = this.boss.maxHp * 0.15; // Deal 15% of max HP to boss
      this.boss.hp = Math.max(0, this.boss.hp - bossDamage);
      this.boss.hitFlash = 0.2;
      if (this.boss.hp <= 0) {
        this.defeatBoss();
      }
    }
    
    this.pushHud();
  }

  /**
   * Dynamic difficulty curve 0..1.
   * Combines stage/level progress, time survived and kills with live
   * performance (current combo streak).
   */
  get heat() {
    const progress =
      (this.stage - 1) * 0.16 +
      (this.level - 1) * 0.06 +
      Math.min(0.22, this.elapsed / 320) +
      Math.min(0.18, this.kills / 300);
    const skill = Math.min(0.22, this.combo / 70);
    return Math.max(0, Math.min(1, progress + skill));
  }

  private pushHud() {
    this.onHud({
      heat: this.heat,
      score: Math.round(this.score),
      combo: this.combo,
      best: this.best,
      hp: Math.max(0, Math.round(this.hp)),
      maxHp: this.maxHp,
      time: Math.max(0, Math.ceil(this.time)),
      stage: this.stage,
      level: this.level,
      wave: this.wave,
      weapon: this.weapon,
      weaponLevel: this.weaponLevel,
      kills: this.kills,
      bossActive: !!this.boss,
      bossName: this.boss?.cfg.name ?? "",
      bossHp: Math.max(0, Math.round(this.boss?.hp ?? 0)),
      bossMaxHp: this.boss?.maxHp ?? 0,
      dodges: this.dodges,
      bombs: this.bombs,
    });
  }


  /* ---------- shooting ---------- */

  private fire() {
    const w = WEAPONS[this.weapon];
    const lvl = this.weaponLevel;
    const y = PLAYER_Y - 34;
    this.muzzle = 0.08;
    this.shake = Math.max(this.shake, 2);
    this.shootCd = Math.max(0.06, (w.cooldown / 1000) * (1 - (lvl - 1) * 0.08));

    const push = (vx: number, vy: number, r: number, dmg: number, ox = 0) => {
      this.pBullets.push({
        x: this.playerX + ox,
        y,
        vx,
        vy,
        r,
        dmg,
        kind: this.weapon,
        life: 0,
      });
    };

    if (this.weapon === "multi") {
      const n = 3 + lvl * 2; // 5, 7, 9 ...
      const gap = 13;
      for (let i = 0; i < n; i++) {
        const ox = (i - (n - 1) / 2) * gap;
        push(0, -820, 5 + lvl * 0.5, w.damage + Math.floor(lvl / 3), ox);
      }
    } else if (this.weapon === "laser") {
      push(0, -1500, 7 + lvl * 3, w.damage + (lvl - 1) * 2);
    } else if (this.weapon === "fire") {
      const n = Math.min(5, lvl + 1);
      for (let i = 0; i < n; i++) {
        const spread = (i - (n - 1) / 2) * 60;
        push(spread, -640, 9 + lvl * 2.5, w.damage + (lvl - 1));
      }
    } else {
      const n = Math.min(3, lvl);
      for (let i = 0; i < n; i++) {
        push((i - (n - 1) / 2) * 40, -900, 5 + lvl * 0.6, w.damage + Math.floor((lvl - 1) / 2));
      }
    }
  }

  private grabPickup(p: Pickup) {
    if (p.isBomb) {
      // Handle bomb pickup
      if (this.bombs < this.maxBombs) {
        this.bombs++;
        this.addText(p.x, p.y, "+BOMBA", "#ff8a00", 24);
        this.burst(p.x, p.y, "#ff8a00", 16);
        this.pushHud();
      }
      return;
    }
    
    // Handle weapon pickup
    if (p.weapon === this.weapon) {
      this.weaponLevel = Math.min(MAX_WEAPON_LEVEL, this.weaponLevel + 1);
      this.consecutivePickups++;
      
      // Bloquear este tipo de bala después de 3 capturas consecutivas
      if (this.consecutivePickups >= 3) {
        this.blockedWeapon = this.weapon;
        this.consecutivePickups = 0;
        this.addText(p.x, p.y - 20, "¡BLOQUEADO!", "#ff2d55", 18);
      }
      
      const max = this.weaponLevel >= MAX_WEAPON_LEVEL;
      this.addText(
        p.x,
        p.y,
        max ? "MÁX Lv" + this.weaponLevel : "NIVEL " + this.weaponLevel,
        WEAPONS[p.weapon].color,
        24,
      );
    } else {
      // Si captura un tipo diferente, reiniciar el bloqueo
      if (this.blockedWeapon === p.weapon) {
        this.blockedWeapon = null;
        this.addText(p.x, p.y - 20, "¡DESBLOQUEADO!", "#7cff3f", 18);
      }
      
      this.weapon = p.weapon;
      this.weaponLevel = 1;
      this.consecutivePickups = 1; // Empezar contador para el nuevo arma
      this.addText(p.x, p.y, WEAPONS[p.weapon].name + "!", WEAPONS[p.weapon].color, 26);
    }
    this.burst(p.x, p.y, WEAPONS[p.weapon].color, 16);
    this.pushHud();
  }

  private kill(e: Enemy) {
    const idx = this.enemies.indexOf(e);
    if (idx >= 0) this.enemies.splice(idx, 1);
    this.kills++;
    this.combo++;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    const mult = 1 + Math.min(this.combo, 20) * 0.2;
    const gain = Math.round((e.big ? 140 : 60) * mult);
    this.score += gain;
    this.addText(e.x, e.y - 30, "+" + gain, "#ffe000", 20 + Math.min(this.combo, 10));
    this.burst(e.x, e.y, e.color, e.big ? 26 : 14);
    this.shake = Math.max(this.shake, e.big ? 9 : 4);
  }

  private addText(x: number, y: number, text: string, color: string, size: number) {
    this.texts.push({ x, y, text, color, size, age: 0 });
  }

  private burst(x: number, y: number, color: string, n: number) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = rand(60, 260);
      this.parts.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        color,
        r: rand(2, 6),
        age: 0,
        life: rand(0.3, 0.7),
      });
    }
  }

  /* ---------- spawning ---------- */

  private spawnEnemy(x: number, big: boolean) {
    const stageDiff = this.getStageDifficulty();
    const heat = this.heat;
    // sizes swell slightly with the curve, big ones swell more
    const size = big ? rand(1.6, 2.0) + heat * 0.55 : rand(0.85, 1.05) + heat * 0.2;
    const hp = Math.ceil(((big ? 8 : 2) + this.level * 0.9) * stageDiff.enemyHealthMult * (1 + heat * 0.4));
    this.enemies.push({
      x,
      y: -60,
      vx: rand(-26, 26) * stageDiff.enemySpeedMult * (1 + heat * 0.5),
      vy: (rand(34, 52) + this.level * 4) * stageDiff.enemySpeedMult * (1 + heat * 0.4),
      hp,
      maxHp: hp,
      size,
      big,
      fireIn: rand(1, 2.4) * stageDiff.enemyFireRateMult / (1 + heat * 0.3),
      hitFlash: 0,
      color: big ? "#ff2d55" : ENEMY_COLORS[Math.floor(Math.random() * ENEMY_COLORS.length)]!,
      bob: Math.random() * 6,
    });
  }

  /** Waves grow with the dynamic difficulty curve: 1 enemy, then 2, 3... */
  private spawnWave() {
    const stageDiff = this.getStageDifficulty();
    const heat = this.heat;
    
    // Check max enemies limit
    if (this.enemies.length >= stageDiff.maxEnemies) {
      // Delay next wave attempt if at max capacity
      this.waveIn = 1.0;
      return;
    }
    
    // Calculate wave size based on stage difficulty and progression
    const baseCount = stageDiff.baseWaveSize;
    const maxCount = stageDiff.maxWaveSize;
    const count = Math.min(
      maxCount,
      Math.max(baseCount, Math.round(baseCount + (this.wave - 1) * 0.3 + heat * 2)),
    );
    
    // Actually spawn based on available capacity
    const availableSlots = stageDiff.maxEnemies - this.enemies.length;
    const actualCount = Math.min(count, availableSlots);
    
    if (actualCount <= 0) {
      this.waveIn = 0.5;
      return;
    }
    
    const bigChance = Math.min(stageDiff.bigEnemyChance + heat * 0.3, 0.4);
    
    for (let i = 0; i < actualCount; i++) {
      let x: number;
      
      // Desde la Etapa 2, aparición aleatoria con distancia segura del jugador
      if (this.stage >= 2) {
        const safeDistance = 120; // Distancia mínima de seguridad alrededor de la nave
        let attempts = 0;
        do {
          x = rand(50, W - 50);
          attempts++;
        } while (Math.abs(x - this.playerX) < safeDistance && attempts < 10);
      } else {
        // Etapa 1: aparición en posiciones fijas
        x = ((i + 1) / (actualCount + 1)) * (W - 100) + 50 + rand(-16, 16);
      }
      
      this.spawnEnemy(x, Math.random() < bigChance);
    }
    if (actualCount > 1) this.addText(W / 2, 150, "OLEADA x" + actualCount, "#22e6ff", 22);
    this.wave++;
    this.waveIn = Math.max(0.8, (3.0 - this.wave * 0.08) * stageDiff.waveSpawnRateMult * (1 - heat * 0.3));
  }

  private spawnPickup() {
    const stageDiff = this.getStageDifficulty();
    
    // Chance de spawnear bomba recuperable basado en la dificultad de la etapa
    const bombChance = stageDiff.bombSpawnChance;
    const shouldSpawnBomb = Math.random() < bombChance && this.bombs < this.maxBombs;
    
    if (shouldSpawnBomb) {
      this.pickups.push({
        x: rand(60, W - 60),
        y: -40,
        weapon: "basic", // Dummy weapon, won't be used
        spin: 0,
        isBomb: true,
      });
      return;
    }
    
    // El arma que ya está al máximo deja de caer; las otras siguen apareciendo.
    const all: WeaponId[] = ["multi", "laser", "fire"];
    let pool = all.filter(
      (w) => !(w === this.weapon && this.weaponLevel >= MAX_WEAPON_LEVEL),
    );
    
    // Si hay un arma bloqueada por captura consecutiva, excluirla del pool
    if (this.blockedWeapon && pool.includes(this.blockedWeapon)) {
      pool = pool.filter(w => w !== this.blockedWeapon);
    }
    
    // Si no hay armas disponibles (todas bloqueadas o al máximo), no generar pickup
    if (pool.length === 0) return;
    
    this.pickups.push({
      x: rand(60, W - 60),
      y: -40,
      weapon: pool[Math.floor(Math.random() * pool.length)]!,
      spin: 0,
      isBomb: false,
    });

  }


  /* ---------- bosses ---------- */

  private startBoss() {
    const cfg = BOSSES[Math.min(this.stage, MAX_STAGE) - 1]!;
    const hp = cfg.hp;
    // limpia el campo: los enemigos restantes explotan
    for (const e of this.enemies) this.burst(e.x, e.y, e.color, 12);
    this.enemies = [];
    this.eBullets = [];
    this.boss = {
      cfg,
      x: W / 2,
      y: -120,
      vx: cfg.speed,
      hp,
      maxHp: hp,
      t: 0,
      fireIn: 1.6,
      beamIn: 3.2,
      missileIn: 2.6,
      summonIn: 6,
      spiralA: 0,
      hitFlash: 0,
      entering: true,
      rage: false,
    };
    this.shake = 14;
    this.addText(W / 2, 260, "¡JEFE!", "#ffe000", 46);
    this.addText(W / 2, 310, cfg.name, cfg.color, 24);
    this.pushHud();
  }

  private defeatBoss() {
    const b = this.boss;
    if (!b) return;
    for (let i = 0; i < 6; i++) {
      this.burst(b.x + rand(-50, 50), b.y + rand(-40, 40), i % 2 ? b.cfg.accent : b.cfg.color, 26);
    }
    this.boss = null;
    this.eBullets = [];
    this.missiles = [];
    this.beams = [];
    this.shake = 18;
    this.score += 1200 * this.stage;
    this.kills++;

    if (this.stage >= MAX_STAGE) {
      this.best = Math.max(this.best, Math.round(this.score));
      this.running = false;
      this.pushHud();
      this.onVictory(Math.round(this.score));
      return;
    }

    this.stage++;
    this.level = 1;
    this.wave = 1;
    this.time = LEVEL_TIME;
    this.waveIn = 2;
    this.pickupIn = 5;
    this.hp = Math.min(this.maxHp, this.hp + 40);
    
    // Reset dodges and refill bombs for new stage
    this.dodges = this.maxDodges;
    this.bombs = this.maxBombs;
    this.dodgeActive = false;
    this.dodgeTime = 0;
    this.dodgeCooldown = 0;
    
    this.addText(W / 2, 300, "ETAPA " + this.stage, "#22e6ff", 44);
    this.pushHud();
  }

  private bossShootFan(b: Boss) {
    const stageDiff = this.getStageDifficulty();
    const n = b.rage ? b.cfg.fan + 2 : b.cfg.fan;
    const sp = (220 + this.stage * 22 + (b.rage ? 60 : 0)) * stageDiff.projectileSpeedMult;
    const base = Math.atan2(PLAYER_Y - b.y, this.playerX - b.x);
    for (let i = 0; i < n; i++) {
      const a = base + (i - (n - 1) / 2) * 0.18;
      this.eBullets.push({ x: b.x, y: b.y + 30, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp });
    }
  }

  private updateBoss(dt: number) {
    const b = this.boss;
    if (!b) return;
    const stageDiff = this.getStageDifficulty();
    b.t += dt;
    b.hitFlash -= dt;

    if (b.entering) {
      b.y += 90 * dt;
      if (b.y >= 130) {
        b.y = 130;
        b.entering = false;
      }
      return;
    }

    if (!b.rage && b.cfg.phases && b.hp < b.maxHp * 0.5) {
      b.rage = true;
      b.vx *= 1.45;
      this.shake = 12;
      this.addText(b.x, b.y + 60, "¡FURIA!", b.cfg.accent, 28);
    }

    b.x += b.vx * dt;
    if (b.x < 70) {
      b.x = 70;
      b.vx *= -1;
    }
    if (b.x > W - 70) {
      b.x = W - 70;
      b.vx *= -1;
    }
    b.y = 130 + Math.sin(b.t * 1.4) * 16;

    // abanico de balas
    b.fireIn -= dt;
    if (b.fireIn <= 0) {
      b.fireIn = b.cfg.fanEvery * stageDiff.bossAttackSpeedMult * (b.rage ? 0.7 : 1);
      this.bossShootFan(b);
    }

    // espiral
    if (b.cfg.spiral) {
      b.spiralA += dt * 3.4;
      if (Math.floor(b.spiralA / 0.5) !== Math.floor((b.spiralA - dt * 3.4) / 0.5)) {
        const sp = (200 + this.stage * 14) * stageDiff.projectileSpeedMult;
        for (let k = 0; k < 3; k++) {
          const a = b.spiralA + (k * Math.PI * 2) / 3;
          this.eBullets.push({ x: b.x, y: b.y, vx: Math.cos(a) * sp, vy: Math.abs(Math.sin(a)) * sp + 90 });
        }
      }
    }

    // misiles láser (haz vertical telegrafiado)
    if (b.cfg.beams) {
      b.beamIn -= dt;
      if (b.beamIn <= 0) {
        b.beamIn = ((b.rage ? 2.4 : 3.6) - this.stage * 0.15) * stageDiff.bossAttackSpeedMult;
        this.beams.push({ x: this.playerX, charge: 0.85, active: 0 });
      }
    }

    // misiles teledirigidos
    if (b.cfg.missiles) {
      b.missileIn -= dt;
      if (b.missileIn <= 0) {
        b.missileIn = (b.rage ? 1.9 : 2.8) * stageDiff.bossAttackSpeedMult;
        for (const ox of [-42, 42]) {
          this.missiles.push({ x: b.x + ox, y: b.y + 20, vx: 0, vy: 120 });
        }
      }
    }

    // secuaces
    if (b.cfg.summon) {
      b.summonIn -= dt;
      if (b.summonIn <= 0) {
        b.summonIn = 9;
        this.spawnEnemy(rand(70, W - 70), false);
        this.spawnEnemy(rand(70, W - 70), false);
      }
    }

    // balas del jugador contra el jefe
    for (let i = this.pBullets.length - 1; i >= 0; i--) {
      const p = this.pBullets[i]!;
      if (Math.abs(p.x - b.x) < 56 && Math.abs(p.y - b.y) < 44) {
        b.hp -= p.dmg;
        b.hitFlash = 0.1;
        this.burst(p.x, p.y, WEAPONS[p.kind].glow, 4);
        if (p.kind !== "laser") this.pBullets.splice(i, 1);
        if (b.hp <= 0) {
          this.defeatBoss();
          return;
        }
      }
    }

    // rayos verticales
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const beam = this.beams[i]!;
      if (beam.charge > 0) {
        beam.charge -= dt;
        if (beam.charge <= 0) {
          beam.active = 0.6;
          this.shake = Math.max(this.shake, 8);
        }
        continue;
      }
      beam.active -= dt;
      if (Math.abs(this.playerX - beam.x) < 22) {
        this.damagePlayer((14 + this.stage * 2) * stageDiff.bossDamageMult * dt * 4);
        if (!this.running) return;
      }
      if (beam.active <= 0) this.beams.splice(i, 1);
    }

    // misiles
    for (let i = this.missiles.length - 1; i >= 0; i--) {
      const m = this.missiles[i]!;
      const d = Math.hypot(this.playerX - m.x, PLAYER_Y - m.y) || 1;
      const acc = (260 + this.stage * 30) * stageDiff.projectileSpeedMult;
      m.vx += ((this.playerX - m.x) / d) * acc * dt;
      m.vy += ((PLAYER_Y - m.y) / d) * acc * dt;
      const sp = Math.hypot(m.vx, m.vy);
      const cap = (250 + this.stage * 20) * stageDiff.projectileSpeedMult;
      if (sp > cap) {
        m.vx = (m.vx / sp) * cap;
        m.vy = (m.vy / sp) * cap;
      }
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      if (Math.hypot(m.x - this.playerX, m.y - PLAYER_Y) < 30) {
        this.missiles.splice(i, 1);
        this.damagePlayer((14 + this.stage * 2) * stageDiff.bossDamageMult);
        if (!this.running) return;
        continue;
      }
      if (m.y > H + 40 || m.y < -80 || m.x < -60 || m.x > W + 60) this.missiles.splice(i, 1);
    }
  }

  /* ---------- update ---------- */

  private damagePlayer(dmg: number) {
    this.hp -= dmg;
    this.combo = 0;
    this.shake = 12;
    this.burst(this.playerX, PLAYER_Y, "#ff2d55", 18);
    this.pushHud();
    if (this.hp <= 0) {
      this.hp = 0;
      this.best = Math.max(this.best, Math.round(this.score));
      this.running = false;
      this.pushHud();
      this.onGameOver(Math.round(this.score));
    }
  }

  private update(dt: number) {
    this.elapsed += dt;
    this.shootCd -= dt;
    this.muzzle -= dt;
    this.thrust += dt * 18;
    this.shake *= 0.86;
    this.dodgeCooldown -= dt;

    // Get stage difficulty once at the beginning
    const stageDiff = this.getStageDifficulty();

    // ship movement
    const dx = this.targetX - this.playerX;
    this.playerX += dx * Math.min(1, dt * 12);
    this.tilt = Math.max(-0.4, Math.min(0.4, dx / 90));

    // Handle evasive maneuver
    if (this.dodgeActive) {
      this.dodgeTime -= dt;
      if (this.dodgeTime <= 0) {
        this.dodgeActive = false;
      }
    }

    // Health regeneration - based on stage difficulty
    this.lastRegenTime += dt;
    if (this.lastRegenTime >= stageDiff.healthRegenInterval && this.hp < this.maxHp) {
      const regenAmount = stageDiff.healthRegenAmount + (this.level * 0.5); // Stage-based regen
      this.hp = Math.min(this.maxHp, this.hp + regenAmount);
      this.lastRegenTime = 0;
      if (this.hp > 0 && this.hp < this.maxHp) {
        this.addText(this.playerX, PLAYER_Y - 20, "+" + Math.round(regenAmount), "#7cff3f", 16);
      }
    }

    const bossFight = !!this.boss;
    if (!bossFight) this.time -= dt;

    // a la mitad del último nivel de la etapa entra el jefe
    if (!bossFight && this.level >= LEVELS_PER_STAGE && this.time <= LEVEL_TIME / 2) {
      this.startBoss();
    }

    if (!bossFight && this.time <= 0) {
      this.level++;
      this.time = LEVEL_TIME;
      this.score += 250;
      this.hp = Math.min(this.maxHp, this.hp + 20);
      this.addText(W / 2, 320, "NIVEL " + this.level, "#22e6ff", 40);
    }

    // continuous fire
    if (this.shootCd <= 0) this.fire();

    if (this.boss) {
      this.updateBoss(dt);
      if (!this.running) return;
    } else {
      this.waveIn -= dt;
      if (this.waveIn <= 0) this.spawnWave();
    }

    this.pickupIn -= dt;
    if (this.pickupIn <= 0) {
      this.spawnPickup();
      this.pickupIn = rand(8, 13);
    }


    // stars
    for (const s of this.stars) {
      s.y += (30 + s.z * 120) * dt;
      if (s.y > H) {
        s.y = -4;
        s.x = Math.random() * W;
      }
    }

    // enemies
    for (const e of this.enemies) {
      e.y += e.vy * dt;
      e.x += e.vx * dt;
      if (e.x < 40 || e.x > W - 40) e.vx *= -1;
      e.bob += dt * 6;
      e.hitFlash -= dt;
      e.fireIn -= dt;
      if (e.fireIn <= 0 && e.y > 40) {
        e.fireIn = rand(1.4, 3) * stageDiff.enemyFireRateMult / (1 + this.level * 0.1 + this.heat * 0.5);
        const d = Math.hypot(this.playerX - e.x, PLAYER_Y - e.y) || 1;
        const sp = (230 + this.level * 16) * stageDiff.projectileSpeedMult * (1 + this.heat * 0.3);
        this.eBullets.push({
          x: e.x,
          y: e.y + 20 * e.size,
          vx: ((this.playerX - e.x) / d) * sp,
          vy: ((PLAYER_Y - e.y) / d) * sp,
        });
      }
    }

    // enemies reaching the bottom
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i]!;
      if (e.y > H - 60) {
        this.enemies.splice(i, 1);
        this.damagePlayer((e.big ? 26 : 12) * stageDiff.enemyDamageMult);
        if (!this.running) return;
      }
    }

    // player bullets
    for (let i = this.pBullets.length - 1; i >= 0; i--) {
      const b = this.pBullets[i]!;
      b.life += dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.y < -30 || b.x < -30 || b.x > W + 30) {
        this.pBullets.splice(i, 1);
        continue;
      }
      let hit = false;
      for (const e of this.enemies) {
        const rr = 26 * e.size + b.r;
        if (Math.hypot(e.x - b.x, e.y - b.y) < rr) {
          e.hp -= b.dmg;
          e.hitFlash = 0.14;
          this.burst(b.x, b.y, WEAPONS[b.kind].glow, 4);
          if (e.hp <= 0) this.kill(e);
          hit = true;
          break;
        }
      }
      if (hit && b.kind !== "laser") this.pBullets.splice(i, 1);
    }

    // pickups
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i]!;
      p.y += 90 * dt;
      p.spin += dt * 3;
      if (Math.hypot(p.x - this.playerX, p.y - PLAYER_Y) < 52) {
        this.pickups.splice(i, 1);
        this.grabPickup(p);
        continue;
      }
      if (p.y > H + 40) this.pickups.splice(i, 1);
    }

    // enemy bullets
    for (let i = this.eBullets.length - 1; i >= 0; i--) {
      const b = this.eBullets[i]!;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (Math.hypot(b.x - this.playerX, b.y - PLAYER_Y) < 30) {
        // Check if player is dodging - if so, no damage
        if (!this.dodgeActive) {
          this.eBullets.splice(i, 1);
          this.damagePlayer((7 + this.level * 1.4) * stageDiff.enemyDamageMult);
          if (!this.running) return;
          continue;
        }
        // If dodging, bullet passes through
      }
      if (b.y > H + 20 || b.x < -30 || b.x > W + 30) this.eBullets.splice(i, 1);
    }

    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i]!;
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 220 * dt;
      if (p.age > p.life) this.parts.splice(i, 1);
    }

    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i]!;
      t.age += dt;
      t.y -= 40 * dt;
      if (t.age > 1) this.texts.splice(i, 1);
    }

    this.hudAcc += dt;
    if (this.hudAcc > 0.1) {
      this.hudAcc = 0;
      this.pushHud();
    }
  }

  /* ---------- rendering ---------- */

  private drawSpace(c: CanvasRenderingContext2D) {
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0a0618");
    g.addColorStop(0.55, "#160a2e");
    g.addColorStop(1, "#2a0f3e");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);

    // nebula glow
    const neb = c.createRadialGradient(W * 0.7, H * 0.22, 10, W * 0.7, H * 0.22, 300);
    neb.addColorStop(0, "rgba(168,85,247,0.35)");
    neb.addColorStop(1, "rgba(168,85,247,0)");
    c.fillStyle = neb;
    c.fillRect(0, 0, W, H);
    const neb2 = c.createRadialGradient(W * 0.2, H * 0.62, 10, W * 0.2, H * 0.62, 260);
    neb2.addColorStop(0, "rgba(34,230,255,0.22)");
    neb2.addColorStop(1, "rgba(34,230,255,0)");
    c.fillStyle = neb2;
    c.fillRect(0, 0, W, H);

    for (const s of this.stars) {
      c.globalAlpha = 0.25 + s.z * 0.75;
      c.fillStyle = "#ffffff";
      c.fillRect(s.x, s.y, 2 * s.z, 2 + s.z * 6);
    }
    c.globalAlpha = 1;

    // grid floor
    c.strokeStyle = "rgba(255,78,205,0.25)";
    c.lineWidth = 1.5;
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * W;
      c.beginPath();
      c.moveTo(x, H);
      c.lineTo(W / 2 + (x - W / 2) * 0.15, H - 200);
      c.stroke();
    }
    for (let k = 1; k <= 6; k++) {
      const y = H - 200 + Math.pow(k / 6, 2.2) * 200;
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(W, y);
      c.stroke();
    }
  }

  private drawEnemy(c: CanvasRenderingContext2D, e: Enemy) {
    const s = e.size;
    c.save();
    c.translate(e.x, e.y + Math.sin(e.bob) * 3);
    c.scale(s, s);
    c.lineWidth = 3 / s;
    c.strokeStyle = "#0b0614";
    const flash = e.hitFlash > 0;
    const col = flash ? "#ffffff" : e.color;

    c.shadowColor = col;
    c.shadowBlur = 18;
    c.fillStyle = col;
    // hull (inverted arrow ship)
    c.beginPath();
    c.moveTo(0, 26);
    c.lineTo(-26, -6);
    c.lineTo(-14, -18);
    c.lineTo(14, -18);
    c.lineTo(26, -6);
    c.closePath();
    c.fill();
    c.stroke();
    c.shadowBlur = 0;

    // cockpit
    c.fillStyle = flash ? "#fff" : "#0b0614";
    c.beginPath();
    c.ellipse(0, -2, 10, 8, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#22e6ff";
    c.beginPath();
    c.ellipse(0, -3, 6, 4, 0, 0, Math.PI * 2);
    c.fill();

    if (e.maxHp > 1) {
      const pw = 40;
      c.fillStyle = "#0b0614";
      c.fillRect(-pw / 2 - 2, -34, pw + 4, 7);
      c.fillStyle = e.big ? "#ffe000" : "#7cff3f";
      c.fillRect(-pw / 2, -32, (pw * Math.max(0, e.hp)) / e.maxHp, 3);
    }
    c.restore();
  }

  private drawShip(c: CanvasRenderingContext2D) {
    const w = WEAPONS[this.weapon];
    c.save();
    c.translate(this.playerX, PLAYER_Y);
    
    // Evasive maneuver rotation
    if (this.dodgeActive) {
      const dodgeProgress = 1 - (this.dodgeTime / this.dodgeDuration);
      c.rotate(dodgeProgress * Math.PI * 2); // 360° rotation during dodge
    } else {
      c.rotate(this.tilt * 0.5);
    }

    // engine flames
    const fl = 16 + Math.abs(Math.sin(this.thrust)) * 12;
    const flame = c.createLinearGradient(0, 20, 0, 20 + fl);
    flame.addColorStop(0, "#ffe000");
    flame.addColorStop(1, "rgba(255,107,26,0)");
    c.fillStyle = flame;
    c.beginPath();
    c.moveTo(-12, 20);
    c.lineTo(0, 20 + fl);
    c.lineTo(12, 20);
    c.closePath();
    c.fill();

    c.lineWidth = 3;
    c.strokeStyle = "#0b0614";
    
    // Evasive maneuver glow effect
    if (this.dodgeActive) {
      c.shadowColor = "#7cff3f";
      c.shadowBlur = 30;
    } else {
      c.shadowColor = w.color;
      c.shadowBlur = 22;
    }

    // hull
    c.fillStyle = this.dodgeActive ? "#7cff3f" : "#22e6ff";
    c.beginPath();
    c.moveTo(0, -36);
    c.lineTo(16, 2);
    c.lineTo(30, 20);
    c.lineTo(10, 20);
    c.lineTo(0, 12);
    c.lineTo(-10, 20);
    c.lineTo(-30, 20);
    c.lineTo(-16, 2);
    c.closePath();
    c.fill();
    c.stroke();
    c.shadowBlur = 0;

    // cockpit
    c.fillStyle = w.color;
    c.beginPath();
    c.ellipse(0, -8, 7, 13, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    if (this.muzzle > 0) {
      c.fillStyle = w.glow;
      c.globalAlpha = 0.85;
      c.beginPath();
      c.ellipse(0, -40, 12, 18, 0, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
    }
    c.restore();
  }

  private drawPBullet(c: CanvasRenderingContext2D, b: PBullet) {
    const w = WEAPONS[b.kind];
    c.save();
    c.shadowColor = w.color;
    c.shadowBlur = 16;
    if (b.kind === "laser") {
      const g = c.createLinearGradient(0, b.y - 60, 0, b.y + 20);
      g.addColorStop(0, "rgba(124,255,63,0)");
      g.addColorStop(0.5, w.color);
      g.addColorStop(1, w.glow);
      c.fillStyle = g;
      c.fillRect(b.x - b.r / 2, b.y - 60, b.r, 80);
    } else if (b.kind === "fire") {
      const flick = 0.8 + Math.sin(b.life * 40) * 0.2;
      c.fillStyle = "#ff6b1a";
      c.beginPath();
      c.arc(b.x, b.y, b.r * flick, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#ffe000";
      c.beginPath();
      c.arc(b.x, b.y + 2, b.r * 0.5 * flick, 0, Math.PI * 2);
      c.fill();
    } else {
      c.fillStyle = w.glow;
      c.beginPath();
      c.roundRect(b.x - b.r / 2, b.y - b.r * 2, b.r, b.r * 4, b.r);
      c.fill();
      c.fillStyle = w.color;
      c.beginPath();
      c.roundRect(b.x - b.r / 4, b.y - b.r * 2.4, b.r / 2, b.r * 4, b.r);
      c.fill();
    }
    c.restore();
  }

  private drawPickup(c: CanvasRenderingContext2D, p: Pickup) {
    c.save();
    c.translate(p.x, p.y);
    c.rotate(Math.sin(p.spin) * 0.3);
    
    if (p.isBomb) {
      // Draw bomb pickup
      c.shadowColor = "#ff8a00";
      c.shadowBlur = 20;
      c.strokeStyle = "#ff8a00";
      c.lineWidth = 3;
      c.fillStyle = "rgba(11,6,20,0.85)";
      c.beginPath();
      c.roundRect(-26, -26, 52, 52, 14);
      c.fill();
      c.stroke();
      c.shadowBlur = 0;

      // Bomb icon
      c.fillStyle = "#ff8a00";
      c.beginPath();
      c.arc(0, -4, 12, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#ff6b1a";
      c.beginPath();
      c.arc(0, -4, 6, 0, Math.PI * 2);
      c.fill();
      
      // Fuse
      c.strokeStyle = "#ffe000";
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(0, -16);
      c.quadraticCurveTo(8, -24, 12, -20);
      c.stroke();
      
      c.font = '900 10px "Bungee", system-ui, sans-serif';
      c.textAlign = "center";
      c.fillStyle = "#ff8a00";
      c.fillText("BOMBA", 0, 24);
    } else {
      // Draw weapon pickup
      const w = WEAPONS[p.weapon];
      c.shadowColor = w.color;
      c.shadowBlur = 20;
      c.strokeStyle = w.color;
      c.lineWidth = 3;
      c.fillStyle = "rgba(11,6,20,0.85)";
      c.beginPath();
      c.roundRect(-26, -26, 52, 52, 14);
      c.fill();
      c.stroke();
      c.shadowBlur = 0;

      c.fillStyle = w.color;
      if (p.weapon === "multi") {
        for (let i = 0; i < 5; i++) c.fillRect(-16 + i * 8, -10, 3, 20);
      } else if (p.weapon === "laser") {
        c.fillRect(-4, -16, 8, 32);
        c.globalAlpha = 0.5;
        c.fillRect(-9, -16, 18, 32);
        c.globalAlpha = 1;
      } else {
        c.beginPath();
        c.moveTo(0, -16);
        c.quadraticCurveTo(12, 0, 0, 16);
        c.quadraticCurveTo(-12, 0, 0, -16);
        c.fill();
      }
      c.font = '900 10px "Bungee", system-ui, sans-serif';
      c.textAlign = "center";
      c.fillText(w.name, 0, 24);
    }
    c.restore();
  }

  private drawBoss(c: CanvasRenderingContext2D) {
    const b = this.boss;
    if (!b) return;
    const col = b.hitFlash > 0 ? "#ffffff" : b.cfg.color;
    c.save();
    c.translate(b.x, b.y);
    c.lineWidth = 4;
    c.strokeStyle = "#0b0614";
    c.shadowColor = col;
    c.shadowBlur = 26;
    c.fillStyle = col;
    // casco masivo
    c.beginPath();
    c.moveTo(0, 44);
    c.lineTo(-58, 8);
    c.lineTo(-46, -26);
    c.lineTo(-18, -38);
    c.lineTo(18, -38);
    c.lineTo(46, -26);
    c.lineTo(58, 8);
    c.closePath();
    c.fill();
    c.stroke();
    c.shadowBlur = 0;

    // alas
    c.fillStyle = b.cfg.accent;
    c.beginPath();
    c.roundRect(-72, -6, 22, 26, 6);
    c.roundRect(50, -6, 22, 26, 6);
    c.fill();
    c.stroke();

    // núcleo
    const pulse = 0.7 + Math.sin(b.t * 6) * 0.3;
    c.fillStyle = b.rage ? "#ff2d55" : b.cfg.accent;
    c.globalAlpha = pulse;
    c.beginPath();
    c.ellipse(0, -2, 18, 14, 0, 0, Math.PI * 2);
    c.fill();
    c.globalAlpha = 1;
    c.stroke();
    c.restore();
  }

  private drawBossWeapons(c: CanvasRenderingContext2D) {
    for (const beam of this.beams) {
      c.save();
      if (beam.charge > 0) {
        c.globalAlpha = 0.35 + Math.sin(beam.charge * 40) * 0.2;
        c.fillStyle = "#ffe000";
        c.fillRect(beam.x - 3, 0, 6, H);
      } else {
        const g = c.createLinearGradient(beam.x - 22, 0, beam.x + 22, 0);
        g.addColorStop(0, "rgba(255,45,85,0)");
        g.addColorStop(0.5, "#ff2d55");
        g.addColorStop(1, "rgba(255,45,85,0)");
        c.fillStyle = g;
        c.shadowColor = "#ff2d55";
        c.shadowBlur = 26;
        c.fillRect(beam.x - 24, 0, 48, H);
      }
      c.restore();
    }

    for (const m of this.missiles) {
      c.save();
      c.translate(m.x, m.y);
      c.rotate(Math.atan2(m.vy, m.vx) - Math.PI / 2);
      c.shadowColor = "#ff8a00";
      c.shadowBlur = 16;
      c.fillStyle = "#ffe000";
      c.beginPath();
      c.moveTo(0, -12);
      c.lineTo(7, 10);
      c.lineTo(-7, 10);
      c.closePath();
      c.fill();
      c.fillStyle = "#ff6b1a";
      c.beginPath();
      c.arc(0, 12, 5, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  }

  private render() {
    const c = this.ctx;
    c.save();
    if (this.shake > 0.4) {
      c.translate(rand(-this.shake, this.shake), rand(-this.shake, this.shake));
    }
    this.drawSpace(c);

    for (const b of this.pBullets) this.drawPBullet(c, b);
    for (const e of this.enemies) this.drawEnemy(c, e);
    for (const p of this.pickups) this.drawPickup(c, p);
    this.drawBoss(c);
    this.drawBossWeapons(c);


    for (const b of this.eBullets) {
      c.save();
      c.shadowColor = "#ff2d55";
      c.shadowBlur = 14;
      c.fillStyle = "#ff2d55";
      c.beginPath();
      c.arc(b.x, b.y, 6, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#ffd0dd";
      c.beginPath();
      c.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    this.drawShip(c);

    for (const p of this.parts) {
      c.globalAlpha = Math.max(0, 1 - p.age / p.life);
      c.fillStyle = p.color;
      c.beginPath();
      c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;

    for (const t of this.texts) {
      c.save();
      c.globalAlpha = 1 - t.age;
      c.font = `900 ${t.size}px "Bungee", system-ui, sans-serif`;
      c.textAlign = "center";
      c.lineWidth = 6;
      c.strokeStyle = "#000";
      c.strokeText(t.text, t.x, t.y);
      c.fillStyle = t.color;
      c.fillText(t.text, t.x, t.y);
      c.restore();
    }
    c.restore();
  }

  private loop = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.update(dt);
    this.render();
    if (this.running) this.raf = requestAnimationFrame(this.loop);
  };
}
