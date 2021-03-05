import { createSlice, PayloadAction, PrepareAction } from "@reduxjs/toolkit";
import { TDemographics } from "../../../ts";
type TDemographicsDisplay = {
  id: string;
  hoverActive: boolean;
  scrollIntoView: boolean;
};
type TDemographicsItem = {
  id: string;
  data: TDemographics[];
  display: TDemographicsDisplay[];
  imageHeight: number | null;
  hoverActive: boolean;
};

type TImageResultState = {
  demographics: TDemographicsItem[];
};

const initialState: TImageResultState = {
  demographics: [],
};

const demographicsSlice = createSlice({
  name: "demographics",
  initialState,
  reducers: {
    addDemographics: (
      state,
      action: PayloadAction<Omit<TDemographicsItem, "display">>
    ) => {
      const demographic = action.payload as TDemographicsItem;

      const result: TDemographicsDisplay[] = [];
      demographic.data.forEach((item) => {
        const resultItem: TDemographicsDisplay = {
          id: item.id,
          hoverActive: false,
          scrollIntoView: false,
        };
        result.push(resultItem);
      });

      demographic.display = result;
      console.log("ran");
      state.demographics.push(demographic);
    },
    setDemoItemHoverActive: (
      state,
      action: PayloadAction<{
        id: string;
        demographicId: string;
        active: boolean;
        scrollIntoView?: boolean;
      }>
    ) => {
      const { id, demographicId, active, scrollIntoView } = action.payload;

      const result = state.demographics.find((item) => item.id === id)!;
      const item = result.display.find((demo) => demo.id === demographicId)!;
      item.hoverActive = active;

      if (scrollIntoView != null) {
        item.scrollIntoView = scrollIntoView;
      }
    },
    setHoverActive: (
      state,
      action: PayloadAction<{ id: string; active: boolean }>
    ) => {
      const { id, active } = action.payload;
      const result = state.demographics.find((item) => item.id === id)!;
      result.hoverActive = active;
    },
    setImageHeight: (
      state,
      action: PayloadAction<{ id: string; imageHeight: number | null }>
    ) => {
      const { id, imageHeight } = action.payload;
      const result = state.demographics.find((item) => item.id === id)!;
      result.imageHeight = imageHeight;
      // state.imageHeight = action.payload;
    },
  },
});

export const {
  addDemographics,
  // setDemographicsDisplay,
  setDemoItemHoverActive,
  setHoverActive,
  setImageHeight,
} = demographicsSlice.actions;
export default demographicsSlice.reducer;
