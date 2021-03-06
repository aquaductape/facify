import {
  createSelector,
  createSlice,
  PayloadAction,
  PrepareAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../../store/rootReducer";
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

export const selectImageHeight = ({ id }: { id: string }) => {
  return createSelector(
    (state: RootState) => state.demographics.demographics,
    (state) =>
      state.find((item) => {
        return item.id === id;
      })!.imageHeight
  );
};

export const selectHoverActive = ({ id }: { id: string }) => {
  return createSelector(
    (state: RootState) => state.demographics.demographics,
    (state) =>
      state.find((item) => {
        return item.id === id;
      })!.hoverActive
  );
};

export const selectDemographicsData = ({ id }: { id: string }) => {
  return createSelector(
    (state: RootState) => state.demographics.demographics,
    (state) =>
      state.find((item) => {
        // console.log("get data");
        return item.id === id;
      })!.data
  );
};

export const selectDemographicsDisplay = ({
  id,
  demographicId,
}: {
  id: string;
  demographicId: string;
}) => {
  return createSelector(
    (state: RootState) => state.demographics.demographics,
    (state) =>
      state
        .find((item) => {
          // console.log("find demoitem");
          return item.id === id;
        })!
        .display.find((item) => {
          // console.log("find demodisplay");
          return item.id === demographicId;
        })!
  );
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
