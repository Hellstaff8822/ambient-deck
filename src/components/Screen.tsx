"use client";

import { useEffect, useRef } from "react";

interface ScreenProps {
  minutes: number;
  seconds: number;
  mode: "work" | "break";
  isActive: boolean;
  masterVolume: number;
  currentVideoId: string;
  initialMinutes: number;
}

export default function Screen({
  minutes,
  seconds,
  mode,
  isActive,
  masterVolume,
  currentVideoId,
  initialMinutes,
}: ScreenProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const totalSeconds = initialMinutes * 60;
  const currentSecondsLeft = minutes * 60 + seconds;

  const progress =
    totalSeconds > 0
      ? ((totalSeconds - currentSecondsLeft) / totalSeconds) * 100
      : 0;

  const elapsedTotalSeconds = Math.max(0, totalSeconds - currentSecondsLeft);
  const elapsedMin = Math.floor(elapsedTotalSeconds / 60);
  const elapsedSec = Math.floor(elapsedTotalSeconds % 60);

  const formatTime = (min: number, sec: number) =>
    `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;

  const formatTotalTime = (totalMin: number) => {
    const totalSecs = Math.round(totalMin * 60);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    const command = isActive ? "playVideo" : "pauseVideo";
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: command, args: "" }),
      "*",
    );
  }, [isActive]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    const volumePercent = Math.round(masterVolume * 100);
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "setVolume",
        args: [volumePercent],
      }),
      "*",
    );
  }, [masterVolume, currentVideoId, isActive]);

  const iframeSrc = `https://www.youtube.com/embed/${currentVideoId}?enablejsapi=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&loop=1&disablekb=1&playlist=${currentVideoId}${isActive ? "&autoplay=1" : ""}`;

  return (
    <div className="w-full flex flex-col gap-4 font-['Press_Start_2P',monospace] select-none text-white">
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes crt-beam {
          0% { top: -20%; }
          100% { top: 120%; }
        }
        @keyframes crt-flicker {
          0% { opacity: 0.18; }
          50% { opacity: 0.23; }
          100% { opacity: 0.19; }
        }
        .animate-crt-beam {
          animation: crt-beam 8s linear infinite;
        }
        .animate-crt-flicker {
          animation: crt-flicker 0.15s infinite;
        }
      `}</style>

      <div className="w-full aspect-video border-[6px] border-black bg-black overflow-hidden relative shadow-[6px_6px_0px_#000] rounded-sm">
        <iframe
          ref={iframeRef}
          key={currentVideoId}
          className={`absolute w-[165%] h-[165%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none transition-opacity duration-500 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
          src={iframeSrc}
          title="Lofi Radio Monitor"
          allow="autoplay; encrypted-media"
        />

        {!isActive && (
          <div className="absolute inset-0 z-5 flex flex-col items-center justify-center bg-[#0c0a12]/95">
            <div className="text-[9px] text-[#c084fc] tracking-[3px] mb-1 animate-pulse duration-[1500ms]">
              [ SYSTEM PAUSED ]
            </div>
            <div className="text-[6px] text-slate-500 uppercase">
              Ready to focus
            </div>
          </div>
        )}

        <div className="absolute inset-0 z-10 bg-transparent cursor-default" />

        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-transparent via-black/20 to-transparent bg-[length:100%_6px] mix-blend-overlay" />
        <div className="absolute left-0 w-full h-20 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent opacity-40 pointer-events-none z-20 animate-crt-beam" />
        <div className="absolute inset-0 z-25 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)] mix-blend-multiply" />
        <div className="absolute inset-0 z-25 pointer-events-none bg-white opacity-20 mix-blend-overlay animate-crt-flicker" />

        <div
          className={`absolute top-2 left-2 z-30 border-2 border-black px-2 py-1 text-[8px] font-bold shadow-[2px_2px_0px_#000] transition-colors duration-300 ${
            mode === "work"
              ? "bg-[#ef4444] text-white"
              : "bg-[#10b981] text-black"
          }`}
        >
          {mode === "work" ? "FOCUS" : "BREAK"}
        </div>
      </div>

      <div className="w-full">
        <div className="h-6 w-full bg-[#110d20] border-[4px] border-black p-0.5 relative shadow-[4px_4px_0px_#000]">
          <div
            className="h-full bg-[#a855f7] border-r-4 border-black transition-all duration-300 ease-out"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[8px] text-slate-400 mt-2 tracking-tight font-bold">
          <span>{formatTime(elapsedMin, elapsedSec)}</span>
          <span>{formatTotalTime(initialMinutes)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-[#0c0916] border-[4px] border-black shadow-[4px_4px_0px_#000]">
        <span className="text-[8px] text-slate-400 uppercase">Time Left:</span>
        <div
          className={`text-lg tracking-widest font-bold transition-all ${
            isActive ? "text-[#c084fc] animate-pulse" : "text-slate-200"
          }`}
        >
          {formatTime(minutes, seconds)}
        </div>
      </div>
    </div>
  );
}
