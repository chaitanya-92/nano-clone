import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ScrollPositions = Record<string, number>;

interface ScrollState {
  positions: ScrollPositions;
}

const initialState: ScrollState = {
  positions: {},
};

const scrollSlice = createSlice({
  name: "scroll",
  initialState,
  reducers: {
    setScrollPosition: (
      state,
      action: PayloadAction<{ key: string; position: number }>,
    ) => {
      state.positions[action.payload.key] = action.payload.position;
    },
  },
});

export const { setScrollPosition } = scrollSlice.actions;

export default scrollSlice.reducer;