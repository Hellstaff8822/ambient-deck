"use client";

import { useEffect, useState, useRef } from "react";

const LOFI_BACKGROUNDS = [
  "/images/backgrounds/wp3806523-lo-fi-aesthetic-wallpapers.jpg",
  "/images/backgrounds/wp4649505-lofi-hip-hop-wallpapers.jpg",
  "/images/backgrounds/wp4918886-lo-fi-desktop-wallpapers.jpg",
  "/images/backgrounds/wp5694339-lofi-anime-1920x1080-wallpapers.jpg",
  "/images/backgrounds/wp6320933-blue-and-purple-anime-wallpapers.jpg",
  "/images/backgrounds/wp6358188-lofi-hip-hop-desktop-wallpapers.jpg",
  "/images/backgrounds/wp7159947-1920x1080-desktop-lofi-wallpapers.jpg",
  "/images/backgrounds/wp7159950-1920x1080-desktop-lofi-wallpapers.jpg",
  "/images/backgrounds/wp7159974-1920x1080-desktop-lofi-wallpapers.jpg",
  "/images/backgrounds/wp7160067-1920x1080-desktop-lofi-wallpapers.jpg",
  "/images/backgrounds/wp7160202-1920x1080-desktop-lofi-wallpapers.jpg",
  "/images/backgrounds/wp7160241-1920x1080-desktop-lofi-wallpapers.jpg",
  "/images/backgrounds/wp7160243-1920x1080-desktop-lofi-wallpapers.jpg",
];

const getLofiUrl = (currentUrl?: string) => {
  const filtered = LOFI_BACKGROUNDS.filter((url) => url !== currentUrl);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex] || LOFI_BACKGROUNDS[0];
};

export default function BackgroundManager() {
  const [activeBg, setActiveBg] = useState("");
  const [prevBg, setPrevBg] = useState("");
  const [isGlitching, setIsGlitching] = useState(false);
  const isFirstLoad = useRef(true);

  const changeBackground = () => {
    setActiveBg((currentActive) => {
      const nextBg = getLofiUrl(currentActive);
      if (!isFirstLoad.current) {
        setPrevBg(currentActive);
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 650);
      } else {
        isFirstLoad.current = false;
      }
      return nextBg;
    });
  };

  useEffect(() => {
    changeBackground();
    const interval = setInterval(changeBackground, 300000);
    return () => clearInterval(interval);
  }, []);

  if (!activeBg) {
    return <div className="fixed inset-0 z-0 bg-[#07050f]" />;
  }

  return (
    <div className="fixed inset-0 z-0 w-full h-full overflow-hidden bg-[#07050f] select-none pointer-events-none">
      <style>{`
        @keyframes ambientMove {
          0% { transform: scale(1.02) translate(0px, 0px); }
          50% { transform: scale(1.06) translate(-5px, 3px); }
          100% { transform: scale(1.02) translate(0px, 0px); }
        }
        @keyframes roomFlicker {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.28; }
          53% { opacity: 0.23; }
        }
        @keyframes glitchLine {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes staticNoise {
          0%, 100% { transform: translate(0,0); }
          20% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          60% { transform: translate(-1.5%, -0.5%); }
          80% { transform: translate(1.5%, 1.5%); }
        }
        .vhs-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.14'/%3E%3C/svg%3E");
        }
        .vhs-glitch-heavy {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='h'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.98' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23h)' opacity='0.45'/%3E%3C/svg%3E");
        }
      `}</style>

      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center blur-[60px] opacity-40 scale-110 transition-all duration-1000"
        style={{ backgroundImage: `url('${activeBg}')` }}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl aspect-video border-[8px] border-black bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden rounded-sm">
          {prevBg && (
            <div
              className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ${
                isGlitching ? "opacity-30" : "opacity-0"
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(10, 7, 20, 0.2), rgba(10, 7, 20, 0.4)), url('${prevBg}')`,
              }}
            />
          )}

          <div
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ${
              isGlitching
                ? "opacity-40 filter contrast-200 saturate-50"
                : "opacity-100"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(10, 7, 20, 0.25), rgba(10, 7, 20, 0.45)), url('${activeBg}')`,
              animation: isGlitching
                ? "none"
                : "ambientMove 40s ease-in-out infinite",
            }}
          />

          <div
            className={`absolute inset-0 w-[110%] h-[110%] vhs-glitch-heavy bg-purple-900/10 mix-blend-overlay ${
              isGlitching ? "block" : "hidden"
            }`}
            style={{ animation: "staticNoise 0.06s steps(1) infinite" }}
          />

          <div
            className={`absolute left-0 right-0 bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.4)] mix-blend-overlay transition-all ${
              isGlitching ? "h-[30px] opacity-70" : "h-0 opacity-0"
            }`}
            style={{
              animation: isGlitching
                ? "glitchLine 0.2s linear infinite"
                : "none",
            }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)] mix-blend-multiply" />
        </div>
      </div>

      <div
        className="absolute inset-0 w-[110%] h-[110%] vhs-noise mix-blend-screen pointer-events-none opacity-[0.45]"
        style={{ animation: "staticNoise 0.15s steps(2) infinite" }}
      />

      <div className="absolute inset-0 bg-white mix-blend-overlay pointer-events-none animate-[roomFlicker_0.2s_infinite]" />

      <div
        className="absolute left-0 right-0 h-[1px] bg-white/10 opacity-20 mix-blend-overlay"
        style={{ animation: "glitchLine 16s linear infinite" }}
      />
    </div>
  );
}
