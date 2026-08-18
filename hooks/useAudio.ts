"use client";

import { useCallback, useEffect, useRef } from "react";

// Tumhare apne public folder ke 3 gaane (.mpeg format mein)
const BGM_LIST = [
  "/song1.mpeg",
  "/song2.mpeg",
  "/song3.mpeg"
];

// Naya, clear 'Pop' tap sound (.mp3 format)
const TAP_URL = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"; 

export function useAudio() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const tapRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Har baar app khulne par tumhare 3 gaano mein se ek random gaana select karne ka logic
    const randomBGM = BGM_LIST[Math.floor(Math.random() * BGM_LIST.length)];
    
    bgmRef.current = new Audio(randomBGM);
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.2; // Volume 20% rakhi hai taaki disturb na kare

    tapRef.current = new Audio(TAP_URL);
    tapRef.current.volume = 0.6;
  }, []);

  const toggleBGM = useCallback(async () => {
    if (!bgmRef.current) return false;
    try {
      if (bgmRef.current.paused) {
        await bgmRef.current.play();
        return true;
      }
      bgmRef.current.pause();
      return false;
    } catch (error) {
      console.error("BGM play/pause failed", error);
      return false;
    }
  }, []);

  const playTapSound = useCallback(async () => {
    if (!tapRef.current) return;
    try {
      tapRef.current.currentTime = 0;
      await tapRef.current.play();
    } catch (error) {
      console.error("Tap sound failed", error);
    }
  }, []);

  return { toggleBGM, playTapSound };
}