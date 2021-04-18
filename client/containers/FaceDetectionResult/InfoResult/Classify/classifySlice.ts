import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TClassifyState = {
  id: string;
  parentIdx: number;
  open: boolean;
  type: "filter" | "sort";
};

const initialState: TClassifyState = {
  id: "",
  parentIdx: 0,
  open: false,
  type: "filter",
};

const classifySlice = createSlice({
  name: "classify",
  initialState,
  reducers: {
    setClassifyDisplay: (
      state,
      action: PayloadAction<
        Partial<{
          id: string;
          parentIdx: number;
          open: boolean;
          type: "filter" | "sort";
        }>
      >
    ) => {
      const { payload } = action;

      for (const key in payload) {
        // @ts-ignore
        state[key] = payload[key];
      }
    },
  },
});

export const { setClassifyDisplay } = classifySlice.actions;
export default classifySlice.reducer;
