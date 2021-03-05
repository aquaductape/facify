import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type TTableState = {
  tables: TTableItem[];
};
type TTableItem = {
  id: string;
  scrollShadow: boolean;
  showStickyTHead: {
    active: boolean;
    activatedByInfoResultSentinel: boolean;
    activatedByTHeadSentinel: boolean;
  };
};

const initialState: TTableState = {
  tables: [],
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    addTable: (state, action: PayloadAction<TTableItem>) => {
      state.tables.push(action.payload);
    },
    setScrollShadow: (
      state,
      action: PayloadAction<{ id: string; scrollShadow: boolean }>
    ) => {
      const { id, scrollShadow } = action.payload;
      const result = state.tables.find((item) => item.id === id)!;
      result.scrollShadow = scrollShadow;
    },
    setShowStickyTHead: (
      state,
      action: PayloadAction<{
        id: string;
        active: boolean;
        triggeredBy: "infoResultSentinel" | "THeadSentinel";
      }>
    ) => {
      const { id, active, triggeredBy } = action.payload;
      const result = state.tables.find((item) => item.id === id)!;
      const { showStickyTHead } = result;

      if (active) {
        result.showStickyTHead.active = active;

        if (triggeredBy === "infoResultSentinel") {
          result.showStickyTHead.activatedByInfoResultSentinel = active;
        } else {
          result.showStickyTHead.activatedByTHeadSentinel = active;
        }
        return;
      }

      if (triggeredBy === "infoResultSentinel") {
        result.showStickyTHead.activatedByInfoResultSentinel = active;
        if (showStickyTHead.activatedByTHeadSentinel) return;

        result.showStickyTHead.active = active;
        return;
      }

      if (triggeredBy === "THeadSentinel") {
        result.showStickyTHead.activatedByTHeadSentinel = active;
        if (showStickyTHead.activatedByInfoResultSentinel) return;

        result.showStickyTHead.active = active;
        return;
      }
    },
  },
});

export const {
  addTable,
  setScrollShadow,
  setShowStickyTHead,
} = tableSlice.actions;
export default tableSlice.reducer;
