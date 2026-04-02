import { init, GameLoop } from 'kontra';

const { canvas, context: ctx } = init('missile-command-canvas');

// ── Resize ─────────────────────────────────────────────────────
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buildTerrain();
}
window.addEventListener('resize', resize);

// ── Palette ────────────────────────────────────────────────────
const C = {
  skyTop: '#060d1f',
  skyBot: '#12173d',
  star: '#c1d9f2',
  terrain: '#505b7a',
  terrainEdge: '#909edd',
  pad: '#42bc7f',
  padGlow: 'rgba(66,188,127,0.25)',
  lander: '#ffffff',
  landerAccent: '#a5e6ff',
  landerDark: '#293268',
  thrustCore: '#ffe091',
  thrustOuter: 'rgba(255,150,95,0)',
  exhaust: 'rgba(255,150,95,0.7)',
  hud: '#a5e6ff',
  success: '#8cff9b',
};

// ── Stars ──────────────────────────────────────────────────────
interface Star { x: number; y: number; r: number; phase: number; twinkle: number }
let stars: Star[] = [];
function buildStars() {
  stars = Array.from({ length: 140 }, () => ({
    x: Math.random(),
    y: Math.random() * 0.85,
    r: Math.random() * 1.4 + 0.3,
    phase: Math.random() * Math.PI * 2,
    twinkle: Math.random() * 0.4 + 0.6,
  }));
}
buildStars();

// ── Terrain ────────────────────────────────────────────────────
interface TerrainPoint { x: number; y: number }
interface LandingPad { x: number; y: number; width: number }

let terrain: TerrainPoint[] = [];
let pads: LandingPad[] = [];

function buildTerrain() {
  const w = canvas.width;
  const h = canvas.height;
  const baseY = h * 0.80;
  const segments = Math.floor(w / 60) + 2;
  const xs = Array.from({ length: segments }, (_, i) => (i / (segments - 1)) * w);

  const rawY = xs.map((_, i) => {
    if (i === 0 || i === segments - 1) return baseY;
    return baseY + (Math.random() - 0.5) * h * 0.12;
  });

  const padCount = 2;
  const padIndices: number[] = [];
  const step = Math.floor(segments / (padCount + 1));
  for (let i = 0; i < padCount; i++) {
    const idx = step * (i + 1) + Math.floor((Math.random() - 0.5) * step * 0.4);
    padIndices.push(Math.min(Math.max(idx, 2), segments - 3));
  }

  pads = [];
  for (const idx of padIndices) {
    const flatY = rawY[idx];
    rawY[idx - 1] = flatY;
    rawY[idx] = flatY;
    rawY[idx + 1] = flatY;
    const px = xs[idx - 1];
    const pw = xs[idx + 1] - xs[idx - 1];
    pads.push({ x: px + pw * 0.5, y: flatY, width: pw });
  }

  terrain = xs.map((x, i) => ({ x, y: rawY[i] }));
}

function terrainYAt(x: number): number {
  for (let i = 0; i < terrain.length - 1; i++) {
    const a = terrain[i], b = terrain[i + 1];
    if (x >= a.x && x <= b.x) {
      const t = (x - a.x) / (b.x - a.x);
      return a.y + (b.y - a.y) * t;
    }
  }
  return canvas.height * 0.80;
}

function nearestPad(x: number): LandingPad {
  return pads.reduce((best, p) =>
    Math.abs(p.x - x) < Math.abs(best.x - x) ? p : best, pads[0]);
}

function onPad(lx: number, ly: number): boolean {
  for (const pad of pads) {
    if (Math.abs(lx - pad.x) < pad.width * 0.42 && Math.abs(ly - pad.y) < 10) return true;
  }
  return false;
}

// ── Lander ─────────────────────────────────────────────────────
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }

interface Lander {
  x: number; y: number;
  vx: number; vy: number;
  angle: number;
  thrustMain: boolean;
  thrustLeft: boolean;
  thrustRight: boolean;
  status: 'flying' | 'landed';
  statusTimer: number;
  particles: Particle[];
}

