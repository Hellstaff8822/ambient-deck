import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimerState } from "@/types/deck";

interface ExtendedTimerState extends TimerState {
  initialMinutes: number;
  selectedPreset: "work25" | "work50" | "break5" | "break15";
}

const initialState: ExtendedTimerState = {
  minutes: 25,
  seconds: 0,
  initialMinutes: 25,
  isActive: false,
  mode: "work",
  selectedPreset: "work25",
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    toggleTimer: (state) => {
      state.isActive = !state.isActive;
    },
    tick: (state) => {
      if (state.seconds > 0) {
        state.seconds -= 1;
      } else if (state.minutes > 0) {
        state.minutes -= 1;
        state.seconds = 59;
      } else {
        state.isActive = false; 
        state.seconds = 0;

        if (state.mode === "work") {
          state.mode = "break";
          state.initialMinutes = 5;
          state.minutes = 5;
          state.selectedPreset = "break5";
        } else {
          state.mode = "work";
          state.initialMinutes = 25;
          state.minutes = 25;
          state.selectedPreset = "work25";
        }
      }
    },
    resetTimer: (state) => {
      state.minutes = state.initialMinutes;
      state.seconds = 0;
      state.isActive = false;
    },
    changePreset: (
      state,
      action: PayloadAction<"work25" | "work50" | "break5" | "break15">,
    ) => {
      state.isActive = false; 
      state.seconds = 0;
      state.selectedPreset = action.payload;

      switch (action.payload) {
        case "work25":
          state.mode = "work";
          state.initialMinutes = 25;
          state.minutes = 25;
          break;
        case "work50":
          state.mode = "work";
          state.initialMinutes = 50;
          state.minutes = 50;
          break;
        case "break5":
          state.mode = "break";
          state.initialMinutes = 5;
          state.minutes = 5;
          break;
        case "break15":
          state.mode = "break";
          state.initialMinutes = 15;
          state.minutes = 15;
          break;
      }
    },
  },
});

export const { toggleTimer, tick, resetTimer, changePreset } =
  timerSlice.actions;
export default timerSlice.reducer;