"use client";

interface ControlsProps {
  onOpenMixer: () => void;
  isActive: boolean;
  onToggleActive: () => void;
  onReset: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onShuffleTrack: () => void;
}

export default function Controls({
  onOpenMixer,
  isActive,
  onToggleActive,
  onReset,
  onNextTrack,
  onPrevTrack,
  onShuffleTrack,
}: ControlsProps) {
  return (
    <div className="w-full flex flex-col gap-3 font-['Press_Start_2P',monospace] select-none">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onToggleActive}
          className={`border-[4px] border-black p-3.5 flex items-center justify-center gap-2 text-[9px] font-bold uppercase cursor-pointer active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 ${
            isActive
              ? "bg-[#ef4444] text-white shadow-[4px_4px_0px_#000,0_0_15px_rgba(239,68,68,0.5)]"
              : "bg-[#a855f7] text-white hover:bg-[#c084fc] shadow-[4px_4px_0px_#000,0_0_15px_rgba(168,85,247,0.4)]"
          }`}
        >
          {isActive ? (
            <>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>START</span>
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="border-[4px] border-black bg-[#374151] p-3.5 flex items-center justify-center gap-2 text-slate-300 hover:text-white text-[9px] font-bold shadow-[4px_4px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer transition-transform duration-100"
        >
          <svg
            className="w-4 h-4 stroke-current fill-none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <polyline points="3 3 3 8 8 8" />
          </svg>
          <span>RESET</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onPrevTrack}
          className="border-[4px] border-black bg-[#1f2937] text-white py-3 flex items-center justify-center gap-1 text-[7.5px] font-bold shadow-[3px_3px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none cursor-pointer uppercase transition-transform duration-100"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M16 5v14l-11-7z" />
          </svg>
          <span>PREV</span>
        </button>

        <button
          onClick={onShuffleTrack}
          className="border-[4px] border-black bg-[#1f2937] text-white py-3 flex items-center justify-center gap-1 text-[7.5px] font-bold shadow-[3px_3px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none cursor-pointer uppercase transition-transform duration-100"
        >
          <img
            src="/images/shuffle.png"
            alt="Shuffle"
            className="w-4 h-4 object-contain [image-rendering:pixelated]"
          />
          <span>SHUFFLE</span>
        </button>

        <button
          onClick={onNextTrack}
          className="border-[4px] border-black bg-[#1f2937] text-white py-3 flex items-center justify-center gap-1 text-[7.5px] font-bold shadow-[3px_3px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none cursor-pointer uppercase transition-transform duration-100"
        >
          <span>NEXT</span>
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      <button
        onClick={onOpenMixer}
        className="w-full border-[4px] border-black bg-[#10b981] py-3.5 text-center text-black text-[9px] font-bold shadow-[4px_4px_0px_#000,0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[4px_4px_0px_#000,0_0_25px_rgba(16,185,129,0.7)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer uppercase tracking-wider transition-all duration-100"
      >
        [ OPEN SOUND MIXER ]
      </button>
    </div>
  );
}
