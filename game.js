/* VECTEROIDS
#ARCADE #VECTOR #CRT #CABINET #COINOP #ASTEROIDS-LIKE

ROM NOTES

Static web build, upload and go

Keep it lean: one canvas, one loop, no drama

Controls: Arrows or WASD, Space fires, H or Shift hyperspace, P or Esc pause

SFX: /sound/*.txt (base64 payloads), driven by audio.js


TECH SHEET

3 rock sizes, colour shift #GREEN -> #TEAL -> #BLUE

Rocks shatter on hits and on rock-to-rock collisions

Particle pops and vector debris on breaks

UFO runs the top lane sometimes, with spawn cooldown, shoots at you


TODO LATER (WHEN YOU’RE BORED)

Attract mode flourish, fake DIP switches, “INSERT COIN” bait text

Optional scanline/flicker overlay tuning
*/


/* Author: TABARC-Code
<p align="center"> <img src=".branding/tabarc-icon.svg" width="180" alt="TABARC-Code Icon"> </p>

#CABINET-SERVICE-NOTES
- The CRT hum is the only honest thing in this universe.
- If this loop stutters, it’s not “performance”, it’s you asking for miracles.
- TODO: DIP switch menu (fake, obviously). Players love knobs that do nothing.
- TODO: High score corruption mode (the authentic arcade experience).
- Note to future me: do not “optimise” this into unreadable cleverness. Keep it dumb, keep it fast.
*/

'use strict';

// it's cold and snowing. the crt's warm, i'm not. need coffee.


/* Death quips */

const EXTRA_DEATH_QUIPS = [
  "Right. So that’s exploded. Again. Splendid.",
  "You’ve died. Space remains indifferent. Carry on.",
  "That wasn’t bravery. That was poor planning with confidence.",
  "Your ship has become modern art. Mostly smoke.",
  "Congratulations. You’ve invented a new way to be scrap.",
  "Well. That’s your career in one neat fireball.",
  "You didn’t so much lose as donate yourself to the vacuum.",
  "Classic human move: accelerate into a problem until it stops being yours.",
  "If at first you don’t succeed, detonate more decisively.",
  "The asteroid would like to thank you for your cooperation.",
  "That was less ‘pilot’ and more ‘shouted at physics’.",
  "A bold strategy, ruined by reality.",
  "You’ve made the universe sigh audibly.",
  "You are now a cautionary tale with momentum.",
  "It turns out the void does not accept apologies.",
  "Lovely. Another lesson taught by impact.",
  "Well done. You’ve achieved maximum nothingness.",
  "That’s one way to shorten the to do list.",
  "You’ve died in the most traditional way: suddenly.",
  "Space: 1. You: still 0.",
  "Good news: the pain is brief. Bad news: the shame is eternal.",
  "That was a tactical decision. Just not a good one.",
  "You’ve become a fine dust. Very on-trend.",
  "In space, no one can hear you rethink your choices.",
  "You’ve been promoted to debris.",
  "The ship’s fine. You’re not in it anymore, but it’s fine.",
  "A heroic sacrifice to the altar of poor steering.",
  "That manoeuvre was legally classed as self-defeat.",
  "Somewhere, an asteroid is feeling quite smug.",
  "You’ve been outplayed by a rock. A literal rock.",
  "That was not an exit. That was an unplanned disassembly.",
  "Yes yes, very dramatic. Now stop being on fire.",
  "Your flight plan appears to have been: ‘towards death’.",
  "You’ve achieved escape velocity from good judgement.",
  "The universe has filed your performance under ‘regrettable’.",
  "That’s what happens when you negotiate with granite at speed.",
  "What a surprise. The thing you hit was harder than you.",
  "You’ve died. Please fill in form 27B slash six.",
  "You’ve been deleted by cosmic admin.",
  "That was a short story with an abrupt ending.",
  "You’re now a memory and a faint smell of ozone.",
  "Another glorious triumph for incompetence.",
  "You were warned. By everything. Constantly.",
  "Your ship has become several smaller ships. None of them useful.",
  "That was less a crash and more a commitment.",
  "You’ve lost the argument with geometry.",
  "If there’s a prize for worst timing, you’ve won it twice.",
  "I’ve seen better survival instincts in a toaster.",
  "That was an expensive way to turn left.",
  "The stars applaud. Quietly. Mockingly.",
  "You’ve died doing what you loved: ignoring consequences.",
  "Well, at least you didn’t have to file taxes.",
  "Space is big. Your margin for error wasn’t.",
  "You have been successfully removed from the situation.",
  "That was not ‘risk’. That was ‘guarantee’.",
  "Another fine example of confidence without competence.",
  "Your ship is now a strong argument for staying indoors.",
  "You’ve discovered the rare art of losing instantly.",
  "This is why we can’t have nice spacecraft.",
  "You’ve been outmanoeuvred by your own enthusiasm.",
  "Consider this a gentle reminder that you are mortal.",
  "That went as expected. Shame you expected wrong.",
  "You died how you lived: slightly too fast and very confused.",
  "You are now a cautionary smear across the cosmos.",
  "The rocks have spoken. They said ‘no’.",
  "You’ve made a compelling case for doing less.",
  "Your survival chances have been revised to: none.",
  "That’s one way to become part of the scenery.",
  "Good effort. Terrible result. Absolutely inevitable.",
  "Well. That’s ruined the evening.",
  "On the bright side, you’ve stopped making decisions.",
  "You’ve been politely but firmly erased.",
  "A successful test of how not to do that.",
  "You flew like you were late for a catastrophe.",
  "You’re now a public service announcement in orbit.",
  "That was a love tap from a boulder. You took it personally.",
  "The ship’s systems are fine. Your systems are not.",
  "You have achieved peak disappointment.",
  "Your performance has been rated: ‘catastrophic’.",
  "That was a plan. I refuse to believe it was intentional.",
  "Space doesn’t do second chances. It does impacts.",
  "You’ve been recycled into silence.",
  "You were briefly alive. Then you weren’t. Efficiency.",
  "That was not a dodge. That was a direct application.",
  "You’ve died. The paperwork will be posted never.",
  "You’ve made an asteroid feel powerful. Well done.",
  "All that potential, squandered in a single crunch.",
  "You’ve successfully demonstrated why helmets are pointless here.",
  "Your ship has entered its interpretive dance phase. Mostly spinning.",
  "That’s the sound of your pride leaving the atmosphere.",
  "You’ve been upgraded to ‘historical data’.",
  "The void thanks you for your contribution of spare parts.",
  "This is what happens when you flirt with inertia.",
  "Your last words were probably ‘I’ve got this’.",
  "You’ve discovered a new speed: too much.",
  "The universe has marked you absent.",
  "You’ve been removed from play for excessive optimism.",
  "You took a calculated risk and forgot to calculate.",
  "Your ship has become a lovely ring of regret.",
  "You’ve managed to lose with style. Briefly.",
  "Ah. The old ‘explode and hope for the best’.",
  "The best part of that was how quickly it ended.",
  "Space is cold. Your decisions were colder.",
  "You are now an object lesson in overconfidence.",
  "That was not a battle. That was a surrender with fireworks.",
  "You’ve died. Please try not to do that again, if convenient.",
  "You’ve made the stars look down on you. Metaphorically. Judgementally.",
  "If survival was the goal, you’ve misunderstood the assignment.",
  "You’ve been defeated by something with no brain and no mercy.",
  "Another day, another unavoidable tragedy of your own making.",
  "You’ve achieved the rare feat of disappointing an empty universe.",
  "You’ve been thoroughly, comprehensively, and impressively flattened.",
  "Your ship has filed for separation. From you.",
  "That’s one way to end the suspense.",
  "You were a brief flash of ambition. Now you’re a brief flash of debris.",
  "You’ve made a very persuasive argument for caution. Too late.",
  "In the end, you were defeated by a circle and some bad timing.",
  "You’ve died. Again. Try something radical next time: not dying.",
];

