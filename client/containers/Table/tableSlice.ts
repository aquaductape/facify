import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type TTableState = {
  scrollShadow: boolean;
  showStickyTHead: {
    active: boolean;
    activatedByInfoResultSentinel: boolean;
    activatedByTHeadSentinel: boolean;
  };
};

const initialState: TTableState = {
  scrollShadow: true,
  showStickyTHead: {
    active: false,
    activatedByInfoResultSentinel: false,
    activatedByTHeadSentinel: false,
  },
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setScrollShadow: (state, action: PayloadAction<boolean>) => {
      state.scrollShadow = action.payload;
    },
    setShowStickyTHead: (
      state,
      action: PayloadAction<{
        active: boolean;
        triggeredBy: "infoResultSentinel" | "THeadSentinel";
      }>
    ) => {
      const { active, triggeredBy } = action.payload;
      const { showStickyTHead } = state;

      if (active) {
        state.showStickyTHead.active = active;

        if (triggeredBy === "infoResultSentinel") {
          state.showStickyTHead.activatedByInfoResultSentinel = active;
        } else {
          state.showStickyTHead.activatedByTHeadSentinel = active;
        }
        return;
      }

      if (triggeredBy === "infoResultSentinel") {
        state.showStickyTHead.activatedByInfoResultSentinel = active;
        if (showStickyTHead.activatedByTHeadSentinel) return;

        state.showStickyTHead.active = active;
        return;
      }

      if (triggeredBy === "THeadSentinel") {
        state.showStickyTHead.activatedByTHeadSentinel = active;
        if (showStickyTHead.activatedByInfoResultSentinel) return;

        state.showStickyTHead.active = active;
        return;
      }
    },
  },
});

export const { setScrollShadow, setShowStickyTHead } = tableSlice.actions;
export default tableSlice.reducer;
