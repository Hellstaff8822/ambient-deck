"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  tick,
  toggleTimer,
  resetTimer,
  changePreset,
} from "@/store/timerSlice";
import Screen from "@/components/Screen";
import Mixer from "@/components/Mixer";
import Controls from "@/components/Controls";
import BackgroundManager from "@/components/BackgroundManager";

const YOUTUBE_STREAMS = [
  "X4VbdwhkE10",
  "4xDzrJKXOOY",
  "GSfT7H87zq4",
  "xORCbIptqcc",
  "E2vONfzoyRI",
];

export default function Home() {
  const dispatch = useDispatch();
  const { minutes, seconds, isActive, mode, initialMinutes, selectedPreset } =
    useSelector((state: RootState) => state.timer);

  const volumes = useSelector((state: RootState) => state.audio.volumes);

  const [isMixerOpen, setIsMixerOpen] = useState(false);
  const [streamIndex, setStreamIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(0);

  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({
    rain: typeof Audio !== "undefined" ? new Audio("/audio/rain.mp3") : null,
    fire: typeof Audio !== "undefined" ? new Audio("/audio/fire.mp3") : null,
    alarm: typeof Audio !== "undefined" ? new Audio("/audio/alarm.mp3") : null,
  });

  const fadeIntervals = useRef<{ [key: string]: NodeJS.Timeout | null }>({
    rain: null,
    fire: null,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 800);
          return 100;
        }
        return prev + 5;
      });
    }, 110);

    return () => clearInterval(interval);
  }, []);

  const handleNextStream = useCallback(() => {
    setStreamIndex((prev) => (prev + 1) % YOUTUBE_STREAMS.length);
  }, []);

  const handlePrevStream = useCallback(() => {
    setStreamIndex(
      (prev) => (prev - 1 + YOUTUBE_STREAMS.length) % YOUTUBE_STREAMS.length,
    );
  }, []);

  const handleShuffleStream = useCallback(() => {
    if (YOUTUBE_STREAMS.length <= 1) return;
    let randomIndex = streamIndex;
    while (randomIndex === streamIndex) {
      randomIndex = Math.floor(Math.random() * YOUTUBE_STREAMS.length);
    }
    setStreamIndex(randomIndex);
  }, [streamIndex]);

  useEffect(() => {
    if (minutes === 0 && seconds === 0 && isActive) {
      audioRefs.current.alarm?.play().catch(console.error);
    }
  }, [minutes, seconds, isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => dispatch(tick()), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, dispatch]);

  useEffect(() => {
    const { rain, fire } = audioRefs.current;
    if (rain && !fadeIntervals.current.rain) rain.volume = volumes.ambientRain;
    if (fire && !fadeIntervals.current.fire) fire.volume = volumes.ambientFire;
  }, [volumes]);

  useEffect(() => {
    const { rain, fire } = audioRefs.current;

    const fadeOut = (
      audio: HTMLAudioElement | null,
      targetVolume: number,
      key: string,
    ) => {
      if (!audio || audio.paused) return;
      if (fadeIntervals.current[key])
        clearInterval(fadeIntervals.current[key]!);

      const startVolume = audio.volume;
      const duration = 800;
      const stepTime = 50;
      const steps = duration / stepTime;
      const volumeStep = startVolume / steps;

      fadeIntervals.current[key] = setInterval(() => {
        if (audio.volume > volumeStep) {
          audio.volume -= volumeStep;
        } else {
          clearInterval(fadeIntervals.current[key]!);
          fadeIntervals.current[key] = null;
          audio.pause();
          audio.volume = targetVolume;
        }
      }, stepTime);
    };

    if (isActive) {
      Object.keys(fadeIntervals.current).forEach((key) => {
        if (fadeIntervals.current[key]) {
          clearInterval(fadeIntervals.current[key]!);
          fadeIntervals.current[key] = null;
        }
      });

      if (rain) rain.volume = volumes.ambientRain;
      if (fire) fire.volume = volumes.ambientFire;

      rain?.play().catch(console.error);
      fire?.play().catch(console.error);
    } else {
      fadeOut(rain, volumes.ambientRain, "rain");
      fadeOut(fire, volumes.ambientFire, "fire");
    }

    return () => {
      Object.keys(fadeIntervals.current).forEach((key) => {
        if (fadeIntervals.current[key])
          clearInterval(fadeIntervals.current[key]!);
      });
    };
  }, [isActive, volumes]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#06040a] flex flex-col items-center justify-center font-['Press_Start_2P',monospace] text-white select-none p-4 z-50">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-30 z-20" />

        <style>{`
          @keyframes deck-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          @keyframes screen-blink {
            0%, 100% { background-color: #a855f7; }
            50% { background-color: #00ffff; }
          }
          .animate-mini-deck {
            animation: deck-bounce 0.4s steps(2) infinite;
          }
          .animate-deck-screen {
            animation: screen-blink 0.6s steps(1) infinite;
          }
        `}</style>

        <div className="w-full max-w-sm flex flex-col items-center">
          <h1 className="text-[25px] font-black tracking-tighter text-center uppercase mb-1 [text-shadow:4px_4px_0px_#000] flex justify-center gap-[2px] w-full">
            <span className="text-[#3b82f6]">A</span>
            <span className="text-[#4f46e5]">M</span>
            <span className="text-[#5a56e9]">B</span>
            <span className="text-[#6366f1]">I</span>
            <span className="text-[#7c3aed]">E</span>
            <span className="text-[#8b5cf6]">N</span>
            <span className="text-[#9d4edd]">T</span>
            <span className="text-[#a855f7] ml-1.5">D</span>
            <span className="text-[#b566ff]">E</span>
            <span className="text-[#c084fc]">C</span>
            <span className="text-[#d8b4fe]">K</span>
          </h1>

          <div className="text-[7px] text-purple-400/50 uppercase tracking-[2px] mb-12 text-center [text-shadow:1px_1px_0px_#000]">
            [ SYSTEM INITIALIZATION ]
          </div>

          <div className="w-full relative h-16 flex items-center justify-center mb-6">
            <div className="w-3 h-2 bg-[#251c42] relative scale-[3.8] border border-black shadow-[2px_2px_0px_#000] animate-mini-deck">
              <div className="absolute w-1.5 h-1 left-[1px] top-[1px] border border-black animate-deck-screen" />
              <div
                className="absolute inset-0"
                style={{
                  boxShadow: `
                    -1px 1px #110d20, 0px 1px #110d20, 1px 1px #110d20,
                    2px 1px #ff9e3b, 3px 1px #10b981, 
                    -1px 2px #000, 0px 2px #000, 1px 2px #000, 2px 2px #000, 3px 2px #000
                  `,
                }}
              />
            </div>
          </div>

          <div className="w-full h-8 bg-[#110d20] border-[4px] border-black p-1 relative shadow-[5px_5px_0px_#000]">
            <div
              className="h-full bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#c084fc] border-r-4 border-black transition-all duration-150 ease-out"
              style={{ width: `${loadingPercent}%` }}
            />
          </div>

          <div className="w-full flex justify-between items-center text-[10px] font-bold mt-4 tracking-wider [text-shadow:2px_2px_0px_#000]">
            <span className="animate-pulse text-white">BOOTING UP...</span>
            <span className="text-[#c084fc]">{loadingPercent}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative w-screen h-screen flex items-center justify-center bg-transparent p-4 font-['Press_Start_2P',monospace]">
      <BackgroundManager />

      {minutes === 0 && seconds === 0 && isActive && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90">
          <div className="bg-[#1b1530] border-[6px] border-black p-6 text-center shadow-[8px_8px_0px_#000] max-w-xs w-full">
            <h2 className="text-[10px] text-white mb-6 leading-relaxed">
              {mode === "work" ? "SESSION DONE!" : "BREAK OVER!"}
            </h2>
            <button
              onClick={() => dispatch(resetTimer())}
              className="w-full border-[4px] border-black bg-[#10b981] text-black py-3 text-[9px] font-bold shadow-[4px_4px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
            >
              [ OK ]
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md p-6 bg-[#251c42] border-[6px] border-black shadow-[12px_12px_0px_#000] relative z-10">
        <Screen
          minutes={minutes}
          seconds={seconds}
          mode={mode}
          isActive={isActive}
          masterVolume={volumes.master}
          currentVideoId={YOUTUBE_STREAMS[streamIndex]}
          initialMinutes={initialMinutes}
        />

        {!isMixerOpen &&
          (mode === "work" ? (
            <div className="grid grid-cols-2 gap-3 text-[8px] mt-4">
              <button
                onClick={() => dispatch(changePreset("work25"))}
                className={`border-[4px] border-black py-2.5 font-bold uppercase cursor-pointer transition-all duration-75 text-center
          ${
            selectedPreset === "work25"
              ? "bg-[#ff9e3b] text-black shadow-[1px_1px_0px_#000] translate-x-[2px] translate-y-[2px] [text-shadow:0_1px_0px_rgba(255,255,255,0.4)]"
              : "bg-[#1f2937] text-slate-400 shadow-[3px_3px_0px_#000] hover:text-white hover:bg-[#253141] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          }`}
              >
                25M CLASSIC
              </button>

              <button
                onClick={() => dispatch(changePreset("work50"))}
                className={`border-[4px] border-black py-2.5 font-bold uppercase cursor-pointer transition-all duration-75 text-center
          ${
            selectedPreset === "work50"
              ? "bg-[#ff9e3b] text-black shadow-[1px_1px_0px_#000] translate-x-[2px] translate-y-[2px] [text-shadow:0_1px_0px_rgba(255,255,255,0.4)]"
              : "bg-[#1f2937] text-slate-400 shadow-[3px_3px_0px_#000] hover:text-white hover:bg-[#253141] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          }`}
              >
                50M DEEP
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-[8px] mt-4">
              <button
                onClick={() => dispatch(changePreset("break5"))}
                className={`border-[4px] border-black py-2.5 font-bold uppercase cursor-pointer transition-all duration-75 text-center
          ${
            selectedPreset === "break5"
              ? "bg-[#10b981] text-black shadow-[1px_1px_0px_#000] translate-x-[2px] translate-y-[2px] [text-shadow:0_1px_0px_rgba(255,255,255,0.3)]"
              : "bg-[#1f2937] text-slate-400 shadow-[3px_3px_0px_#000] hover:text-white hover:bg-[#253141] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          }`}
              >
                5M SHORT
              </button>

              <button
                onClick={() => dispatch(changePreset("break15"))}
                className={`border-[4px] border-black py-2.5 font-bold uppercase cursor-pointer transition-all duration-75 text-center
          ${
            selectedPreset === "break15"
              ? "bg-[#10b981] text-black shadow-[1px_1px_0px_#000] translate-x-[2px] translate-y-[2px] [text-shadow:0_1px_0px_rgba(255,255,255,0.3)]"
              : "bg-[#1f2937] text-slate-400 shadow-[3px_3px_0px_#000] hover:text-white hover:bg-[#253141] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          }`}
              >
                15M LONG
              </button>
            </div>
          ))}

        <div className="mt-5">
          {!isMixerOpen ? (
            <Controls
              onOpenMixer={() => setIsMixerOpen(true)}
              isActive={isActive}
              onToggleActive={() => dispatch(toggleTimer())}
              onReset={() => dispatch(resetTimer())}
              onNextTrack={handleNextStream}
              onPrevTrack={handlePrevStream}
              onShuffleTrack={handleShuffleStream}
            />
          ) : (
            <div className="border-[4px] border-black bg-[#1b1530] p-4 shadow-[4px_4px_0px_#000]">
              <Mixer onClose={() => setIsMixerOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