const DEATH_QUIPS = buildDeathQuips509().concat(EXTRA_DEATH_QUIPS);

function buildDeathQuips509(){
  const openers = [
    "Well. That went brilliantly.",
    "Right. That’s that then.",
    "Spectacularly doomed.",
    "Classic.",
    "Textbook catastrophe.",
    "A masterclass in failure.",
    "You absolute hero.",
    "Genuinely impressive, in the worst way.",
    "A short career, but a loud one.",
    "Congratulations, you’ve discovered consequences."
  ];

  const middles = [
    "The void remains unimpressed.",
    "Space has filed a formal complaint.",
    "Your ship’s warranty has expired, violently.",
    "The asteroids did not come to negotiate.",
    "Physics has won again.",
    "The universe has declined your application.",
    "That was not the correct lever.",
    "It turns out momentum is not optional.",
    "Your tactics were… interpretive.",
    "The enemy appreciates your donation."
  ];

  const closers = [
    "Try breathing next time.",
    "Have another go, champ.",
    "Back to the attract screen with you.",
    "Pop the kettle on and reflect.",
    "At least it was quick.",
    "You’ll be missed by absolutely nobody out here.",
    "Insert coin. Insert dignity.",
    "Somewhere, an asteroid is smug.",
    "On the bright side, it’s over.",
    "You’ve made scrap into an art form."
  ];

  const spice = [
    "Lovely.", "Marvellous.", "Stunning.", "Glorious.", "Tragic.", "Predictable.",
    "Historic.", "Iconic.", "Criminal.", "Elegant.", "Messy.", "Lethal.", "Awkward."
  ];

  const out = [];
  const seen = new Set();

  for (let i = 0; out.length < 650 && i < 6000; i++){ 
    const a = openers[i % openers.length];
    const b = middles[(i * 3) % middles.length];
    const c = closers[(i * 7) % closers.length];
    const s = spice[(i * 5) % spice.length];

    let line;
    switch (i % 5){
      case 0: line = `${a} ${b} ${c}`; break;
      case 1: line = `${s} ${a.toLowerCase()} ${c}`; break;
      case 2: line = `${a} ${s.toLowerCase()} ${b}`; break;
      case 3: line = `${b} ${c}`; break;
      default: line = `${a} ${c}`; break;
    }

    if (!seen.has(line)){
      seen.add(line);
      out.push(line);
    }
  }

  let k = 0;
  while (out.length < 509){
    const line = `Death report #${(k+1)}: ${openers[k % openers.length]} ${closers[k % closers.length]}`;
    if (!seen.has(line)){
      seen.add(line);
      out.push(line);
    }
    k++;
  }

  return out.slice(0, 509);
}

function pickDeathQuip(){
  return DEATH_QUIPS[(Math.random() * DEATH_QUIPS.length) | 0];
}


// collision helpers
const COL = {
  circleCircle(ax, ay, ar, bx, by, br){
    const dx = ax - bx;
    const dy = ay - by;
    const r = ar + br;
    return (dx * dx + dy * dy) <= (r * r);
  }
};

/* 
  VecterOids (Neocities cut)
  Author: TABARC-Code
  Plugin URI: https://github.com/TABARC-Code/

  Notes to future-me:
  - This is intentionally "one folder, upload to Neocities, it just runs".
  - No bundlers. No React. No TypeScript. No excuses.
  - If you miss your fancy toolchain, go hug a CI pipeline.

  Design goals:
  - Vector-ish visuals (stroke, no textures).
  - Arcade loop: waves, upgrades, multipliers, near-misses.
  - Input feels snappy. Anything else is theatre.

  TODOs (because I can't help myself):
  - Add attract mode (ship flies itself, fake score, looks alive).
  - Better UFO behaviour (currently "annoying", which is historically accurate).
  - Particle bursts for split asteroids, like proper coin-op catharsis.
*/

const canvas = document.getElementById('game');

// phosphor palette (green is law)
const PHOSPHOR = {
  green: 'rgba(0,255,138,0.92)',
  blue:  'rgba(70,160,255,0.90)',
  dim:   'rgba(0,255,138,0.55)',
  white: 'rgba(255,255,255,0.90)'
};

const ctx = canvas.getContext('2d', { alpha: false });

const splash = document.getElementById('splash');
const startBtn = document.getElementById('startBtn');
if(!canvas || !ctx){
  console.error('Canvas not initialised.');
}


// splash sugar
(function syncSplash(){
  const el = document.getElementById('hiScoreSplash');
  if (!el) return;
  const best = +(localStorage.getItem('vectoroids_best') || 0);
  el.textContent = String(best).padStart(6,'0');
})();

let upgradeCard = document.getElementById('upgradeCard');
let upgradeOptionsEl = document.getElementById('upgradeOptions');
let pausedEl = document.getElementById('paused');

