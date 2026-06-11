import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AudioState } from "@/types/deck";

const initialState: AudioState = {
  isPlaying: false,
  currentTrack: null,
  playlist: [],
  volumes: {
    master: 0.5,
    ambientRain: 0.0,
    ambientFire: 0.0,
  },
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setVolume: (
      state,
      action: PayloadAction<{
        channel: keyof AudioState["volumes"];
        value: number;
      }>,
    ) => {
      state.volumes[action.payload.channel] = action.payload.value;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
  },
});

export const { setVolume, togglePlay } = audioSlice.actions;
export default audioSlice.reducer;
