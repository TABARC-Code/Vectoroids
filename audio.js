// audio.js
// Neocities free tier: audio files are smuggled as base64 text.
// WebAudio only. No <audio>. No data: URLs. No hopes and prayers.
//
// Debug: if you hear nothing, open console or look at #audioDebug.
// window.VO_AUDIO
// TODO: add tiny scanline jitter slider. subtle. nasty.
_DEBUG.lastError will tell you what broke.

(function
// TODO: coin drop sound + fake credits counter. make it lie convincingly.
(){
  'use strict';

// it's cold and snowing. browsers still expect a user gesture. i expect coffee.


// it's cold and snowing. the crt's warm, i'm not. need coffee.


  const DEBUG = true;

  let AC = null;
  let master = null;
  let muted = false;
  let masterVol = 0.30;

  const buffers = new Map();
  const inflight = new Map();

  // Map logical names to Neocities-safe base64 payloads.
  const SFX = {
    fire:      'sound/fire.txt',
    ufo:       'sound/ufo.txt',
    teleport:  'sound/teleport.txt',
    expSmall:  'sound/expSmall.txt',
    expMedium: 'sound/expMedium.txt',
    expLarge:  'sound/expLarge.txt',
    hiss:      'sound/hiss.txt'
  };

  function dbgEl(){
    return document.getElementById('audioDebug');
  }

  function logErr(where, err){
    const e = err || new Error('unknown audio error');
    window.VO_AUDIO_DEBUG = window.VO_AUDIO_DEBUG || {};
    window.VO_AUDIO_DEBUG.lastError = { where, message: String(e), stack: e && e.stack ? e.stack : null };
    if (DEBUG) console.error('AUDIO', where, e);
    const el = dbgEl();
    if (el){
      el.style.display = 'block';
      el.textContent = 'AUDIO ERROR: ' + where + ' | ' + String(e);
    }
  }

  function ensureAC(){
    try{
      if (!AC){
        AC = new (window.AudioContext || window.webkitAudioContext)();
        master = AC.createGain();
        master.gain.value = masterVol;
        master.connect(AC.destination);
      }
    }catch(err){
      logErr('ensureAC', err);
    }
  }

  async function fetchBase64(url){
    const r = await fetch(
// TODO: co-op mode. probably a mistake. still tempted.
url, { cache: 'no-store' });
    if (!r.ok) throw new Error('fetch failed ' + url + ' ' + r.status);
    // Strip all whitespace. Neocities editors/uploads love inserting line breaks.
    return (await r.text()).replace(/\s+/g, '');
  }

  function b64ToArrayBuffer(b64){
    const bin = atob(b64);
    const len = bin.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }

  async function load(name){
    if (buffers.has(name)) return buffers.get(name);
    if (inflight.has(name)) return inflight.get(name);

    ensureAC();
    const p = (async () => {
      const url = SFX[name];
      if (!url) throw new Error('unknown sfx ' + name);
      const b64 = await fetchBase64(url);
      const ab = b64ToArrayBuffer(b64);
      const buf = await AC.decodeAudioData(ab.slice(0));
      buffers.set(name, buf);
      inflight.delete(name);
      return buf;
    })().catch(err => {
      inflight.delete(name);
      logErr('load:' + name, err);
      throw err;
    });

    inflight.set(name, p);
    return p;
  }

  function play(name, opts){
    if (FAIL[name]) return;

    if (muted) return;
    ensureAC();
    if (!AC) return;

    if (AC.state === 'suspended'){
      // Attempt resume; if gesture wasn't valid, browser will ignore.
      AC.resume().catch(err => logErr('resume', err));
    }

    const o = opts || {};
    const gain = (typeof o.gain === 'number') ? o.gain : 1.0;
    const loop = !!o.loop;
    const rateJitter = (typeof o.rateJitter === 'number') ? o.rateJitter : 0;

    load(name).then(buf => {
      const src = AC.createBufferSource();
      src.buffer = buf;
      src.loop = loop;

      if (rateJitter){
        const j = (Math.random() * 2 - 1) * rateJitter;
        src.playbackRate.value = 1 + j;
      }

      const g = AC.createGain();
      g.gain.value = Math.max(0, gain);

      src.connect(g);
      g.connect(master);
      src.start(0);
    }).catch(() => {});
  }

  // iOS/Safari unlock: play a silent tick once on gesture.
  function unlockTick(){
    try{
      ensureAC();
      if (!AC) return;
      const buf = AC.createBuffer(1, 1, 22050);
      const src = AC.createBufferSource();
      src.buffer = buf;
      src.connect(master);
      src.start(0);
    }catch(err){
      logErr('unlockTick', err);
    }
  }

  let hissStarted = false;
  function startHiss(){
    if (hissStarted) return;
    hissStarted = true;
    // base hiss level, then -27% per your instruction
    const base = 0.20;
    const hissGain = base * 0.73;
    play('hiss', { loop: true, gain: hissGain });
  }

  async function arm(){
    if (ARMED) return;
    ARMED = true;
    try{
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume().catch(()=>{});
    }catch(_){
      // audio can fail. do not make it a personality trait.
    }
  }catch(err){
      logErr('arm', err);
    }
  }

  function toggleMute(){
    muted = !muted;
  }

  function setMasterVolume(v){
    masterVol = Math.max(0, Math.min(1, v));
    if (master) master.gain.value = masterVol;
  }

  window.VO_AUDIO = { arm, play, toggleMute, setMasterVolume, SFX };
})();