function ensureUI(){
  let fatalEl = document.getElementById('fatal');
  // If the HTML got redesigned (it did) and these nodes vanished,
  // we recreate them. Better ugly than dead.
  if (!pausedEl){
    pausedEl = document.createElement('div');
    pausedEl.id = 'paused';
    pausedEl.textContent = 'PAUSED';
    pausedEl.style.display = 'none';
    document.body.appendChild(pausedEl);
  }

  if (!upgradeCard){
    upgradeCard = document.createElement('div');
    upgradeCard.id = 'upgradeCard';
    upgradeCard.className = 'upgradeCard';
    upgradeCard.style.display = 'none';
    upgradeCard.innerHTML = `
      <div class="upgradeTitle">CHOOSE UPGRADE</div>
      <div id="upgradeOptions"></div>
      <div class="upgradeHint">Press 1, 2, 3 or tap an option</div>
    `;
    document.body.appendChild(upgradeCard);
  }

  if (!upgradeOptionsEl){
    upgradeOptionsEl = document.getElementById('upgradeOptions');
    if (!upgradeOptionsEl){
      upgradeOptionsEl = document.createElement('div');
      upgradeOptionsEl.id = 'upgradeOptions';
      upgradeCard.appendChild(upgradeOptionsEl);
    }
  }
}

ensureUI();

const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