const GRAVITY = 0.016;
const THRUST_MAIN = 0.040;
const THRUST_SIDE = 0.014;
const LANDER_H = 36;   // doubled from before

function spawnLander(): Lander {
  return {
    x: Math.random() * canvas.width * 0.5 + canvas.width * 0.25,
    y: 50,
    vx: (Math.random() - 0.5) * 0.5,
    vy: 0.2,
    angle: 0,
    thrustMain: false,
    thrustLeft: false,
    thrustRight: false,
    status: 'flying',
    statusTimer: 0,
    particles: [],
  };
}

let lander = spawnLander();
let frame = 0;
let score = 0;
let landings = 0;

// ── AI controller ──────────────────────────────────────────────
function aiControl(l: Lander) {
  if (l.status !== 'flying') return;

  const target = nearestPad(l.x);
  if (!target) return;

  const dx = target.x - l.x;
  const distY = Math.max(0, (target.y - LANDER_H) - l.y);

  // Horizontal: steer toward pad
  const wantVx = Math.sign(dx) * Math.min(Math.abs(dx) * 0.025, 1.0);
  const hvErr = wantVx - l.vx;
  l.thrustLeft = hvErr > 0.07;
  l.thrustRight = hvErr < -0.07;

  // Vertical: allowed descent speed shrinks linearly as we approach ground.
  // High up (distY ~500) → target ~2.0 px/frame (let it fall freely).
  // Near pad  (distY ~10)  → target ~0.2 px/frame (gentle touch-down).
  const targetVy = Math.min(2.0, distY * 0.014 + 0.2);
  l.thrustMain = l.vy > targetVy;
}

// ── Update ─────────────────────────────────────────────────────
function update() {
  frame++;

  const l = lander;

  if (l.status === 'landed') {
    l.statusTimer--;
    if (l.statusTimer <= 0) {
      buildTerrain();
      lander = spawnLander();
    }
    return;
  }

  aiControl(l);

  // Thrust — no fuel limit
  if (l.thrustMain) {
    l.vy -= THRUST_MAIN;
    spawnExhaust(l, 0, LANDER_H * 0.55, 3);
  }
  if (l.thrustLeft) {
    l.vx += THRUST_SIDE;
    spawnExhaust(l, -LANDER_H * 0.45, 0, 1);
  }
  if (l.thrustRight) {
    l.vx -= THRUST_SIDE;
    spawnExhaust(l, LANDER_H * 0.45, 0, 1);
  }

  l.vy += GRAVITY;

  // Smooth visual tilt
  const wantAngle = l.vx * 0.22;
  l.angle += (wantAngle - l.angle) * 0.1;

  l.x += l.vx;
  l.y += l.vy;

  // Bounce off walls
  if (l.x < 20) { l.x = 20; l.vx = Math.abs(l.vx) * 0.5; }
  if (l.x > canvas.width - 20) { l.x = canvas.width - 20; l.vx = -Math.abs(l.vx) * 0.5; }

  // Update particles
  l.particles = l.particles.filter(p => p.life > 0);
  l.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life--; });

  // Ground collision
  const gY = terrainYAt(l.x);
  const landerBottom = l.y + LANDER_H;

  if (landerBottom >= gY) {
    const speed = Math.hypot(l.vx, l.vy);
    l.y = gY - LANDER_H;
    l.vx = 0; l.vy = 0;

    if (onPad(l.x, gY) && speed < 1.4) {
      // Clean landing
      l.status = 'landed';
      l.statusTimer = 130;
      score += 100;
      landings++;
    } else {
      // Missed pad or too fast — bounce up and try again, no crash state
      l.vy = -Math.min(speed * 0.5, 1.5);
      l.vx = (Math.random() - 0.5) * 0.8;
      l.y -= 4;
    }
  }
}

