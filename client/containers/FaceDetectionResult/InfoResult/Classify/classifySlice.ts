import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TClassifyState = {
  id: string;
  open: boolean;
  type: "filter" | "sort";
};

const initialState: TClassifyState = {
  id: "",
  open: false,
  type: "filter",
};

const classifySlice = createSlice({
  name: "classify",
  initialState,
  reducers: {
    setClassifyDisplay: (
      state,
      action: PayloadAction<{
        id: string;
        open: boolean;
        type: "filter" | "sort";
      }>
    ) => {
      const { id, open, type } = action.payload;

      state.id = id;
      state.open = open;
      state.type = type;
    },
  },
});

export const { setClassifyDisplay } = classifySlice.actions;
export default classifySlice.reducer;
