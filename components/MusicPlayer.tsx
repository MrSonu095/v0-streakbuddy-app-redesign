"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Client-side par audio load karna taaki error na aaye
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
      audioRef.current.loop = true; 
      audioRef.current.volume = 0.2; // Volume thoda low rakha hai
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Browser ne music block kiya:", err);
      });
    }
  };

  return (
    <button 
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 p-3 px-4 bg-zinc-900 border-2 border-zinc-700 text-white font-bold rounded-full shadow-2xl z-50 flex items-center gap-2 hover:scale-105 transition-all"
    >
      {isPlaying ? "🔊 BGM" : "🔇 BGM"}
    </button>
  );
}