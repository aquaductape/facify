import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type TTableState = {
  scrollShadow: boolean;
  showStickyTHead: boolean;
};

const initialState: TTableState = {
  scrollShadow: true,
  showStickyTHead: false,
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setScrollShadow: (state, action: PayloadAction<boolean>) => {
      state.scrollShadow = action.payload;
    },
    setShowStickyTHead: (state, action: PayloadAction<boolean>) => {
      state.showStickyTHead = action.payload;
    },
  },
});

export const { setScrollShadow, setShowStickyTHead } = tableSlice.actions;
export default tableSlice.reducer;
