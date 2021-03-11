import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/rootReducer";

type TImageHeightState = {
  images: {
    imageHeight: number | null;
  }[];
  triggerRefresh: number;
};

let imageId = 0;

const initialState: TImageHeightState = {
  images: [],
  triggerRefresh: 0,
};

export const selectImageHeight = ({ id }: { id: number }) => {
  return createSelector(
    (state: RootState) => state.imageHeight.images,
    (result) => result[id].imageHeight
  );
};

const imageHeightSlice = createSlice({
  name: "imageHeight",
  initialState,
  reducers: {
    addImage: {
      reducer: (
        state,
        action: PayloadAction<{
          input: { imageHeight: number | null };
        }>
      ) => {
        const { input } = action.payload;

        state.images.push(input);
      },
      prepare: ({ input }: { input: { imageHeight: number | null } }) => {
        if (imageId !== 0) {
          imageId++;
        }

        return { payload: { input } };
      },
    },
    setImageHeight: (
      state,
      action: PayloadAction<{ id: number; imageHeight: number }>
    ) => {
      const { id, imageHeight } = action.payload;
      state.images[id].imageHeight = imageHeight;
    },
    setTriggerRefresh: (state, action: PayloadAction<number>) => {
      state.triggerRefresh = action.payload;
    },
    removeImageHeight: (state, action: PayloadAction<{ id: number }>) => {
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
