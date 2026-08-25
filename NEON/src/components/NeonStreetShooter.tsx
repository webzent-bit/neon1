import { useCallback, useEffect, useRef, useState } from "react";
import { Game, H, W } from "@/game/engine";
import { LEVELS_PER_STAGE, MAX_STAGE } from "@/game/bosses";
import { MAX_WEAPON_LEVEL, WEAPONS, type HudState, type Screen } from "@/game/types";

const emptyHud: HudState = {
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
  bombs: 2,
};


export default function NeonStreetShooter() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);
  const dragging = useRef(false);
  const [screen, setScreen] = useState<Screen>("menu");
  const [hud, setHud] = useState<HudState>(emptyHud);
  const [best, setBest] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const stored = Number(window.localStorage.getItem("nss-best") || 0);
    setBest(stored);
    const game = new Game(
      ctx,
      (h) => setHud(h),
      (score) => {
        setScreen("gameover");
        setBest((b) => {
          const nb = Math.max(b, score);
          window.localStorage.setItem("nss-best", String(nb));
          return nb;
        });
      },
      stored,
      (score) => {
        setScreen("victory");
        setBest((b) => {
          const nb = Math.max(b, score);
          window.localStorage.setItem("nss-best", String(nb));
          return nb;
        });
      },
    );

    gameRef.current = game;
    return () => game.stop();
  }, []);

  // Keyboard controls for desktop
  useEffect(() => {
    const step = 34;
    const onKey = (e: KeyboardEvent) => {
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

  const play = useCallback(() => {
    setScreen("playing");
    gameRef.current?.start();
  }, []);

  const toCanvasX = (clientX: number, el: HTMLCanvasElement) => {
    const rect = el.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * W;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (screen !== "playing") return;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    gameRef.current?.moveTo(toCanvasX(e.clientX, e.currentTarget));
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (screen !== "playing" || !dragging.current) return;
    gameRef.current?.moveTo(toCanvasX(e.clientX, e.currentTarget));
  };

  const endDrag = () => {
    dragging.current = false;
  };

  const hpPct = (hud.hp / hud.maxHp) * 100;
  const weapon = WEAPONS[hud.weapon];

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-[var(--gradient-street)] p-2 sm:p-6">
      <div
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl comic-outline-lg"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          className="absolute inset-0 h-full w-full touch-none select-none"
          style={{ width: "100%", height: "100%" }}
        />

        {screen === "playing" && (
          <>
            {/* Top HUD */}
            <div className="pointer-events-none absolute inset-x-0 top-0 p-2">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="h-5 w-full comic-outline overflow-hidden rounded-full bg-ink">
                    <div
                      className="h-full bg-destructive transition-[width] duration-150"
                      style={{ width: `${hpPct}%` }}
                    />
                  </div>
                  <div className="mt-1 flex gap-1">
                    {Array.from({ length: MAX_WEAPON_LEVEL }).map((_, i) => (
                      <div
                        key={i}
                        className="h-2 flex-1 rounded-full border-2 border-ink"
                        style={{
                          background: i < hud.weaponLevel ? weapon.color : "rgba(0,0,0,0.55)",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="comic-outline rounded bg-ink px-2 py-1 text-center">
                  <p className="font-display text-lg leading-none text-accent">
                    {hud.bossActive ? "JEFE" : `${hud.time}s`}
                  </p>
                  <p className="text-[10px] font-bold tracking-widest text-cyan">
                    ETAPA {hud.stage}/{MAX_STAGE} · N{hud.level}/{LEVELS_PER_STAGE}
                  </p>
                </div>

              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="comic-outline rounded bg-primary px-2 py-1">
                  <p className="font-display text-xl leading-none text-primary-foreground text-stroke">
                    {hud.score}
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="comic-outline rounded bg-ink px-2 py-1">
                    <p className="font-display text-[10px] leading-none text-cyan">GIROS</p>
                    <p className="font-display text-sm leading-none text-accent">
                      {hud.dodges}/3
                    </p>
                  </div>
                  <div className="comic-outline rounded bg-ink px-2 py-1">
                    <p className="font-display text-[10px] leading-none text-cyan">BOMBAS</p>
                    <p className="font-display text-sm leading-none text-accent">
                      {hud.bombs}/2
                    </p>
                  </div>
                </div>
                <div
                  className="comic-outline rounded px-2 py-1"
                  style={{ background: weapon.color }}
                >
                  <p className="font-display text-xs leading-none text-ink">
                    {weapon.name} · Lv{hud.weaponLevel}
                    {hud.weaponLevel >= MAX_WEAPON_LEVEL ? " MÁX" : ""}
                  </p>
                </div>
              </div>

              {/* Barra de vida del jefe */}
              {hud.bossActive && (
                <div className="mt-2 animate-pop-in">
                  <p className="text-center font-display text-xs tracking-widest text-destructive text-stroke">
                    {hud.bossName}
                  </p>
                  <div className="comic-outline mt-1 h-4 w-full overflow-hidden rounded-full bg-ink">
                    <div
                      className="h-full transition-[width] duration-150"
                      style={{
                        width: `${hud.bossMaxHp ? (hud.bossHp / hud.bossMaxHp) * 100 : 0}%`,
                        background: "linear-gradient(90deg,#ffe000,#ff8a00,#ff2d55)",
                      }}
                    />
                  </div>
                </div>
              )}


              {/* Curva de dificultad */}
              <div className="mt-2 flex items-center gap-2">
                <span className="font-display text-[9px] tracking-widest text-cyan">INTENSIDAD</span>
                <div className="comic-outline h-2.5 flex-1 overflow-hidden rounded-full bg-ink">
                  <div
                    className="h-full transition-[width] duration-300"
                    style={{
                      width: `${Math.round(hud.heat * 100)}%`,
                      background: "linear-gradient(90deg,#22e6ff,#ffe000,#ff2d55)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Combo */}
            {hud.combo > 1 && (
              <div
                key={hud.combo}
                className="pointer-events-none absolute left-1/2 top-[22%] -translate-x-1/2 animate-pop-in"
              >
                <p
                  className="font-display text-stroke text-center leading-none text-accent"
                  style={{ fontSize: `${Math.min(72, 28 + hud.combo * 3)}px` }}
                >
                  x{hud.combo}
                </p>
                <p className="text-center font-display text-sm text-cyan text-stroke">COMBO</p>
              </div>
            )}

            <p className="pointer-events-none absolute inset-x-0 bottom-16 text-center font-display text-[10px] tracking-widest text-cyan/70">
              DESLIZA PARA MOVER · DISPARO AUTOMÁTICO
            </p>
            
            {/* Mobile controls for dodge and bomb */}
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-between px-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  gameRef.current?.triggerDodge();
                }}
                className="pointer-events-auto comic-outline rounded-lg bg-ink/80 px-3 py-2 font-display text-xs text-cyan backdrop-blur-sm active:scale-95 transition-transform"
              >
                ESPACIO<br/>GIRO
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  gameRef.current?.triggerBomb();
                }}
                className="pointer-events-auto comic-outline rounded-lg bg-ink/80 px-3 py-2 font-display text-xs text-accent backdrop-blur-sm active:scale-95 transition-transform"
              >
                Q<br/>BOMBA
              </button>
            </div>
          </>
        )}

        {screen === "menu" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-ink/80 p-6 text-center backdrop-blur-[2px]">
            <div className="animate-tilt">
              <p className="font-display text-4xl leading-none text-cyan text-stroke">NEÓN</p>
              <h1 className="font-display text-5xl leading-none text-primary text-stroke">
                STRIKE
              </h1>
              <p className="font-display text-4xl leading-none text-accent text-stroke">SHOOTER</p>
            </div>
            <p className="max-w-[290px] text-sm font-semibold text-cyan">
              Desliza para mover tu nave. Disparos automáticos. ESPACIO: giro evasivo (3 por etapa). 
              Q: bomba (máx 2). Atrapa MULTI, LÁSER y FUEGO: repetir el mismo bonus sube el nivel 
              hasta {MAX_WEAPON_LEVEL}. {MAX_STAGE} etapas, cada una termina con un jefe distinto.
            </p>

            <button
              onClick={play}
              className="comic-outline-lg rounded-full bg-accent px-10 py-4 font-display text-2xl text-ink transition-transform active:translate-y-1"
            >
              JUGAR
            </button>
            <p className="font-display text-xs text-muted-foreground">RÉCORD: {best}</p>
          </div>
        )}

        {screen === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/85 p-6 text-center">
            <h2 className="font-display text-5xl leading-none text-destructive text-stroke animate-pop-in">
              K.O.
            </h2>
            <div className="comic-outline w-full max-w-[260px] rounded bg-card p-4">
              <p className="font-display text-xs text-cyan">PUNTAJE</p>
              <p className="font-display text-4xl text-accent text-stroke">{hud.score}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-bold">
                <div>
                  <p className="text-muted-foreground">ETAPA</p>
                  <p className="font-display text-lg text-primary">
                    {hud.stage}-{hud.level}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">BAJAS</p>
                  <p className="font-display text-lg text-primary">{hud.kills}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">RÉCORD</p>
                  <p className="font-display text-lg text-primary">{best}</p>
                </div>
              </div>
            </div>
            <button
              onClick={play}
              className="comic-outline-lg rounded-full bg-primary px-8 py-3 font-display text-xl text-primary-foreground transition-transform active:translate-y-1"
            >
              REINTENTAR
            </button>
          </div>
        )}

        {screen === "victory" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/85 p-6 text-center">
            <h2 className="font-display text-4xl leading-none text-accent text-stroke animate-pop-in">
              ¡VICTORIA!
            </h2>
            <p className="font-display text-sm text-cyan">
              5 ETAPAS · 5 JEFES DERROTADOS
            </p>
            <div className="comic-outline w-full max-w-[260px] rounded bg-card p-4">
              <p className="font-display text-xs text-cyan">PUNTAJE FINAL</p>
              <p className="font-display text-4xl text-accent text-stroke">{hud.score}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold">
                <div>
                  <p className="text-muted-foreground">BAJAS</p>
                  <p className="font-display text-lg text-primary">{hud.kills}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">RÉCORD</p>
                  <p className="font-display text-lg text-primary">{best}</p>
                </div>
              </div>
            </div>
            <button
              onClick={play}
              className="comic-outline-lg rounded-full bg-accent px-8 py-3 font-display text-xl text-ink transition-transform active:translate-y-1"
            >
              JUGAR DE NUEVO
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