function spawnExhaust(l: Lander, offX: number, offY: number, count: number) {
  for (let i = 0; i < count; i++) {
    l.particles.push({
      x: l.x + offX + (Math.random() - 0.5) * 5,
      y: l.y + LANDER_H * 0.5 + offY,
      vx: (Math.random() - 0.5) * 1.0,
      vy: offY > 0 ? Math.random() * 1.5 + 0.5 : (Math.random() - 0.5) * 0.8,
      life: Math.floor(Math.random() * 14 + 7),
      maxLife: 20,
    });
  }
}

// ── Draw ───────────────────────────────────────────────────────
function drawStars(t: number) {
  for (const s of stars) {
    const a = s.twinkle + Math.sin(t * 0.015 + s.phase) * (1 - s.twinkle);
    ctx.globalAlpha = a * 0.95;
    ctx.fillStyle = C.star;
    ctx.beginPath();
    ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawTerrain() {
  if (terrain.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(terrain[0].x, terrain[0].y);
  for (const p of terrain) ctx.lineTo(p.x, p.y);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fillStyle = C.terrain;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(terrain[0].x, terrain[0].y);
  for (const p of terrain) ctx.lineTo(p.x, p.y);
  ctx.strokeStyle = C.terrainEdge;
  ctx.lineWidth = 2;
  ctx.stroke();

  for (const pad of pads) {
    // Glow halo
    const grd = ctx.createRadialGradient(pad.x, pad.y, 0, pad.x, pad.y, pad.width * 0.8);
    grd.addColorStop(0, C.padGlow);
    grd.addColorStop(1, 'rgba(66,188,127,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(pad.x - pad.width, pad.y - 12, pad.width * 2, 24);

    // Pad surface
    ctx.strokeStyle = C.pad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pad.x - pad.width * 0.42, pad.y);
    ctx.lineTo(pad.x + pad.width * 0.42, pad.y);
    ctx.stroke();

    // End markers
    ctx.fillStyle = C.pad;
    ctx.fillRect(pad.x - pad.width * 0.42 - 2, pad.y - 6, 4, 12);
    ctx.fillRect(pad.x + pad.width * 0.42 - 2, pad.y - 6, 4, 12);
  }
}

function drawLander(l: Lander) {
  if (l.status === 'landed' && l.statusTimer < 10) return; // fade out before respawn

  ctx.save();
  ctx.translate(l.x, l.y + LANDER_H * 0.5);
  ctx.rotate(l.angle);

  const S = LANDER_H; // scale unit

  // ── Main thruster flame ───────────────────────────────────────
  if (l.thrustMain) {
    const flH = (S * 0.5) + Math.random() * S * 0.3;
    const grad = ctx.createLinearGradient(0, S * 0.45, 0, S * 0.45 + flH);
    grad.addColorStop(0, C.thrustCore);
    grad.addColorStop(0.5, '#ff965f');
    grad.addColorStop(1, C.thrustOuter);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-S * 0.18, S * 0.44);
    ctx.lineTo(0, S * 0.44 + flH);
    ctx.lineTo(S * 0.18, S * 0.44);
    ctx.fill();
  }

  // ── Side thruster flames ──────────────────────────────────────
  if (l.thrustLeft) {
    const fl = S * 0.25 + Math.random() * S * 0.1;
    ctx.fillStyle = C.thrustCore;
    ctx.beginPath();
    ctx.moveTo(-S * 0.38, -S * 0.05);
    ctx.lineTo(-S * 0.38 - fl, 0);
    ctx.lineTo(-S * 0.38, S * 0.05);
    ctx.fill();
  }
  if (l.thrustRight) {
    const fl = S * 0.25 + Math.random() * S * 0.1;
    ctx.fillStyle = C.thrustCore;
    ctx.beginPath();
    ctx.moveTo(S * 0.38, -S * 0.05);
    ctx.lineTo(S * 0.38 + fl, 0);
    ctx.lineTo(S * 0.38, S * 0.05);
    ctx.fill();
  }

  // ── Legs ─────────────────────────────────────────────────────
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = C.landerAccent;
  // Left strut
  ctx.beginPath();
  ctx.moveTo(-S * 0.2, S * 0.28);
  ctx.lineTo(-S * 0.48, S * 0.5);
  ctx.stroke();
  // Right strut
  ctx.beginPath();
  ctx.moveTo(S * 0.2, S * 0.28);
  ctx.lineTo(S * 0.48, S * 0.5);
  ctx.stroke();
  // Foot pads
  ctx.lineWidth = 3;
  ctx.strokeStyle = C.lander;
  ctx.beginPath();
  ctx.moveTo(-S * 0.62, S * 0.5);
  ctx.lineTo(-S * 0.34, S * 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(S * 0.34, S * 0.5);
  ctx.lineTo(S * 0.62, S * 0.5);
  ctx.stroke();

  // ── Body ──────────────────────────────────────────────────────
  const landed = l.status === 'landed';
  ctx.fillStyle = landed ? C.success : C.lander;
  ctx.strokeStyle = C.landerDark;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -S * 0.5);         // top point
  ctx.lineTo(S * 0.28, -S * 0.28);
  ctx.lineTo(S * 0.35, S * 0.1);
  ctx.lineTo(S * 0.25, S * 0.38);
  ctx.lineTo(-S * 0.25, S * 0.38);
  ctx.lineTo(-S * 0.35, S * 0.1);
  ctx.lineTo(-S * 0.28, -S * 0.28);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // ── Window ────────────────────────────────────────────────────
  ctx.fillStyle = landed ? '#8cff9b' : C.landerAccent;
  ctx.beginPath();
  ctx.arc(0, -S * 0.08, S * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C.landerDark;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // ── Antenna ───────────────────────────────────────────────────
  ctx.strokeStyle = C.lander;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -S * 0.5);
  ctx.lineTo(0, -S * 0.78);
  ctx.stroke();
  ctx.fillStyle = landed ? C.success : '#ffe091';
  ctx.beginPath();
  ctx.arc(0, -S * 0.78, S * 0.07, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawParticles(l: Lander) {
  for (const p of l.particles) {
    const a = (p.life / p.maxLife) * 0.85;
    ctx.globalAlpha = Math.min(a, 0.85);
    ctx.fillStyle = C.exhaust;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawHUD(l: Lander) {
  ctx.font = `22px 'VT323', monospace`;
  ctx.fillStyle = C.hud;
  ctx.globalAlpha = 0.8;
  ctx.textAlign = 'right';
  ctx.fillText(`SCORE ${score.toString().padStart(6, '0')}   LANDINGS ${landings}`, canvas.width - 16, 32);
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;

  // Velocity readout while flying
  if (l.status === 'flying') {
    const speed = Math.hypot(l.vx, l.vy);
    const safe = speed < 1.4;
    ctx.font = `18px 'VT323', monospace`;
    ctx.fillStyle = safe ? C.pad : '#ff6866';
    ctx.globalAlpha = 0.75;
    ctx.fillText(`VEL ${speed.toFixed(1)}`, 16, 32);
    ctx.globalAlpha = 1;
  }

  // Landing flash
  if (l.status === 'landed' && l.statusTimer > 80) {
    ctx.font = `36px 'VT323', monospace`;
    ctx.fillStyle = C.success;
    ctx.textAlign = 'center';
    ctx.globalAlpha = Math.min(1, (l.statusTimer - 80) / 20);
    ctx.fillText('LANDED', canvas.width * 0.5, canvas.height * 0.38);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }
}

// ── Render ─────────────────────────────────────────────────────
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGrad.addColorStop(0, C.skyTop);
  skyGrad.addColorStop(1, C.skyBot);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawStars(frame);
  drawTerrain();
  drawParticles(lander);
  drawLander(lander);
  drawHUD(lander);
}

// ── Boot ───────────────────────────────────────────────────────
if (window.innerWidth > 768) {
  resize();
  const loop = GameLoop({ update, render });
  loop.start();
}
