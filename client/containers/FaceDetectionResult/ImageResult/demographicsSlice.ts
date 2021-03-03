import { createSlice, PayloadAction, PrepareAction } from "@reduxjs/toolkit";
import { TDemographics } from "../../../ts";
type TDemographicsDisplay = {
  id: string;
  hoverActive: boolean;
  scrollIntoView: boolean;
};
type TImageResultState = {
  demographics: TDemographics[];
  demographicsDisplay: TDemographicsDisplay[];
  hoverActive: boolean;
  imageHeight: number | null;
};

const initialState: TImageResultState = {
  demographics: [],
  demographicsDisplay: [],
  hoverActive: false,
  imageHeight: null,
};

const demographicsSlice = createSlice({
  name: "demographics",
  initialState,
  reducers: {
    setDemographics: (state, action: PayloadAction<TDemographics[]>) => {
      state.demographics = action.payload;
    },
    setDemographicsDisplay: (state, action: PayloadAction<TDemographics[]>) => {
      const result: TDemographicsDisplay[] = [];
      action.payload.forEach((item) => {
        const resultItem: TDemographicsDisplay = {
          id: item.id,
          hoverActive: false,
          scrollIntoView: false,
        };
        result.push(resultItem);
      });

      state.demographicsDisplay = result;
    },
    setDemoItemHoverActive: (
      state,
      action: PayloadAction<{
        id: string;
        active: boolean;
        scrollIntoView?: boolean;
      }>
    ) => {
      const { id, active, scrollIntoView } = action.payload;

      const item = state.demographicsDisplay.find((demo) => demo.id === id)!;
      item.hoverActive = active;

      if (scrollIntoView != null) {
        item.scrollIntoView = scrollIntoView;
      }
    },
    setHoverActive: (state, action: PayloadAction<{ active: boolean }>) => {
      const { active } = action.payload;
      state.hoverActive = active;
    },
    setImageHeight: (state, action: PayloadAction<number | null>) => {
      state.imageHeight = action.payload;
    },
  },
});

export const {
  setDemographics,
  setDemographicsDisplay,
  setDemoItemHoverActive,
  setHoverActive,
  setImageHeight,
} = demographicsSlice.actions;
export default demographicsSlice.reducer;
