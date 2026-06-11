"use client";

import { useKnobDrag } from "@/hooks/useKnobDrag";

interface AudioKnobProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function AudioKnob({ label, value, onChange }: AudioKnobProps) {
  // Тепер хук повертає також onTouchStart для мобільних пристроїв
  const { onMouseDown, onWheel, onTouchStart } = useKnobDrag({ value, onChange });

  const minAngle = -135;
  const maxAngle = 135;
  const currentAngle = minAngle + value * (maxAngle - minAngle);

  const circumference = 238.76; 
  const arcLength = 179.07; 
  const strokeDashoffset = arcLength - value * arcLength;

  return (
    <div className="flex flex-col items-center gap-2 select-none font-mono relative">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        {label}
      </span>

      <div className="w-20 h-20 flex items-center justify-center relative">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="38" 
            fill="none" stroke="#161129" strokeWidth="5" 
            strokeDasharray={`${arcLength} ${circumference}`} 
            strokeLinecap="round" 
            transform="rotate(135 50 50)" 
          />
          <circle 
            cx="50" cy="50" r="38" 
            fill="none" stroke="#ff9e3b" strokeWidth="5" 
            strokeDasharray={`${arcLength} ${circumference}`} 
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" 
            transform="rotate(135 50 50)" 
            className="transition-all duration-75"
            style={{ filter: value > 0 ? `drop-shadow(0 0 4px #ff9e3b)` : "none" }}
          />
        </svg>

        <div
          onMouseDown={onMouseDown}
          onWheel={onWheel}
          onTouchStart={onTouchStart}
          className="w-13 h-13 rounded-full bg-[#201a36] border-2 border-black flex items-center justify-center relative 
                     cursor-ns-resize active:scale-[0.98] transition-all z-10 touch-none" 
          style={{
            boxShadow: `3px 3px 0px rgba(0,0,0,1), 0 0 ${value * 14}px rgba(255,158,59,${value * 0.6})`
          }}
        >
          <div
            className="absolute top-1 w-1 h-3 bg-[#ff9e3b] rounded-full origin-[center_22px] pointer-events-none"
            style={{
              transform: `rotate(${currentAngle}deg)`,
              filter: value > 0.1 ? `drop-shadow(0 0 2px #ff9e3b)` : "none"
            }}
          />

          <div className="w-7 h-7 rounded-full bg-[#161129] border border-black/40 pointer-events-none flex items-center justify-center">
            <div className="w-1 h-1 bg-[#201a36] rounded-full" />
          </div>
        </div>
      </div>

      <span 
        className="text-[10px] font-bold bg-black/60 px-2 py-0.5 text-[#ff9e3b] border border-white/5 transition-all"
        style={{ textShadow: value > 0 ? "0 0 4px #ff9e3b" : "none" }}
      >
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}