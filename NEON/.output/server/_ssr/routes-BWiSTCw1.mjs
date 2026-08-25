import { n as __toESM } from "../_runtime.mjs";
import { i as performance_default } from "../_libs/h3-v2+rou3+srvx+unenv.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BWiSTCw1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WEAPONS = {
	basic: {
		id: "basic",
		name: "BÁSICO",
		color: "#22e6ff",
		glow: "#7ff5ff",
		cooldown: 220,
		damage: 1
	},
	multi: {
		id: "multi",
		name: "MULTI x5",
		color: "#ffe000",
		glow: "#fff59b",
		cooldown: 260,
		damage: 1
	},
	laser: {
		id: "laser",
		name: "LÁSER",
		color: "#7cff3f",
		glow: "#d4ffb8",
		cooldown: 300,
		damage: 3
	},
	fire: {
		id: "fire",
		name: "FUEGO",
		color: "#ff6b1a",
		glow: "#ffd08a",
		cooldown: 150,
		damage: 2
	}
};
/** Un jefe por etapa, cada uno más duro que el anterior. */
var BOSSES = [
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
		phases: false
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
		phases: false
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
		phases: true
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
		phases: true
	},
	{
		name: "SEÑOR DEL VACÍO",
		color: "#7cff3f",
		accent: "#a855f7",
		hp: 1200,
		speed: 135,
		fan: 11,
		fanEvery: .95,
		beams: true,
		missiles: true,
		spiral: true,
		summon: true,
		phases: true
	}
];
var MAX_STAGE = BOSSES.length;
/** Stage-based difficulty configuration */
var STAGE_DIFFICULTY = [
	{
		maxEnemies: 4,
		baseWaveSize: 1,
		maxWaveSize: 3,
		bigEnemyChance: .05,
		enemySpeedMult: .7,
		enemyHealthMult: .6,
		enemyFireRateMult: 1.5,
		projectileSpeedMult: .7,
		waveSpawnRateMult: 1.8,
		healthRegenAmount: 8,
		healthRegenInterval: 4,
		bombSpawnChance: .15,
		enemyDamageMult: .6,
		bossDamageMult: .7,
		bossAttackSpeedMult: 1.5
	},
	{
		maxEnemies: 5,
		baseWaveSize: 1,
		maxWaveSize: 4,
		bigEnemyChance: .1,
		enemySpeedMult: .85,
		enemyHealthMult: .75,
		enemyFireRateMult: 1.3,
		projectileSpeedMult: .8,
		waveSpawnRateMult: 1.5,
		healthRegenAmount: 6,
		healthRegenInterval: 5,
		bombSpawnChance: .12,
		enemyDamageMult: .75,
		bossDamageMult: .8,
		bossAttackSpeedMult: 1.3
	},
	{
		maxEnemies: 6,
		baseWaveSize: 2,
		maxWaveSize: 5,
		bigEnemyChance: .15,
		enemySpeedMult: 1,
		enemyHealthMult: .9,
		enemyFireRateMult: 1.1,
		projectileSpeedMult: .9,
		waveSpawnRateMult: 1.2,
		healthRegenAmount: 4,
		healthRegenInterval: 6,
		bombSpawnChance: .1,
		enemyDamageMult: .9,
		bossDamageMult: .9,
		bossAttackSpeedMult: 1.1
	},
	{
		maxEnemies: 7,
		baseWaveSize: 2,
		maxWaveSize: 6,
		bigEnemyChance: .2,
		enemySpeedMult: 1.15,
		enemyHealthMult: 1.1,
		enemyFireRateMult: .95,
		projectileSpeedMult: 1,
		waveSpawnRateMult: 1,
		healthRegenAmount: 3,
		healthRegenInterval: 7,
		bombSpawnChance: .08,
		enemyDamageMult: 1,
		bossDamageMult: 1,
		bossAttackSpeedMult: 1
	},
	{
		maxEnemies: 8,
		baseWaveSize: 2,
		maxWaveSize: 7,
		bigEnemyChance: .25,
		enemySpeedMult: 1.3,
		enemyHealthMult: 1.2,
		enemyFireRateMult: .85,
		projectileSpeedMult: 1.1,
		waveSpawnRateMult: .85,
		healthRegenAmount: 2,
		healthRegenInterval: 8,
		bombSpawnChance: .06,
		enemyDamageMult: 1.1,
		bossDamageMult: 1.1,
		bossAttackSpeedMult: .85
	}
];
var PLAYER_Y = 664;
var LEVEL_TIME = 45;
var ENEMY_COLORS = [
	"#ff2d55",
	"#e11d9c",
	"#ff8a00",
	"#a855f7",
	"#ff3d3d"
];
function rand(a, b) {
	return a + Math.random() * (b - a);
}
var Game = class {
	ctx;
	onHud;
	onGameOver;
	onVictory;
	enemies = [];
	pBullets = [];
	eBullets = [];
	parts = [];
	pickups = [];
	texts = [];
	stars = [];
	missiles = [];
	beams = [];
	boss = null;
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
	weapon = "basic";
	weaponLevel = 1;
	shootCd = 0;
	waveIn = 1;
	pickupIn = 6;
	shake = 0;
	elapsed = 0;
	running = false;
	consecutivePickups = 0;
	blockedWeapon = null;
	dodges = 3;
	maxDodges = 3;
	dodgeActive = false;
	dodgeTime = 0;
	dodgeDuration = .8;
	dodgeCooldown = 0;
	bombs = 2;
	maxBombs = 2;
	lastRegenTime = 0;
	playerX = 420 / 2;
	targetX = 420 / 2;
	tilt = 0;
	raf = 0;
	last = 0;
	hudAcc = 0;
	muzzle = 0;
	thrust = 0;
	constructor(ctx, onHud, onGameOver, best = 0, onVictory = () => {}) {
		this.ctx = ctx;
		this.onHud = onHud;
		this.onGameOver = onGameOver;
		this.onVictory = onVictory;
		this.best = best;
		for (let i = 0; i < 70; i++) this.stars.push({
			x: Math.random() * 420,
			y: Math.random() * 760,
			z: rand(.3, 1)
		});
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
		this.playerX = 420 / 2;
		this.targetX = 420 / 2;
		this.waveIn = .8;
		this.pickupIn = 6;
		this.elapsed = 0;
		this.running = true;
		this.consecutivePickups = 0;
		this.blockedWeapon = null;
		this.last = performance_default.now();
		cancelAnimationFrame(this.raf);
		this.raf = requestAnimationFrame(this.loop);
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
	moveTo(x) {
		this.targetX = Math.max(38, Math.min(382, x));
	}
	/** Get current stage difficulty configuration */
	getStageDifficulty() {
		return STAGE_DIFFICULTY[Math.min(this.stage, MAX_STAGE) - 1];
	}
	/** Trigger evasive maneuver with spacebar */
	triggerDodge() {
		if (!this.running || this.dodgeActive || this.dodges <= 0 || this.dodgeCooldown > 0) return;
		this.dodges--;
		this.dodgeActive = true;
		this.dodgeTime = this.dodgeDuration;
		this.dodgeCooldown = .5;
		this.shake = 8;
		this.addText(this.playerX, 624, "¡ESQUIVA!", "#7cff3f", 20);
		this.pushHud();
	}
	/** Trigger bomb with Q key */
	triggerBomb() {
		if (!this.running || this.bombs <= 0) return;
		this.bombs--;
		this.shake = 20;
		this.addText(420 / 2, 760 / 2, "¡BOMBA!", "#ff8a00", 48);
		for (let i = this.enemies.length - 1; i >= 0; i--) {
			const e = this.enemies[i];
			let damageChance;
			if (e.size < 1.2) damageChance = 1;
			else if (e.size < 1.6) damageChance = .75;
			else damageChance = .3;
			if (Math.random() < damageChance) this.kill(e);
			else {
				e.hp = Math.max(0, e.hp - e.maxHp * .5);
				e.hitFlash = .2;
				if (e.hp <= 0) this.kill(e);
			}
		}
		this.eBullets = [];
		if (this.boss) {
			const bossDamage = this.boss.maxHp * .15;
			this.boss.hp = Math.max(0, this.boss.hp - bossDamage);
			this.boss.hitFlash = .2;
			if (this.boss.hp <= 0) this.defeatBoss();
		}
		this.pushHud();
	}
	/**
	* Dynamic difficulty curve 0..1.
	* Combines stage/level progress, time survived and kills with live
	* performance (current combo streak).
	*/
	get heat() {
		const progress = (this.stage - 1) * .16 + (this.level - 1) * .06 + Math.min(.22, this.elapsed / 320) + Math.min(.18, this.kills / 300);
		const skill = Math.min(.22, this.combo / 70);
		return Math.max(0, Math.min(1, progress + skill));
	}
	pushHud() {
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
			bombs: this.bombs
		});
	}
	fire() {
		const w = WEAPONS[this.weapon];
		const lvl = this.weaponLevel;
		const y = 630;
		this.muzzle = .08;
		this.shake = Math.max(this.shake, 2);
		this.shootCd = Math.max(.06, w.cooldown / 1e3 * (1 - (lvl - 1) * .08));
		const push = (vx, vy, r, dmg, ox = 0) => {
			this.pBullets.push({
				x: this.playerX + ox,
				y,
				vx,
				vy,
				r,
				dmg,
				kind: this.weapon,
				life: 0
			});
		};
		if (this.weapon === "multi") {
			const n = 3 + lvl * 2;
			const gap = 13;
			for (let i = 0; i < n; i++) {
				const ox = (i - (n - 1) / 2) * gap;
				push(0, -820, 5 + lvl * .5, w.damage + Math.floor(lvl / 3), ox);
			}
		} else if (this.weapon === "laser") push(0, -1500, 7 + lvl * 3, w.damage + (lvl - 1) * 2);
		else if (this.weapon === "fire") {
			const n = Math.min(5, lvl + 1);
			for (let i = 0; i < n; i++) push((i - (n - 1) / 2) * 60, -640, 9 + lvl * 2.5, w.damage + (lvl - 1));
		} else {
			const n = Math.min(3, lvl);
			for (let i = 0; i < n; i++) push((i - (n - 1) / 2) * 40, -900, 5 + lvl * .6, w.damage + Math.floor((lvl - 1) / 2));
		}
	}
	grabPickup(p) {
		if (p.isBomb) {
			if (this.bombs < this.maxBombs) {
				this.bombs++;
				this.addText(p.x, p.y, "+BOMBA", "#ff8a00", 24);
				this.burst(p.x, p.y, "#ff8a00", 16);
				this.pushHud();
			}
			return;
		}
		if (p.weapon === this.weapon) {
			this.weaponLevel = Math.min(3, this.weaponLevel + 1);
			this.consecutivePickups++;
			if (this.consecutivePickups >= 3) {
				this.blockedWeapon = this.weapon;
				this.consecutivePickups = 0;
				this.addText(p.x, p.y - 20, "¡BLOQUEADO!", "#ff2d55", 18);
			}
			const max = this.weaponLevel >= 3;
			this.addText(p.x, p.y, max ? "MÁX Lv" + this.weaponLevel : "NIVEL " + this.weaponLevel, WEAPONS[p.weapon].color, 24);
		} else {
			if (this.blockedWeapon === p.weapon) {
				this.blockedWeapon = null;
				this.addText(p.x, p.y - 20, "¡DESBLOQUEADO!", "#7cff3f", 18);
			}
			this.weapon = p.weapon;
			this.weaponLevel = 1;
			this.consecutivePickups = 1;
			this.addText(p.x, p.y, WEAPONS[p.weapon].name + "!", WEAPONS[p.weapon].color, 26);
		}
		this.burst(p.x, p.y, WEAPONS[p.weapon].color, 16);
		this.pushHud();
	}
	kill(e) {
		const idx = this.enemies.indexOf(e);
		if (idx >= 0) this.enemies.splice(idx, 1);
		this.kills++;
		this.combo++;
		this.bestCombo = Math.max(this.bestCombo, this.combo);
		const mult = 1 + Math.min(this.combo, 20) * .2;
		const gain = Math.round((e.big ? 140 : 60) * mult);
		this.score += gain;
		this.addText(e.x, e.y - 30, "+" + gain, "#ffe000", 20 + Math.min(this.combo, 10));
		this.burst(e.x, e.y, e.color, e.big ? 26 : 14);
		this.shake = Math.max(this.shake, e.big ? 9 : 4);
	}
	addText(x, y, text, color, size) {
		this.texts.push({
			x,
			y,
			text,
			color,
			size,
			age: 0
		});
	}
	burst(x, y, color, n) {
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
				life: rand(.3, .7)
			});
		}
	}
	spawnEnemy(x, big) {
		const stageDiff = this.getStageDifficulty();
		const heat = this.heat;
		const size = big ? rand(1.6, 2) + heat * .55 : rand(.85, 1.05) + heat * .2;
		const hp = Math.ceil(((big ? 8 : 2) + this.level * .9) * stageDiff.enemyHealthMult * (1 + heat * .4));
		this.enemies.push({
			x,
			y: -60,
			vx: rand(-26, 26) * stageDiff.enemySpeedMult * (1 + heat * .5),
			vy: (rand(34, 52) + this.level * 4) * stageDiff.enemySpeedMult * (1 + heat * .4),
			hp,
			maxHp: hp,
			size,
			big,
			fireIn: rand(1, 2.4) * stageDiff.enemyFireRateMult / (1 + heat * .3),
			hitFlash: 0,
			color: big ? "#ff2d55" : ENEMY_COLORS[Math.floor(Math.random() * ENEMY_COLORS.length)],
			bob: Math.random() * 6
		});
	}
	/** Waves grow with the dynamic difficulty curve: 1 enemy, then 2, 3... */
	spawnWave() {
		const stageDiff = this.getStageDifficulty();
		const heat = this.heat;
		if (this.enemies.length >= stageDiff.maxEnemies) {
			this.waveIn = 1;
			return;
		}
		const baseCount = stageDiff.baseWaveSize;
		const maxCount = stageDiff.maxWaveSize;
		const count = Math.min(maxCount, Math.max(baseCount, Math.round(baseCount + (this.wave - 1) * .3 + heat * 2)));
		const availableSlots = stageDiff.maxEnemies - this.enemies.length;
		const actualCount = Math.min(count, availableSlots);
		if (actualCount <= 0) {
			this.waveIn = .5;
			return;
		}
		const bigChance = Math.min(stageDiff.bigEnemyChance + heat * .3, .4);
		for (let i = 0; i < actualCount; i++) {
			let x;
			if (this.stage >= 2) {
				const safeDistance = 120;
				let attempts = 0;
				do {
					x = rand(50, 370);
					attempts++;
				} while (Math.abs(x - this.playerX) < safeDistance && attempts < 10);
			} else x = (i + 1) / (actualCount + 1) * 320 + 50 + rand(-16, 16);
			this.spawnEnemy(x, Math.random() < bigChance);
		}
		if (actualCount > 1) this.addText(420 / 2, 150, "OLEADA x" + actualCount, "#22e6ff", 22);
		this.wave++;
		this.waveIn = Math.max(.8, (3 - this.wave * .08) * stageDiff.waveSpawnRateMult * (1 - heat * .3));
	}
	spawnPickup() {
		const bombChance = this.getStageDifficulty().bombSpawnChance;
		if (Math.random() < bombChance && this.bombs < this.maxBombs) {
			this.pickups.push({
				x: rand(60, 360),
				y: -40,
				weapon: "basic",
				spin: 0,
				isBomb: true
			});
			return;
		}
		let pool = [
			"multi",
			"laser",
			"fire"
		].filter((w) => !(w === this.weapon && this.weaponLevel >= 3));
		if (this.blockedWeapon && pool.includes(this.blockedWeapon)) pool = pool.filter((w) => w !== this.blockedWeapon);
		if (pool.length === 0) return;
		this.pickups.push({
			x: rand(60, 360),
			y: -40,
			weapon: pool[Math.floor(Math.random() * pool.length)],
			spin: 0,
			isBomb: false
		});
	}
	startBoss() {
		const cfg = BOSSES[Math.min(this.stage, MAX_STAGE) - 1];
		const hp = cfg.hp;
		for (const e of this.enemies) this.burst(e.x, e.y, e.color, 12);
		this.enemies = [];
		this.eBullets = [];
		this.boss = {
			cfg,
			x: 420 / 2,
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
			rage: false
		};
		this.shake = 14;
		this.addText(420 / 2, 260, "¡JEFE!", "#ffe000", 46);
		this.addText(420 / 2, 310, cfg.name, cfg.color, 24);
		this.pushHud();
	}
	defeatBoss() {
		const b = this.boss;
		if (!b) return;
		for (let i = 0; i < 6; i++) this.burst(b.x + rand(-50, 50), b.y + rand(-40, 40), i % 2 ? b.cfg.accent : b.cfg.color, 26);
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
		this.dodges = this.maxDodges;
		this.bombs = this.maxBombs;
		this.dodgeActive = false;
		this.dodgeTime = 0;
		this.dodgeCooldown = 0;
		this.addText(420 / 2, 300, "ETAPA " + this.stage, "#22e6ff", 44);
		this.pushHud();
	}
	bossShootFan(b) {
		const stageDiff = this.getStageDifficulty();
		const n = b.rage ? b.cfg.fan + 2 : b.cfg.fan;
		const sp = (220 + this.stage * 22 + (b.rage ? 60 : 0)) * stageDiff.projectileSpeedMult;
		const base = Math.atan2(PLAYER_Y - b.y, this.playerX - b.x);
		for (let i = 0; i < n; i++) {
			const a = base + (i - (n - 1) / 2) * .18;
			this.eBullets.push({
				x: b.x,
				y: b.y + 30,
				vx: Math.cos(a) * sp,
				vy: Math.sin(a) * sp
			});
		}
	}
	updateBoss(dt) {
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
		if (!b.rage && b.cfg.phases && b.hp < b.maxHp * .5) {
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
		if (b.x > 350) {
			b.x = 350;
			b.vx *= -1;
		}
		b.y = 130 + Math.sin(b.t * 1.4) * 16;
		b.fireIn -= dt;
		if (b.fireIn <= 0) {
			b.fireIn = b.cfg.fanEvery * stageDiff.bossAttackSpeedMult * (b.rage ? .7 : 1);
			this.bossShootFan(b);
		}
		if (b.cfg.spiral) {
			b.spiralA += dt * 3.4;
			if (Math.floor(b.spiralA / .5) !== Math.floor((b.spiralA - dt * 3.4) / .5)) {
				const sp = (200 + this.stage * 14) * stageDiff.projectileSpeedMult;
				for (let k = 0; k < 3; k++) {
					const a = b.spiralA + k * Math.PI * 2 / 3;
					this.eBullets.push({
						x: b.x,
						y: b.y,
						vx: Math.cos(a) * sp,
						vy: Math.abs(Math.sin(a)) * sp + 90
					});
				}
			}
		}
		if (b.cfg.beams) {
			b.beamIn -= dt;
			if (b.beamIn <= 0) {
				b.beamIn = ((b.rage ? 2.4 : 3.6) - this.stage * .15) * stageDiff.bossAttackSpeedMult;
				this.beams.push({
					x: this.playerX,
					charge: .85,
					active: 0
				});
			}
		}
		if (b.cfg.missiles) {
			b.missileIn -= dt;
			if (b.missileIn <= 0) {
				b.missileIn = (b.rage ? 1.9 : 2.8) * stageDiff.bossAttackSpeedMult;
				for (const ox of [-42, 42]) this.missiles.push({
					x: b.x + ox,
					y: b.y + 20,
					vx: 0,
					vy: 120
				});
			}
		}
		if (b.cfg.summon) {
			b.summonIn -= dt;
			if (b.summonIn <= 0) {
				b.summonIn = 9;
				this.spawnEnemy(rand(70, 350), false);
				this.spawnEnemy(rand(70, 350), false);
			}
		}
		for (let i = this.pBullets.length - 1; i >= 0; i--) {
			const p = this.pBullets[i];
			if (Math.abs(p.x - b.x) < 56 && Math.abs(p.y - b.y) < 44) {
				b.hp -= p.dmg;
				b.hitFlash = .1;
				this.burst(p.x, p.y, WEAPONS[p.kind].glow, 4);
				if (p.kind !== "laser") this.pBullets.splice(i, 1);
				if (b.hp <= 0) {
					this.defeatBoss();
					return;
				}
			}
		}
		for (let i = this.beams.length - 1; i >= 0; i--) {
			const beam = this.beams[i];
			if (beam.charge > 0) {
				beam.charge -= dt;
				if (beam.charge <= 0) {
					beam.active = .6;
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
		for (let i = this.missiles.length - 1; i >= 0; i--) {
			const m = this.missiles[i];
			const d = Math.hypot(this.playerX - m.x, PLAYER_Y - m.y) || 1;
			const acc = (260 + this.stage * 30) * stageDiff.projectileSpeedMult;
			m.vx += (this.playerX - m.x) / d * acc * dt;
			m.vy += (PLAYER_Y - m.y) / d * acc * dt;
			const sp = Math.hypot(m.vx, m.vy);
			const cap = (250 + this.stage * 20) * stageDiff.projectileSpeedMult;
			if (sp > cap) {
				m.vx = m.vx / sp * cap;
				m.vy = m.vy / sp * cap;
			}
			m.x += m.vx * dt;
			m.y += m.vy * dt;
			if (Math.hypot(m.x - this.playerX, m.y - PLAYER_Y) < 30) {
				this.missiles.splice(i, 1);
				this.damagePlayer((14 + this.stage * 2) * stageDiff.bossDamageMult);
				if (!this.running) return;
				continue;
			}
			if (m.y > 800 || m.y < -80 || m.x < -60 || m.x > 480) this.missiles.splice(i, 1);
		}
	}
	damagePlayer(dmg) {
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
	update(dt) {
		this.elapsed += dt;
		this.shootCd -= dt;
		this.muzzle -= dt;
		this.thrust += dt * 18;
		this.shake *= .86;
		this.dodgeCooldown -= dt;
		const stageDiff = this.getStageDifficulty();
		const dx = this.targetX - this.playerX;
		this.playerX += dx * Math.min(1, dt * 12);
		this.tilt = Math.max(-.4, Math.min(.4, dx / 90));
		if (this.dodgeActive) {
			this.dodgeTime -= dt;
			if (this.dodgeTime <= 0) this.dodgeActive = false;
		}
		this.lastRegenTime += dt;
		if (this.lastRegenTime >= stageDiff.healthRegenInterval && this.hp < this.maxHp) {
			const regenAmount = stageDiff.healthRegenAmount + this.level * .5;
			this.hp = Math.min(this.maxHp, this.hp + regenAmount);
			this.lastRegenTime = 0;
			if (this.hp > 0 && this.hp < this.maxHp) this.addText(this.playerX, 644, "+" + Math.round(regenAmount), "#7cff3f", 16);
		}
		const bossFight = !!this.boss;
		if (!bossFight) this.time -= dt;
		if (!bossFight && this.level >= 5 && this.time <= LEVEL_TIME / 2) this.startBoss();
		if (!bossFight && this.time <= 0) {
			this.level++;
			this.time = LEVEL_TIME;
			this.score += 250;
			this.hp = Math.min(this.maxHp, this.hp + 20);
			this.addText(420 / 2, 320, "NIVEL " + this.level, "#22e6ff", 40);
		}
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
		for (const s of this.stars) {
			s.y += (30 + s.z * 120) * dt;
			if (s.y > 760) {
				s.y = -4;
				s.x = Math.random() * 420;
			}
		}
		for (const e of this.enemies) {
			e.y += e.vy * dt;
			e.x += e.vx * dt;
			if (e.x < 40 || e.x > 380) e.vx *= -1;
			e.bob += dt * 6;
			e.hitFlash -= dt;
			e.fireIn -= dt;
			if (e.fireIn <= 0 && e.y > 40) {
				e.fireIn = rand(1.4, 3) * stageDiff.enemyFireRateMult / (1 + this.level * .1 + this.heat * .5);
				const d = Math.hypot(this.playerX - e.x, PLAYER_Y - e.y) || 1;
				const sp = (230 + this.level * 16) * stageDiff.projectileSpeedMult * (1 + this.heat * .3);
				this.eBullets.push({
					x: e.x,
					y: e.y + 20 * e.size,
					vx: (this.playerX - e.x) / d * sp,
					vy: (PLAYER_Y - e.y) / d * sp
				});
			}
		}
		for (let i = this.enemies.length - 1; i >= 0; i--) {
			const e = this.enemies[i];
			if (e.y > 700) {
				this.enemies.splice(i, 1);
				this.damagePlayer((e.big ? 26 : 12) * stageDiff.enemyDamageMult);
				if (!this.running) return;
			}
		}
		for (let i = this.pBullets.length - 1; i >= 0; i--) {
			const b = this.pBullets[i];
			b.life += dt;
			b.x += b.vx * dt;
			b.y += b.vy * dt;
			if (b.y < -30 || b.x < -30 || b.x > 450) {
				this.pBullets.splice(i, 1);
				continue;
			}
			let hit = false;
			for (const e of this.enemies) {
				const rr = 26 * e.size + b.r;
				if (Math.hypot(e.x - b.x, e.y - b.y) < rr) {
					e.hp -= b.dmg;
					e.hitFlash = .14;
					this.burst(b.x, b.y, WEAPONS[b.kind].glow, 4);
					if (e.hp <= 0) this.kill(e);
					hit = true;
					break;
				}
			}
			if (hit && b.kind !== "laser") this.pBullets.splice(i, 1);
		}
		for (let i = this.pickups.length - 1; i >= 0; i--) {
			const p = this.pickups[i];
			p.y += 90 * dt;
			p.spin += dt * 3;
			if (Math.hypot(p.x - this.playerX, p.y - PLAYER_Y) < 52) {
				this.pickups.splice(i, 1);
				this.grabPickup(p);
				continue;
			}
			if (p.y > 800) this.pickups.splice(i, 1);
		}
		for (let i = this.eBullets.length - 1; i >= 0; i--) {
			const b = this.eBullets[i];
			b.x += b.vx * dt;
			b.y += b.vy * dt;
			if (Math.hypot(b.x - this.playerX, b.y - PLAYER_Y) < 30) {
				if (!this.dodgeActive) {
					this.eBullets.splice(i, 1);
					this.damagePlayer((7 + this.level * 1.4) * stageDiff.enemyDamageMult);
					if (!this.running) return;
					continue;
				}
			}
			if (b.y > 780 || b.x < -30 || b.x > 450) this.eBullets.splice(i, 1);
		}
		for (let i = this.parts.length - 1; i >= 0; i--) {
			const p = this.parts[i];
			p.age += dt;
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.vy += 220 * dt;
			if (p.age > p.life) this.parts.splice(i, 1);
		}
		for (let i = this.texts.length - 1; i >= 0; i--) {
			const t = this.texts[i];
			t.age += dt;
			t.y -= 40 * dt;
			if (t.age > 1) this.texts.splice(i, 1);
		}
		this.hudAcc += dt;
		if (this.hudAcc > .1) {
			this.hudAcc = 0;
			this.pushHud();
		}
	}
	drawSpace(c) {
		const g = c.createLinearGradient(0, 0, 0, 760);
		g.addColorStop(0, "#0a0618");
		g.addColorStop(.55, "#160a2e");
		g.addColorStop(1, "#2a0f3e");
		c.fillStyle = g;
		c.fillRect(0, 0, 420, 760);
		const neb = c.createRadialGradient(294, 167.2, 10, 294, 167.2, 300);
		neb.addColorStop(0, "rgba(168,85,247,0.35)");
		neb.addColorStop(1, "rgba(168,85,247,0)");
		c.fillStyle = neb;
		c.fillRect(0, 0, 420, 760);
		const neb2 = c.createRadialGradient(84, 471.2, 10, 84, 471.2, 260);
		neb2.addColorStop(0, "rgba(34,230,255,0.22)");
		neb2.addColorStop(1, "rgba(34,230,255,0)");
		c.fillStyle = neb2;
		c.fillRect(0, 0, 420, 760);
		for (const s of this.stars) {
			c.globalAlpha = .25 + s.z * .75;
			c.fillStyle = "#ffffff";
			c.fillRect(s.x, s.y, 2 * s.z, 2 + s.z * 6);
		}
		c.globalAlpha = 1;
		c.strokeStyle = "rgba(255,78,205,0.25)";
		c.lineWidth = 1.5;
		for (let i = 0; i <= 10; i++) {
			const x = i / 10 * 420;
			c.beginPath();
			c.moveTo(x, 760);
			c.lineTo(420 / 2 + (x - 420 / 2) * .15, 560);
			c.stroke();
		}
		for (let k = 1; k <= 6; k++) {
			const y = 560 + Math.pow(k / 6, 2.2) * 200;
			c.beginPath();
			c.moveTo(0, y);
			c.lineTo(420, y);
			c.stroke();
		}
	}
	drawEnemy(c, e) {
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
			c.fillRect(-40 / 2 - 2, -34, 44, 7);
			c.fillStyle = e.big ? "#ffe000" : "#7cff3f";
			c.fillRect(-40 / 2, -32, pw * Math.max(0, e.hp) / e.maxHp, 3);
		}
		c.restore();
	}
	drawShip(c) {
		const w = WEAPONS[this.weapon];
		c.save();
		c.translate(this.playerX, PLAYER_Y);
		if (this.dodgeActive) {
			const dodgeProgress = 1 - this.dodgeTime / this.dodgeDuration;
			c.rotate(dodgeProgress * Math.PI * 2);
		} else c.rotate(this.tilt * .5);
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
		if (this.dodgeActive) {
			c.shadowColor = "#7cff3f";
			c.shadowBlur = 30;
		} else {
			c.shadowColor = w.color;
			c.shadowBlur = 22;
		}
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
		c.fillStyle = w.color;
		c.beginPath();
		c.ellipse(0, -8, 7, 13, 0, 0, Math.PI * 2);
		c.fill();
		c.stroke();
		if (this.muzzle > 0) {
			c.fillStyle = w.glow;
			c.globalAlpha = .85;
			c.beginPath();
			c.ellipse(0, -40, 12, 18, 0, 0, Math.PI * 2);
			c.fill();
			c.globalAlpha = 1;
		}
		c.restore();
	}
	drawPBullet(c, b) {
		const w = WEAPONS[b.kind];
		c.save();
		c.shadowColor = w.color;
		c.shadowBlur = 16;
		if (b.kind === "laser") {
			const g = c.createLinearGradient(0, b.y - 60, 0, b.y + 20);
			g.addColorStop(0, "rgba(124,255,63,0)");
			g.addColorStop(.5, w.color);
			g.addColorStop(1, w.glow);
			c.fillStyle = g;
			c.fillRect(b.x - b.r / 2, b.y - 60, b.r, 80);
		} else if (b.kind === "fire") {
			const flick = .8 + Math.sin(b.life * 40) * .2;
			c.fillStyle = "#ff6b1a";
			c.beginPath();
			c.arc(b.x, b.y, b.r * flick, 0, Math.PI * 2);
			c.fill();
			c.fillStyle = "#ffe000";
			c.beginPath();
			c.arc(b.x, b.y + 2, b.r * .5 * flick, 0, Math.PI * 2);
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
	drawPickup(c, p) {
		c.save();
		c.translate(p.x, p.y);
		c.rotate(Math.sin(p.spin) * .3);
		if (p.isBomb) {
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
			c.fillStyle = "#ff8a00";
			c.beginPath();
			c.arc(0, -4, 12, 0, Math.PI * 2);
			c.fill();
			c.fillStyle = "#ff6b1a";
			c.beginPath();
			c.arc(0, -4, 6, 0, Math.PI * 2);
			c.fill();
			c.strokeStyle = "#ffe000";
			c.lineWidth = 2;
			c.beginPath();
			c.moveTo(0, -16);
			c.quadraticCurveTo(8, -24, 12, -20);
			c.stroke();
			c.font = "900 10px \"Bungee\", system-ui, sans-serif";
			c.textAlign = "center";
			c.fillStyle = "#ff8a00";
			c.fillText("BOMBA", 0, 24);
		} else {
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
			if (p.weapon === "multi") for (let i = 0; i < 5; i++) c.fillRect(-16 + i * 8, -10, 3, 20);
			else if (p.weapon === "laser") {
				c.fillRect(-4, -16, 8, 32);
				c.globalAlpha = .5;
				c.fillRect(-9, -16, 18, 32);
				c.globalAlpha = 1;
			} else {
				c.beginPath();
				c.moveTo(0, -16);
				c.quadraticCurveTo(12, 0, 0, 16);
				c.quadraticCurveTo(-12, 0, 0, -16);
				c.fill();
			}
			c.font = "900 10px \"Bungee\", system-ui, sans-serif";
			c.textAlign = "center";
			c.fillText(w.name, 0, 24);
		}
		c.restore();
	}
	drawBoss(c) {
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
		c.fillStyle = b.cfg.accent;
		c.beginPath();
		c.roundRect(-72, -6, 22, 26, 6);
		c.roundRect(50, -6, 22, 26, 6);
		c.fill();
		c.stroke();
		const pulse = .7 + Math.sin(b.t * 6) * .3;
		c.fillStyle = b.rage ? "#ff2d55" : b.cfg.accent;
		c.globalAlpha = pulse;
		c.beginPath();
		c.ellipse(0, -2, 18, 14, 0, 0, Math.PI * 2);
		c.fill();
		c.globalAlpha = 1;
		c.stroke();
		c.restore();
	}
	drawBossWeapons(c) {
		for (const beam of this.beams) {
			c.save();
			if (beam.charge > 0) {
				c.globalAlpha = .35 + Math.sin(beam.charge * 40) * .2;
				c.fillStyle = "#ffe000";
				c.fillRect(beam.x - 3, 0, 6, 760);
			} else {
				const g = c.createLinearGradient(beam.x - 22, 0, beam.x + 22, 0);
				g.addColorStop(0, "rgba(255,45,85,0)");
				g.addColorStop(.5, "#ff2d55");
				g.addColorStop(1, "rgba(255,45,85,0)");
				c.fillStyle = g;
				c.shadowColor = "#ff2d55";
				c.shadowBlur = 26;
				c.fillRect(beam.x - 24, 0, 48, 760);
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
	render() {
		const c = this.ctx;
		c.save();
		if (this.shake > .4) c.translate(rand(-this.shake, this.shake), rand(-this.shake, this.shake));
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
	loop = (now) => {
		if (!this.running) return;
		const dt = Math.min(.05, (now - this.last) / 1e3);
		this.last = now;
		this.update(dt);
		this.render();
		if (this.running) this.raf = requestAnimationFrame(this.loop);
	};
};
var emptyHud = {
	score: 0,
	combo: 0,
	best: 0,
	hp: 100,
	maxHp: 100,
	time: 45,
	stage: 1,
	level: 1,
	wave: 1,
	weapon: "basic",
	weaponLevel: 1,
	kills: 0,
	heat: 0,
	bossActive: false,
	bossName: "",
	bossHp: 0,
	bossMaxHp: 0,
	dodges: 3,
	bombs: 2
};
function NeonStreetShooter() {
	const canvasRef = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	const dragging = (0, import_react.useRef)(false);
	const [screen, setScreen] = (0, import_react.useState)("menu");
	const [hud, setHud] = (0, import_react.useState)(emptyHud);
	const [best, setBest] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = 420 * dpr;
		canvas.height = 760 * dpr;
		ctx.scale(dpr, dpr);
		const stored = Number(window.localStorage.getItem("nss-best") || 0);
		setBest(stored);
		const game = new Game(ctx, (h) => setHud(h), (score) => {
			setScreen("gameover");
			setBest((b) => {
				const nb = Math.max(b, score);
				window.localStorage.setItem("nss-best", String(nb));
				return nb;
			});
		}, stored, (score) => {
			setScreen("victory");
			setBest((b) => {
				const nb = Math.max(b, score);
				window.localStorage.setItem("nss-best", String(nb));
				return nb;
			});
		});
		gameRef.current = game;
		return () => game.stop();
	}, []);
	(0, import_react.useEffect)(() => {
		const step = 34;
		const onKey = (e) => {
			const g = gameRef.current;
			if (!g || screen !== "playing") return;
			if (e.key === "ArrowLeft" || e.key === "a") g.moveTo(g.targetX - step);
			if (e.key === "ArrowRight" || e.key === "d") g.moveTo(g.targetX + step);
			if (e.key === " " || e.key === "Spacebar") {
				e.preventDefault();
				g.triggerDodge();
			}
			if (e.key === "q" || e.key === "Q") {
				e.preventDefault();
				g.triggerBomb();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [screen]);
	const play = (0, import_react.useCallback)(() => {
		setScreen("playing");
		gameRef.current?.start();
	}, []);
	const toCanvasX = (clientX, el) => {
		const rect = el.getBoundingClientRect();
		return (clientX - rect.left) / rect.width * 420;
	};
	const onPointerDown = (e) => {
		if (screen !== "playing") return;
		dragging.current = true;
		e.currentTarget.setPointerCapture(e.pointerId);
		gameRef.current?.moveTo(toCanvasX(e.clientX, e.currentTarget));
	};
	const onPointerMove = (e) => {
		if (screen !== "playing" || !dragging.current) return;
		gameRef.current?.moveTo(toCanvasX(e.clientX, e.currentTarget));
	};
	const endDrag = () => {
		dragging.current = false;
	};
	const hpPct = hud.hp / hud.maxHp * 100;
	const weapon = WEAPONS[hud.weapon];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh w-full items-center justify-center bg-[var(--gradient-street)] p-2 sm:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-[420px] overflow-hidden rounded-2xl comic-outline-lg",
			style: { aspectRatio: `420 / 760` },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					onPointerDown,
					onPointerMove,
					onPointerUp: endDrag,
					onPointerCancel: endDrag,
					onPointerLeave: endDrag,
					className: "absolute inset-0 h-full w-full touch-none select-none",
					style: {
						width: "100%",
						height: "100%"
					}
				}),
				screen === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute inset-x-0 top-0 p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-5 w-full comic-outline overflow-hidden rounded-full bg-ink",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-destructive transition-[width] duration-150",
											style: { width: `${hpPct}%` }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 flex gap-1",
										children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-2 flex-1 rounded-full border-2 border-ink",
											style: { background: i < hud.weaponLevel ? weapon.color : "rgba(0,0,0,0.55)" }
										}, i))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "comic-outline rounded bg-ink px-2 py-1 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg leading-none text-accent",
										children: hud.bossActive ? "JEFE" : `${hud.time}s`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] font-bold tracking-widest text-cyan",
										children: [
											"ETAPA ",
											hud.stage,
											"/",
											MAX_STAGE,
											" · N",
											hud.level,
											"/",
											5
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center justify-between",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "comic-outline rounded bg-primary px-2 py-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-xl leading-none text-primary-foreground text-stroke",
											children: hud.score
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "comic-outline rounded bg-ink px-2 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-display text-[10px] leading-none text-cyan",
												children: "GIROS"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-display text-sm leading-none text-accent",
												children: [hud.dodges, "/3"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "comic-outline rounded bg-ink px-2 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-display text-[10px] leading-none text-cyan",
												children: "BOMBAS"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-display text-sm leading-none text-accent",
												children: [hud.bombs, "/2"]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "comic-outline rounded px-2 py-1",
										style: { background: weapon.color },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-display text-xs leading-none text-ink",
											children: [
												weapon.name,
												" · Lv",
												hud.weaponLevel,
												hud.weaponLevel >= 3 ? " MÁX" : ""
											]
										})
									})
								]
							}),
							hud.bossActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 animate-pop-in",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center font-display text-xs tracking-widest text-destructive text-stroke",
									children: hud.bossName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "comic-outline mt-1 h-4 w-full overflow-hidden rounded-full bg-ink",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full transition-[width] duration-150",
										style: {
											width: `${hud.bossMaxHp ? hud.bossHp / hud.bossMaxHp * 100 : 0}%`,
											background: "linear-gradient(90deg,#ffe000,#ff8a00,#ff2d55)"
										}
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-[9px] tracking-widest text-cyan",
									children: "INTENSIDAD"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "comic-outline h-2.5 flex-1 overflow-hidden rounded-full bg-ink",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full transition-[width] duration-300",
										style: {
											width: `${Math.round(hud.heat * 100)}%`,
											background: "linear-gradient(90deg,#22e6ff,#ffe000,#ff2d55)"
										}
									})
								})]
							})
						]
					}),
					hud.combo > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute left-1/2 top-[22%] -translate-x-1/2 animate-pop-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-stroke text-center leading-none text-accent",
							style: { fontSize: `${Math.min(72, 28 + hud.combo * 3)}px` },
							children: ["x", hud.combo]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center font-display text-sm text-cyan text-stroke",
							children: "COMBO"
						})]
					}, hud.combo),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pointer-events-none absolute inset-x-0 bottom-16 text-center font-display text-[10px] tracking-widest text-cyan/70",
						children: "DESLIZA PARA MOVER · DISPARO AUTOMÁTICO"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute inset-x-0 bottom-2 flex justify-between px-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: (e) => {
								e.stopPropagation();
								gameRef.current?.triggerDodge();
							},
							className: "pointer-events-auto comic-outline rounded-lg bg-ink/80 px-3 py-2 font-display text-xs text-cyan backdrop-blur-sm active:scale-95 transition-transform",
							children: [
								"ESPACIO",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"GIRO"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: (e) => {
								e.stopPropagation();
								gameRef.current?.triggerBomb();
							},
							className: "pointer-events-auto comic-outline rounded-lg bg-ink/80 px-3 py-2 font-display text-xs text-accent backdrop-blur-sm active:scale-95 transition-transform",
							children: [
								"Q",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"BOMBA"
							]
						})]
					})
				] }),
				screen === "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 flex flex-col items-center justify-center gap-6 bg-ink/80 p-6 text-center backdrop-blur-[2px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-tilt",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-4xl leading-none text-cyan text-stroke",
									children: "NEÓN"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-5xl leading-none text-primary text-stroke",
									children: "STRIKE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-4xl leading-none text-accent text-stroke",
									children: "SHOOTER"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "max-w-[290px] text-sm font-semibold text-cyan",
							children: [
								"Desliza para mover tu nave. Disparos automáticos. ESPACIO: giro evasivo (3 por etapa). Q: bomba (máx 2). Atrapa MULTI, LÁSER y FUEGO: repetir el mismo bonus sube el nivel hasta ",
								3,
								". ",
								MAX_STAGE,
								" etapas, cada una termina con un jefe distinto."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: play,
							className: "comic-outline-lg rounded-full bg-accent px-10 py-4 font-display text-2xl text-ink transition-transform active:translate-y-1",
							children: "JUGAR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-xs text-muted-foreground",
							children: ["RÉCORD: ", best]
						})
					]
				}),
				screen === "gameover" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/85 p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-5xl leading-none text-destructive text-stroke animate-pop-in",
							children: "K.O."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "comic-outline w-full max-w-[260px] rounded bg-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xs text-cyan",
									children: "PUNTAJE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-4xl text-accent text-stroke",
									children: hud.score
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-3 gap-2 text-xs font-bold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground",
											children: "ETAPA"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-display text-lg text-primary",
											children: [
												hud.stage,
												"-",
												hud.level
											]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground",
											children: "BAJAS"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-lg text-primary",
											children: hud.kills
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground",
											children: "RÉCORD"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-lg text-primary",
											children: best
										})] })
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: play,
							className: "comic-outline-lg rounded-full bg-primary px-8 py-3 font-display text-xl text-primary-foreground transition-transform active:translate-y-1",
							children: "REINTENTAR"
						})
					]
				}),
				screen === "victory" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/85 p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-4xl leading-none text-accent text-stroke animate-pop-in",
							children: "¡VICTORIA!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm text-cyan",
							children: "5 ETAPAS · 5 JEFES DERROTADOS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "comic-outline w-full max-w-[260px] rounded bg-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xs text-cyan",
									children: "PUNTAJE FINAL"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-4xl text-accent text-stroke",
									children: hud.score
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-2 gap-2 text-xs font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: "BAJAS"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg text-primary",
										children: hud.kills
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: "RÉCORD"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg text-primary",
										children: best
									})] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: play,
							className: "comic-outline-lg rounded-full bg-accent px-8 py-3 font-display text-xl text-ink transition-transform active:translate-y-1",
							children: "JUGAR DE NUEVO"
						})
					]
				})
			]
		})
	});
}
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NeonStreetShooter, {});
}
//#endregion
export { Index as component };