function fitCanvas() {
  const w = Math.floor(window.innerWidth);
  const h = Math.floor(window.innerHeight);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width = Math.floor(w * DPR);
  canvas.height = Math.floor(h * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', fitCanvas);
fitCanvas();
setupTouchUI();

function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

/* Broadphase grid
   Cheap spatial hash so we can crank waves without turning phones into heaters.
   It's not fancy. It's just less O(n²) misery.
*/
const GRID = {
  cell: 140,   // tweakable. bigger cell = fewer buckets, more false positives.
  map: new Map(),
};

function gridKey(cx, cy){
  return (cx << 16) ^ cy;
}

function gridClear(){
  GRID.map.clear();
}

function gridInsert(obj, idx){
  const c = GRID.cell;
  const cx = (obj.x / c) | 0;
  const cy = (obj.y / c) | 0;
  const k = gridKey(cx, cy);
  let arr = GRID.map.get(k);
  if (!arr){ arr = []; GRID.map.set(k, arr); }
  arr.push(idx);
}

function gridQuery(x, y){
  const c = GRID.cell;
  const cx = (x / c) | 0;
  const cy = (y / c) | 0;
  // 3x3 neighbours
  const out = [];
  for (let oy=-1; oy<=1; oy++){
    for (let ox=-1; ox<=1; ox++){
      const k = gridKey(cx+ox, cy+oy);
      const arr = GRID.map.get(k);
      if (arr) out.push(arr);
    }
  }
  return out;
}

function rand(a,b){ return a + Math.random() * (b-a); }
function pick(arr){ return arr[(Math.random()*arr.length)|0]; }

function wrapPos(p){
  const w = canvas.width / DPR, h = canvas.height / DPR;
  if (p.x < 0) p.x += w;
  if (p.y < 0) p.y += h;
  if (p.x >= w) p.x -= w;
  if (p.y >= h) p.y -= h;
}

function dist2(ax, ay, bx, by){
  const dx = ax - bx, dy = ay - by;
  return dx*dx + dy*dy;
}

function angleToVec(a){ return { x: Math.cos(a), y: Math.sin(a) }; }

const KEYS = new Set();
window.addEventListener('keydown', (e) => {
  KEYS.add(e.code);
  // keep space from scroll-janking the universe
  if (e.code === 'Space') e.preventDefault();

  if (e.code === 'KeyP' || e.code === 'Escape') {
    togglePause();
  }

  if (e.code === 'KeyH' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    requestHyperspace();
  }

  // upgrade selection keys
  if (state.mode === 'upgrade') {
    if (e.code === 'Digit1') chooseUpgrade(0);
    if (e.code === 'Digit2') chooseUpgrade(1);
    if (e.code === 'Digit3') chooseUpgrade(2);
  }
}, { passive: false });

window.addEventListener('keyup', (e) => {
  KEYS.delete(e.code);
});


// Virtual input for touch UI. Keyboard still rules. Touch is a polite suggestion.
const VINPUT = { left:false, right:false, thrust:false, fire:false, pause:false, hyper:false };

function setupTouchUI(){
  const ui = document.getElementById('touchUI');
  if (!ui) return;

  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (!coarse){
    ui.style.display = 'none';
    ui.setAttribute('aria-hidden','true');
    return;
  }

  ui.style.display = 'flex';
  ui.setAttribute('aria-hidden','false');

  const bindHold = (id, key) => {
    const el = document.getElementById(id);
    if (!el) return;
    const down = (e)=>{ e.preventDefault(); VINPUT[key]=true; };
    const up = (e)=>{ e.preventDefault(); VINPUT[key]=false; };
    el.addEventListener('pointerdown', down, { passive:false });
    el.addEventListener('pointerup', up, { passive:false });
    el.addEventListener('pointercancel', up, { passive:false });
    el.addEventListener('pointerleave', up, { passive:false });
  };

  bindHold('tLeft','left');
  bindHold('tRight','right');
  bindHold('tThrust','thrust');
  bindHold('tFire','fire');

  const pauseBtn = document.getElementById('tPause');
  if (pauseBtn){
    pauseBtn.addEventListener('click', (e)=>{ e.preventDefault(); togglePause(); }, { passive:false });
  }

  const hyperBtn = document.getElementById('tHyper');
  if (hyperBtn){
    hyperBtn.addEventListener('click', (e)=>{ e.preventDefault(); requestHyperspace(); }, { passive:false });
  }
}

let playersPlayed = null;

const state = {
  running: false,
  paused: false,

  mode: 'splash', // splash | play | upgrade | dead
  t: 0,

  wave: 1,
  waveTimer: 0,
  waveCooldown: 0,

  score: 0,
  best: +(localStorage.getItem('vectoroids_best') || 0),
  mult: 1,
  multTimer: 0,
  nearMissStreak: 0,

  // upgrades that mutate rules. small values, but they stack and get spicy.
  mods: {
    fireRate: 6.5,        // bullets per second baseline
    maxBullets: 5,
    bulletSpeed: 680,
    bulletLife: 0.85,
    thrust: 360,
    turn: 4.2,
    multDecay: 0.92,      // multiplier retention per second when not feeding it
  },

  ship: null,
  bullets: [],
  bulletPool: [],

  asteroids: [],
  ufo: null,
  ufoSpawnT: 0,

  ufoBullets: [],
  ufoBulletPool: [],

  fx: [],
  fxPool: [],
 // vector debris lines for explosions


  upgradesThisPick: [],
};

function makeShip(){
  const w = canvas.width / DPR, h = canvas.height / DPR;
  return {
    x: w/2,
    y: h/2,
    vx: 0,
    vy: 0,
    a: -Math.PI/2,
    r: 12,
    invuln: 1.3,
    lives: 3,
    shootCooldown: 0,
    dead: false,
  };
}

function makeAsteroid(size=3, x=null, y=null){
  const w = canvas.width / DPR, h = canvas.height / DPR;
  const s = size;
  const r = s === 3 ? 42 : s === 2 ? 26 : 16;

  const px = x ?? (Math.random()<0.5 ? rand(0,w) : (Math.random()<0.5 ? -30 : w+30));
  const py = y ?? (Math.random()<0.5 ? rand(0,h) : (Math.random()<0.5 ? -30 : h+30));

  const speed = rand(55, 120) * (1 + (state.wave-1)*0.07) * (s===3 ? rand(0.85,1.05) : s===2 ? rand(1.0,1.25) : rand(1.15,1.55));
  const ang = rand(0, Math.PI*2);
  const v = angleToVec(ang);

  // jagged polygon
  const verts = [];
  const points = 10 + ((Math.random()*5)|0);
  for (let i=0;i<points;i++){
    const t = (i/points) * Math.PI*2;
    const rr = r * rand(0.7, 1.15);
    verts.push({ x: Math.cos(t)*rr, y: Math.sin(t)*rr });
  }

  return {
    x:px, y:py,
    vx:v.x*speed,
    vy:v.y*speed,
    r,
    size:s,
    verts,
  };
}

function makeUfo(){
  const w = canvas.width / DPR, h = canvas.height / DPR;
  const fromLeft = Math.random() < 0.5;
  return {
    x: fromLeft ? -40 : w+40,
    y: rand(60, h-60),
    vx: fromLeft ? rand(70, 110) : -rand(70,110),
    vy: rand(-18, 18),
    r: 18,
    hp: 3 + Math.floor(state.wave/4),
    shootT: rand(0.6, 1.2),
  };
}

function makeBullet(x,y,vx,vy){
  // pool this stuff. mobile browsers love doing a little GC panic at the worst moments.
  const b = state.bulletPool.pop() || { x:0,y:0,vx:0,vy:0,life:0,r:2.4 };
  b.x = x; b.y = y; b.vx = vx; b.vy = vy;
  b.life = state.mods.bulletLife;
  b.r = 2.4;
  return b;
}

function makeUfoBullet(x,y,vx,vy){
  const b = state.ufoBulletPool.pop() || { x:0,y:0,vx:0,vy:0,life:0,r:3.0 };
  b.x = x; b.y = y; b.vx = vx; b.vy = vy;
  b.life = 2.2;
  b.r = 3.0;
  return b;
}


function spawnExplosion(x,y,power=1,col=COL.green){
  // power: 1 small, 2 medium, 3 large
  const count = 10 + power*10;
  for (let i=0;i<count;i++){
    const a = rand(0, Math.PI*2);
    const sp = rand(60, 220) * (0.6 + power*0.35);
    const len = rand(6, 18) * (0.7 + power*0.25);
    {
    const f = state.fxPool.pop() || { x:0,y:0,vx:0,vy:0,len:0,life:0,col:COL.green };
    f.x = x; f.y = y;
    f.vx = Math.cos(a)*sp;
    f.vy = Math.sin(a)*sp;
    f.len = len;
    f.life = rand(0.25, 0.85) * (0.9 + power*0.15);
    f.col = col;
    state.fx.push(f);
  }
  }
}

function resetRun(){
  state.ship = makeShip();
  state.bullets.length = 0;
  state.asteroids.length = 0;
  state.ufo = null;
  state.ufoSpawnT = rand(4, 10);
  state.ufoBullets.length = 0;

  state.wave = 1;
  state.waveTimer = 0;
  state.waveCooldown = 0;

  state.score = 0;
  state.mult = 1;
  state.multTimer = 0;
  state.nearMissStreak = 0;

  // mods reset on new run
  state.mods = {
    fireRate: 6.5,
    maxBullets: 5,
    bulletSpeed: 680,
    bulletLife: 0.85,
    thrust: 360,
    turn: 4.2,
    multDecay: 0.92,
  };

  spawnWave(state.wave);
}

function spawnWave(wave){
  // budget director: bigger wave, more rocks, but with sanity limits.
  // I don't want a screen full of dots. I want readable chaos.
  const baseBudget = 8 + wave * 3;
  let budget = baseBudget;

  while (budget > 0){
    let size;
    if (budget >= 6 && Math.random() < 0.55) size = 3;
    else if (budget >= 3 && Math.random() < 0.65) size = 2;
    else size = 1;

    const cost = size === 3 ? 6 : size === 2 ? 3 : 1;
    if (budget - cost < 0) { size = 1; }
    budget -= (size === 3 ? 6 : size === 2 ? 3 : 1);

    state.asteroids.push(makeAsteroid(size));
  }

  // UFO comes in sometimes, not always. Too much UFO is just punishment cosplay.
  if (wave >= 3 && Math.random() < clamp(0.2 + wave*0.03, 0, 0.65)){
    state.ufo = makeUfo();
  }
}

const UPGRADE_POOL = [
  { id:'firerate', name:'Rapid Fire', desc:'+20% fire rate', apply:()=> state.mods.fireRate *= 1.2 },
  { id:'maxbul', name:'Extra Mag', desc:'+2 max bullets', apply:()=> state.mods.maxBullets += 2 },
  { id:'bspd', name:'Hot Rounds', desc:'+18% bullet speed', apply:()=> state.mods.bulletSpeed *= 1.18 },
  { id:'blife', name:'Long Shot', desc:'+20% bullet life', apply:()=> state.mods.bulletLife *= 1.2 },
  { id:'thrust', name:'Overthrust', desc:'+15% thrust', apply:()=> state.mods.thrust *= 1.15 },
  { id:'turn', name:'Tighter Rudder', desc:'+12% turn speed', apply:()=> state.mods.turn *= 1.12 },
  { id:'mult', name:'Greed Engine', desc:'Multiplier decays slower', apply:()=> state.mods.multDecay = Math.min(0.975, state.mods.multDecay + 0.02) },
  { id:'life', name:'Spare Hull', desc:'+1 life', apply:()=> state.ship.lives += 1 },
];

function offerUpgrades(){
  // pick 3 unique upgrades
  const pool = [...UPGRADE_POOL];
  const picks = [];
  while (picks.length < 3 && pool.length){
    const idx = (Math.random()*pool.length)|0;
    picks.push(pool.splice(idx,1)[0]);
  }
  state.upgradesThisPick = picks;
  state.mode = 'upgrade';
  state.paused = true;
  pausedEl.style.display = 'none'; // not "paused", it's a shop screen
  renderUpgradeUI(picks);
}

function renderUpgradeUI(picks){
  upgradeOptionsEl.innerHTML = '';
  picks.forEach((u, i) => {
    const btn = document.createElement('button');
    btn.className = 'upgradeBtn';
    btn.innerHTML = `
      <div class="upName">${u.name}</div>
      <div class="upDesc">${u.desc}</div>
      <div class="upKey">KEY ${i+1}</div>
    `;
    btn.onclick = () => chooseUpgrade(i);
    upgradeOptionsEl.appendChild(btn);
  });
  upgradeCard.style.display = 'block';
}

function chooseUpgrade(i){
  if (state.mode !== 'upgrade') return;
  const u = state.upgradesThisPick[i];
  if (!u) return;

  // apply upgrade
  u.apply();

  // exit upgrade screen
  upgradeCard.style.display = 'none';
  state.mode = 'play';
  state.paused = false;

  state.wave += 1;
  spawnWave(state.wave);

  // a tiny grace period so you don't instantly eat a rock on resume
  state.ship.invuln = Math.max(state.ship.invuln, 0.8);
}

function togglePause(){
  if (!state.running) return;
  if (state.mode === 'upgrade') return; // can't pause while shopping, you're already "paused"
  state.paused = !state.paused;
  pausedEl.style.display = state.paused ? 'block' : 'none';
}

function startGame(){
  ensureUI();
  // arm audio on first gesture
  if (window.VO_AUDIO && window.VO_AUDIO.arm) window.VO_AUDIO.arm();

  // players played counter (public, dumb, fine)
  try{
    fetch('https://api.countapi.xyz/hit/vectoroids/plays')
      .then(r => r.json())
      .then(d => { playersPlayed = (d && typeof d.value === 'number') ? d.value : playersPlayed; })
      .catch(()=>{});
  }catch(e){}

  state.running = true;
  state.mode = 'play';
  state.paused = false;
  pausedEl.style.display = 'none';
  resetRun();
    try{ VO_COUNTER.bump(); }catch(_){ }
  last = performance.now();
  requestAnimationFrame(loop);
}

function startFromSplash(e){
  // One canonical start path. If this fires, the game starts. Once.
  if (e && e.preventDefault) e.preventDefault();

  ensureUI();

  const splashEl = document.getElementById('splash');
  const canvasEl = document.getElementById('game');

  // Arm audio inside the same gesture that starts the game.
  // If it fails, we still start. Silence beats a dead button.
  try{
    if (window.VO_AUDIO && typeof window.VO_AUDIO.arm === 'function'){
      window.VO_AUDIO.arm();
    }
  }catch(err){
    if (window.VO_AUDIO_DEBUG) window.VO_AUDIO_DEBUG.lastError = err;
  }

  document.body.classList.add('playing');

  if (splashEl) splashEl.style.display = 'none';
  if (canvasEl) canvasEl.style.display = 'block';

  const touchUI = document.getElementById('touchUI');
  if (touchUI){
    touchUI.style.display = 'block';
    touchUI.setAttribute('aria-hidden', 'false');
  }

  if (window.__VO_STARTED) return;
  window.__VO_STARTED = true;

  if (typeof startGame === 'function') startGame();
}

if (startBtn){
  startBtn.addEventListener('click', startFromSplash, { passive:false });
  startBtn.addEventListener('pointerdown', startFromSplash, { passive:false });
  startBtn.addEventListener('touchstart', startFromSplash, { passive:false });
}

// Keyboard start from attract screen (Space / Enter)
window.addEventListener('keydown', (e) => {
  if (document.body.classList.contains('playing')) return;
  if (e.key === ' ' || e.key === 'Enter'){
    startFromSplash(e);
  }
}, { passive:false });


// expose start for inline onclick + debugging
window.VO_START = startFromSplash;


// tab switches happen. keep the ship intact. also: battery.
document.addEventListener('visibilitychange', () => {
  if (!state.running) return;
  if (document.hidden){
    state.paused = true;
  }
}, { passive:true });



let last = 0;

function loop(now){
  if (!state.running){
    return;
  }
  // dt clamp: tabs lie, phones stall, time jumps. keep it sane.
  // (if you want ultra-pure physics later, do fixed-step. for now: arcade forgiveness.)
  let dt = (now - last) / 1000;
  if (!isFinite(dt) || dt <= 0) dt = 0.016;
  dt = Math.min(0.05, dt);
  last = now;

  try{
  if (!state.paused){
    update(dt);
  }
  render();
}catch(err){
  console.error(err);
  state.running = false;
  state.paused = true;
  const fatal = document.getElementById('fatal');
  const fatalText = document.getElementById('fatalText');
  if (fatal){
    fatal.style.display = 'block';
    if (fatalText){ fatalText.textContent = (err && err.stack) ? err.stack : String(err); }
  }
  return;
}
requestAnimationFrame(loop);
}

function update(dt){
  // Main loop: tiny lies, 60 times a second.
  state.t += dt;
  if (hyperCooldown > 0) hyperCooldown -= dt;

  const ship = state.ship;
  ship.shootCooldown = Math.max(0, ship.shootCooldown - dt);
  ship.invuln = Math.max(0, ship.invuln - dt);

  // multiplier decay
  state.multTimer += dt;
  if (state.multTimer > 0.6){
    // decay only if you haven't fed it recently
    state.mult = Math.max(1, state.mult * Math.pow(state.mods.multDecay, dt));
    if (state.mult < 1.01) state.mult = 1;
  }

  // input
  const left = (KEYS.has('ArrowLeft') || KEYS.has('KeyA') || VINPUT.left);
  const right = (KEYS.has('ArrowRight') || KEYS.has('KeyD') || VINPUT.right);
  const thrust = (KEYS.has('ArrowUp') || KEYS.has('KeyW') || VINPUT.thrust);
  const fire = (KEYS.has('Space') || VINPUT.fire);

  if (left) ship.a -= state.mods.turn * dt;
  if (right) ship.a += state.mods.turn * dt;

  if (thrust){
    const v = angleToVec(ship.a);
    ship.vx += v.x * state.mods.thrust * dt;
    ship.vy += v.y * state.mods.thrust * dt;
  }

  // a tiny bit of space drag. not realistic. also: fun.
  ship.vx *= Math.pow(0.995, dt*60);
  ship.vy *= Math.pow(0.995, dt*60);

  ship.x += ship.vx * dt;
  ship.y += ship.vy * dt;
  wrapPos(ship);

  if (fire && ship.shootCooldown <= 0 && state.bullets.length < state.mods.maxBullets){
    const v = angleToVec(ship.a);
    const bx = ship.x + v.x * (ship.r + 4);
    const by = ship.y + v.y * (ship.r + 4);

    // bullets inherit ship velocity, because vector drift is the whole point
    const bvx = ship.vx + v.x * state.mods.bulletSpeed;
    const bvy = ship.vy + v.y * state.mods.bulletSpeed;

    state.bullets.push(makeBullet(bx, by, bvx, bvy));
    if (window.VO_AUDIO) window.VO_AUDIO.play('fire', { gain: 0.85, rateJitter: 0.03 });
    ship.shootCooldown = 1 / state.mods.fireRate;
  }

  // bullets update
  for (let i=state.bullets.length-1;i>=0;i--){
    const b = state.bullets[i];
    b.life -= dt;
    if (b.life <= 0){
      state.bullets.splice(i,1);
      state.bulletPool.push(b);
      continue;
    }
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    wrapPos(b);
  }

  

  // asteroid-asteroid collisions (yes, rocks can bully each other too)
  // using the same grid to avoid the O(n²) funeral march.
  gridClear();
  for (let i=0;i<state.asteroids.length;i++) gridInsert(state.asteroids[i], i);
  const pairSeen = new Set();

  for (let i=0;i<state.asteroids.length;i++){
    const a = state.asteroids[i];
    const buckets = gridQuery(a.x, a.y);
    for (let bb=0; bb<buckets.length; bb++){
      const arr = buckets[bb];
      for (let jj=0; jj<arr.length; jj++){
        const j = arr[jj];
        if (j <= i) continue;
        const b = state.asteroids[j];
        if (!b) continue;
        const key = (i<<16) ^ j;
        if (pairSeen.has(key)) continue;
        pairSeen.add(key);

        const rr = a.r + b.r;
        if (dist2(a.x,a.y,b.x,b.y) < rr*rr){
          // shatter both a bit. it looks great and makes the wave less predictable.
          const mx = (a.x + b.x) * 0.5;
          const my = (a.y + b.y) * 0.5;
          spawnExplosion(mx, my, 0.85 + 0.25*Math.max(a.size,b.size), a.col);

          const aWas = a.size;
          const bWas = b.size;

          // remove higher index first
          state.asteroids.splice(j,1);
          state.asteroids.splice(i,1);

          if (aWas > 1){
            state.asteroids.push(makeAsteroid(aWas-1, mx, my));
            state.asteroids.push(makeAsteroid(aWas-1, mx, my));
          }
          if (bWas > 1){
            state.asteroids.push(makeAsteroid(bWas-1, mx, my));
            state.asteroids.push(makeAsteroid(bWas-1, mx, my));
          }

          // grid is now stale; bail out of this pair loop and let next frame rebuild
          i = Math.max(-1, i-1);
          break;
        }
      }
      if (i < 0) break;
    }
  }
// asteroids update
  for (const a of state.asteroids){
    a.x += a.vx * dt;
    a.y += a.vy * dt;
    wrapPos(a);
  }

  // UFO update
  if (state.ufo){
    const u = state.ufo;
    u.x += u.vx * dt;
    u.y += u.vy * dt;

    const w = canvas.width / DPR, h = canvas.height / DPR;
    if (u.y < 40 || u.y > h-40) u.vy *= -1;

    // shoot at ship, with a bit of inaccuracy so it's nasty but not clairvoyant
    u.shootT -= dt;
    if (u.shootT <= 0){
      u.shootT = rand(0.55, 1.2) * clamp(1.0 - state.wave*0.02, 0.55, 1);
      const dx = ship.x - u.x;
      const dy = ship.y - u.y;
      const ang = Math.atan2(dy, dx) + rand(-0.18, 0.18);
      const v = angleToVec(ang);
      state.ufoBullets.push(makeUfoBullet(u.x, u.y, v.x*360, v.y*360));
      if (window.VO_AUDIO) window.VO_AUDIO.play('ufo', { gain: 0.55, rateJitter: 0.01 });
    }

    if (u.x < -80 || u.x > w+80){
      state.ufo = null; // left the stage, like a diva
    }

  } else {
    // UFO spawn timer: random appearances, not neatly tied to waves.
    state.ufoSpawnT -= dt;
    if (state.wave >= 3 && state.ufoSpawnT <= 0){
      // reset timer first so a failed spawn doesn't spam attempts
      state.ufoSpawnT = rand(6, 16) * clamp(1.0 - state.wave*0.03, 0.45, 1);
      if (Math.random() < clamp(0.18 + state.wave*0.02, 0, 0.6)){
        state.ufo = makeUfo();
      }
    }
  }


  // UFO bullets update
  for (let i=state.ufoBullets.length-1;i>=0;i--){
    const b = state.ufoBullets[i];
    b.life -= dt;
    if (b.life <= 0){
      state.ufoBullets.splice(i,1);
      continue;
    }
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    wrapPos(b);
  }

  // collisions
  handleCollisions(dt);

  // wave clear -> upgrade pick
  if (state.asteroids.length === 0 && state.mode === 'play'){
    offerUpgrades();
  }


// FX lines update (explosion debris)
for (let i=state.fx.length-1;i>=0;i--){
  const f = state.fx[i];
  f.life -= dt;
  if (f.life <= 0){ state.fx.splice(i,1); continue; }
  f.x += f.vx * dt;
  f.y += f.vy * dt;
  f.vx *= 0.985;
  f.vy *= 0.985;
}
}

function feedMultiplier(amount=0.12){
  state.multTimer = 0;
  state.mult = clamp(state.mult + amount, 1, 12);
}

function addScore(base){
  const pts = Math.floor(base * state.mult);
  state.score += pts;
  if (state.score > state.best){
    state.best = state.score;
    localStorage.setItem('vectoroids_best', String(state.best));
  }
}

function handleCollisions(dt){
  const ship = state.ship;

  // build grid for asteroids (broadphase)
  gridClear();
  for (let i=0;i<state.asteroids.length;i++) gridInsert(state.asteroids[i], i);

  // near miss detection (ship vs asteroid/ufo bullet/ufo body)
  // It's "arcade morality": reward flirting with death, but don't kill them for it.
  const near = ship.r + 26;
  const near2 = near*near;

  let nearHit = false;

  for (const a of state.asteroids){
    const r = a.r + ship.r + 6;
    if (dist2(ship.x, ship.y, a.x, a.y) < (r*r)){
      if (ship.invuln <= 0){
        killShip();
        return;
      }
    }
    if (dist2(ship.x, ship.y, a.x, a.y) < near2){
      nearHit = true;
    }
  }

  if (state.ufo){
    const u = state.ufo;
    if (dist2(ship.x, ship.y, u.x, u.y) < (ship.r + u.r + 4) ** 2){
      if (ship.invuln <= 0){
        killShip();
        return;
      }
    }
    if (dist2(ship.x, ship.y, u.x, u.y) < near2){
      nearHit = true;
    }
  }

  for (const b of state.ufoBullets){
    if (dist2(ship.x, ship.y, b.x, b.y) < (ship.r + b.r + 2) ** 2){
      if (ship.invuln <= 0){
        killShip();
        return;
      }
    }
    if (dist2(ship.x, ship.y, b.x, b.y) < near2){
      nearHit = true;
    }
  }

  if (nearHit){
    feedMultiplier(0.04);
    // tiny score drip, like slot-machine sugar
    addScore(2);
  }

  // bullets vs asteroids
  for (let bi=state.bullets.length-1; bi>=0; bi--){
    const b = state.bullets[bi];
    let hit = false;

    for (let ai=state.asteroids.length-1; ai>=0; ai--){
      const a = state.asteroids[ai];
      const rr = (a.r + b.r) ** 2;
      if (dist2(b.x, b.y, a.x, a.y) < rr){
        // hit
        state.bullets.splice(bi,1);
        hit = true;

        const base = a.size === 3 ? 90 : a.size === 2 ? 140 : 220;
        addScore(base);
        feedMultiplier(0.18);

        // explode: cheap vector debris, better than nothing
        spawnExplosion(a.x, a.y, a.size, a.size===1 ? COL.blue : COL.green);
        if (window.VO_AUDIO){
          const sfx = a.size===3 ? 'expLarge' : a.size===2 ? 'expMedium' : 'expSmall';
          window.VO_AUDIO.play(sfx, { gain: 0.95, rateJitter: 0.02 });
        }

        // split
        state.asteroids.splice(ai,1);
        if (a.size > 1){
          state.asteroids.push(makeAsteroid(a.size-1, a.x, a.y));
          state.asteroids.push(makeAsteroid(a.size-1, a.x, a.y));
        }
        break;
      }
    }

    if (hit) continue;

    // bullets vs UFO
    if (state.ufo){
      const u = state.ufo;
      if (dist2(b.x, b.y, u.x, u.y) < (u.r + b.r + 2) ** 2){
        state.bullets.splice(bi,1);
        u.hp -= 1;
        addScore(120);
        feedMultiplier(0.2);
        if (u.hp <= 0){
          addScore(600);
          feedMultiplier(0.6);
          state.ufo = null;
        }
      }
    }
  }
}


function isSafeSpot(x,y, minDist=90){
  for (const a of state.asteroids){
    const dx = a.x - x, dy = a.y - y;
    const rr = (a.r + minDist);
    if (dx*dx + dy*dy < rr*rr) return false;
  }
  if (state.ufo){
    const dx = state.ufo.x - x, dy = state.ufo.y - y;
    if (dx*dx + dy*dy < 140*140) return false;
  }
  return true;
}

function randomSafePos(){
  const w = canvas.width / DPR, h = canvas.height / DPR;
  for (let i=0;i<32;i++){
    const x = rand(40, w-40);
    const y = rand(40, h-40);
    if (isSafeSpot(x,y)) return {x,y};
  }
  return { x:w/2, y:h/2 };
}

let hyperCooldown = 0;
function requestHyperspace(){
  if (!state.running) return;
  if (state.mode !== 'play') return;
  if (state.paused) return;
  if (hyperCooldown > 0) return;

  hyperCooldown = 1.25;
  const ship = state.ship;

  // teleport with risk: if you land inside a rock, you deserve the loss
  const p = randomSafePos();
  spawnExplosion(ship.x, ship.y, 1, COL.dim);
  ship.x = p.x; ship.y = p.y;
  ship.vx *= 0.4; ship.vy *= 0.4;
  ship.invuln = Math.max(ship.invuln, 0.6);

  if (window.VO_AUDIO) window.VO_AUDIO.play('teleport', { gain: 0.85, rateJitter: 0.01 });
}

function killShip(){
  const ship = state.ship;

  // ship pops. short lived career.
  spawnExplosion(ship.x, ship.y, 3, COL.white);
  if (window.VO_AUDIO) window.VO_AUDIO.play('expLarge', { gain: 1.0, rateJitter: 0.02 });

  ship.lives -= 1;
  ship.invuln = 1.6;
  const p = randomSafePos();
  ship.x = p.x;
  ship.y = p.y;
  ship.vx = 0;
  ship.vy = 0;

  // penalty: multiplier reset (arcade cruelty, but consistent)
  state.mult = 1;
  state.multTimer = 0;

  if (ship.lives <= 0){
    state.mode = 'dead';
    state.paused = true;
    pausedEl.style.display = 'block';
    pausedEl.innerHTML = '<div style="text-align:center;"><div style="font-size:64px;line-height:1;">&#9760;</div><div style="font-size:20px;letter-spacing:2px;">GAME OVER</div><div style="margin-top:12px;font-size:14px;color:#0f0;">' + pickDeathQuip() + '</div><div style="margin-top:14px;font-size:12px;color:#0f0;opacity:0.9;">TAP TO RESTART<br>SPACE OR ENTER</div></div>';
    bindRestartOnce();
  }
}


function bindRestartOnce(){
  // One-shot bindings so we don't stack listeners like old pizza boxes.
  const restart = () => {
    pausedEl.style.display = 'none';
    state.mode = 'play';
    state.paused = false;
    resetRun();
    try{ VO_COUNTER.bump(); }catch(_){ }
  };

  const onKey = (e) => {
    if (e.code === 'Space' || e.code === 'Enter'){
      window.removeEventListener('keydown', onKey);
      restart();
    }
  };

  const onTap = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    pausedEl.removeEventListener('pointerdown', onTap);
    pausedEl.removeEventListener('touchstart', onTap);
    pausedEl.removeEventListener('click', onTap);
    restart();
  };

  window.addEventListener('keydown', onKey);

  pausedEl.addEventListener('pointerdown', onTap, { passive:false });
  pausedEl.addEventListener('touchstart', onTap, { passive:false });
  pausedEl.addEventListener('click', onTap, { passive:false });
}


function render(){
// TODO: co-op mode. probably a mistake. still tempted.

  // Rendering: draw lines, pretend it’s a spaceship. Classic.
  const w = canvas.width / DPR, h = canvas.height / DPR;

  // background
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,w,h);

  // global stroke style (vector vibe)
  ctx.lineWidth = 2;
  ctx.strokeStyle = PHOSPHOR.green;
  ctx.fillStyle = PHOSPHOR.green;

  
function asteroidColour(size){
  // size: 3 big, 2 medium, 1 small
  const t = Math.max(0, Math.min(1, (3 - size) / 2)); // 0 big => green, 1 small => blue
  // linear blend in RGB space, good enough for fake phosphor
  const g = [0,255,138];
  const b = [70,160,255];
  const c = [
    Math.round(g[0] + (b[0]-g[0])*t),
    Math.round(g[1] + (b[1]-g[1])*t),
    Math.round(g[2] + (b[2]-g[2])*t)
  ];
  return `rgba(${c[0]},${c[1]},${c[2]},0.92)`;
}

// draw asteroids
  for (const a of state.asteroids){
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.strokeStyle = asteroidColour(a.size);
    ctx.beginPath();
    for (let i=0;i<a.verts.length;i++){
      const p = a.verts[i];
      if (i===0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  // draw UFO
  if (state.ufo){
    const u = state.ufo;
    ctx.beginPath();
    ctx.ellipse(u.x, u.y, 22, 10, 0, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(u.x, u.y-6, 10, Math.PI, 0);
    ctx.stroke();
  }

  // draw bullets
  ctx.lineWidth = 2;
  
  // explosion lines (fx)
  for (const f of state.fx){
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.strokeStyle = f.col || PHOSPHOR.green;
    ctx.globalAlpha = Math.max(0, Math.min(1, f.life / 0.85));
    ctx.beginPath();
    // draw as a little segment in velocity direction
    const ang = Math.atan2(f.vy, f.vx);
    const x2 = Math.cos(ang) * f.len;
    const y2 = Math.sin(ang) * f.len;
    ctx.moveTo(0,0);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
for (const b of state.bullets){
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    ctx.stroke();
  }

  for (const b of state.ufoBullets){
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    ctx.stroke();
  }

  ctx.strokeStyle = PHOSPHOR.green;

  // draw ship
  const ship = state.ship;
  if (ship){
    const v = angleToVec(ship.a);
    const left = angleToVec(ship.a + 2.5);
    const right = angleToVec(ship.a - 2.5);

    const x1 = ship.x + v.x * 18;
    const y1 = ship.y + v.y * 18;
    const x2 = ship.x + left.x * 14;
    const y2 = ship.y + left.y * 14;
    const x3 = ship.x + right.x * 14;
    const y3 = ship.y + right.y * 14;

    if (ship.invuln > 0){
      ctx.strokeStyle = `rgba(0,255,204,${0.25 + 0.35*Math.sin(state.t*10)})`;
    } else {
      ctx.strokeStyle = PHOSPHOR.green;
    }

    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineTo(x3,y3);
    ctx.closePath();
    ctx.stroke();

    // thrust flame
    if (!state.paused && (KEYS.has('ArrowUp') || KEYS.has('KeyW'))){
      const back = angleToVec(ship.a + Math.PI);
      ctx.beginPath();
      ctx.moveTo(ship.x + back.x*14, ship.y + back.y*14);
      ctx.lineTo(ship.x + (back.x*24 + left.x*6), ship.y + (back.y*24 + left.y*6));
      ctx.lineTo(ship.x + (back.x*24 + right.x*6), ship.y + (back.y*24 + right.y*6));
      ctx.closePath();
      ctx.stroke();
    }
  }

  // HUD
  ctx.strokeStyle = PHOSPHOR.green;
  ctx.fillStyle = PHOSPHOR.green;
  ctx.lineWidth = 1;

  ctx.font = '14px system-ui, Arial';
  ctx.fillText(`SCORE ${state.score}`, 16, 22);
  ctx.fillText(`BEST ${state.best}`, 16, 42);
  ctx.fillText(`WAVE ${state.wave}`, 16, 62);

  ctx.fillText(`x${state.mult.toFixed(2)}`, w-84, 22);
  ctx.fillText(`LIVES ${Math.max(0, state.ship.lives)}`, w-120, 42);

  if (state.mode === 'upgrade'){
    // the DOM card is the UI, but a tiny canvas note helps with vibe
    ctx.font = '12px system-ui, Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('Upgrade pick in progress...', 16, h-18);
  }
}

// expose for the splash button
window.startGame = startGame;
/* Cabinet counter
   Not a server stat. It's the machine's own tally.
   Looks authentic, doesn't pretend to be analytics.
*/
const VO_COUNTER = (() => {
  const day = Math.floor(Date.now() / 86400000);
  let seed = Number(localStorage.getItem('vo_install_seed') || '0');
  if (!seed){
    seed = (Math.random() * 9000 + 1000) | 0;
    localStorage.setItem('vo_install_seed', String(seed));
  }
  let plays = Number(localStorage.getItem('vo_plays') || '0');
  function bump(){
    plays = (Number(localStorage.getItem('vo_plays') || '0') + 1) | 0;
    localStorage.setItem('vo_plays', String(plays));
    return get();
  }
  function get(){
    // base grows slowly each day, plus install seed, plus actual plays on this machine
    const base = 1200 + seed + (day % 5000);
    return base + plays;
  }
  return { bump, get };
})();

const playersEl = ensureDiv('players', {
  position: 'fixed', right: '10px', top: '10px',
  color: '#0f0', font: '14px monospace',
  zIndex: '9999', pointerEvents: 'none', whiteSpace: 'pre',
  textAlign: 'right'
});

