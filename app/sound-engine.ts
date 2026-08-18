"use client";

export type SoundType = "tick" | "levelup" | "achievement" | "delete";

export const playSound = (type: SoundType) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "tick") {
      // Quick satisfying pop
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) window.navigator.vibrate(30);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } 
    else if (type === "levelup") {
      // Victory arpeggio (Game winning feel)
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) window.navigator.vibrate([100, 50, 100, 50, 200]);
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12); osc.stop(ctx.currentTime + i * 0.12 + 0.3);
      });
    } 
    else if (type === "achievement") {
      // Sparkle/Chime sound for XP and Rewards
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
      [1200, 1600, 2000].forEach((freq, i) => {
         const osc = ctx.createOscillator();
         const gain = ctx.createGain();
         osc.type = "sine";
         osc.frequency.value = freq + (Math.random() * 50);
         gain.gain.setValueAtTime(0.15, ctx.currentTime);
         gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4 + i * 0.1);
         osc.connect(gain); gain.connect(ctx.destination);
         osc.start(ctx.currentTime + i * 0.05); osc.stop(ctx.currentTime + 0.6);
      });
    }
    else if (type === "delete") {
      // Low warning thud
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) window.navigator.vibrate([50, 50]);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.2);
    }
  } catch (error) {
    console.log("Audio not supported");
  }
};

const TAP_SOUND_URL = "https://actions.google.com/sounds/v1/cartoon/pop.ogg";
const BGM_TRACK_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

let bgmAudio: HTMLAudioElement | null = null;
let bgmPlaying = false;

export const playTapSound = () => {
  if (typeof window === "undefined") return;

  try {
    const tapAudio = new Audio(TAP_SOUND_URL);
    tapAudio.volume = 0.5;
    tapAudio.play().catch(() => {
      /* ignore autoplay restrictions until user interacts */
    });
  } catch (error) {
    console.log("Tap sound failed", error);
  }
};

export const toggleBGM = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    if (!bgmAudio) {
      bgmAudio = new Audio(BGM_TRACK_URL);
      bgmAudio.loop = true;
      bgmAudio.volume = 0.24;
      bgmAudio.crossOrigin = "anonymous";
    }

    if (bgmPlaying) {
      bgmAudio.pause();
      bgmPlaying = false;
    } else {
      bgmAudio.play().catch(() => {
        /* ignore autoplay restrictions until user interacts */
      });
      bgmPlaying = true;
    }
  } catch (error) {
    console.log("BGM toggle failed", error);
    bgmPlaying = false;
  }

  return bgmPlaying;
};