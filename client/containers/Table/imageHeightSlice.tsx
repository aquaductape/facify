import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/rootReducer";

type TImageHeightState = {
  images: {
    [key: string]: {
      imageHeight: number | null;
    };
  };
  triggerRefresh: number;
};

const initialState: TImageHeightState = {
  images: {},
  triggerRefresh: 0,
};

export const selectImageHeight = ({ id }: { id: string }) => {
  return createSelector(
    (state: RootState) => state.imageHeight.images,
    (result) => result[id].imageHeight
  );
};

const imageHeightSlice = createSlice({
  name: "imageHeight",
  initialState,
  reducers: {
    addImage: (
      state,
      action: PayloadAction<{ id: string; imageHeight: number | null }>
    ) => {
      const { id, imageHeight } = action.payload;
      state.images[id] = { imageHeight };
    },
    setImageHeight: (
      state,
      action: PayloadAction<{ id: string; imageHeight: number }>
    ) => {
      const { id, imageHeight } = action.payload;
      state.images[id].imageHeight = imageHeight;
    },
    setTriggerRefresh: (state, action: PayloadAction<number>) => {
      state.triggerRefresh = action.payload;
    },
    removeImageHeight: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;

      delete state.images[id];
    },
  },
});

export const {
  setTriggerRefresh,
  removeImageHeight,
  addImage,
  setImageHeight,
} = imageHeightSlice.actions;
export default imageHeightSlice.reducer;
