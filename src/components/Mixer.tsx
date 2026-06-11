"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store"; 
import { setVolume } from "@/store/audioSlice";
import AudioKnob from "./ui/AudioKnob";

interface MixerProps {
  onClose: () => void;
}

export default function Mixer({ onClose }: MixerProps) {
  const dispatch = useDispatch();
  const volumes = useSelector((state: RootState) => state.audio.volumes);

  return (
    <div className="w-full flex flex-col gap-4 select-none font-['Press_Start_2P',monospace] text-white">
      
      <div className="flex justify-between items-center text-[7px] text-slate-400 font-bold tracking-wider uppercase gap-2">
        <span className="whitespace-nowrap">3-CHANNEL SIGNAL MIXER</span>
        <button
          onClick={onClose}
          className="text-[#ef4444] hover:text-red-400 cursor-pointer font-bold text-[8px] transition-colors whitespace-nowrap bg-transparent border-none p-0"
        >
          [ X CLOSE ]
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-[#0c0916] border-[4px] border-black p-4 relative shadow-[inset_0px_4px_0px_rgba(0,0,0,0.6)]">
        <AudioKnob
          label="MASTER"
          value={volumes.master}
          onChange={(val) =>
            dispatch(setVolume({ channel: "master", value: val }))
          }
        />
        <AudioKnob
          label="RAIN"
          value={volumes.ambientRain}
          onChange={(val) =>
            dispatch(setVolume({ channel: "ambientRain", value: val }))
          }
        />
        <AudioKnob
          label="FIRE"
          value={volumes.ambientFire}
          onChange={(val) =>
            dispatch(setVolume({ channel: "ambientFire", value: val }))
          }
        />
      </div>

      <div className="text-[6px] text-center text-slate-500 font-medium leading-normal uppercase tracking-wide">
        ▲ DRAG UP/DOWN OR USE SCROLL ▲
      </div>
    </div>
  );
}