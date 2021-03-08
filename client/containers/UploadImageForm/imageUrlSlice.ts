import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TImageItem = {};
type TImageUrlState = {
  uri: string | null;
  imageStatus: "EMPTY" | "LOADING" | "DONE";
  elOnLoadStatus: "EMPTY" | "LOADING" | "DONE";
  error: string | null;
  imageLoaded: boolean;
};

const initialState: TImageUrlState = {
  uri: null,
  imageStatus: "EMPTY",
  elOnLoadStatus: "EMPTY",
  error: null,
  imageLoaded: false,
};

const imageUrlSlice = createSlice({
  name: "imageUrl",
  initialState,
  reducers: {
    setImageLoaded: (state, action: PayloadAction<boolean>) => {
      state.imageLoaded = action.payload;
    },
    setUri: (state, action: PayloadAction<string>) => {
      state.uri = action.payload;
    },
    setImageStatus: (
      state,
      action: PayloadAction<"EMPTY" | "LOADING" | "DONE">
    ) => {
      state.imageStatus = action.payload;
    },
    setElOnLoadStatus: (
      state,
      action: PayloadAction<"EMPTY" | "LOADING" | "DONE">
    ) => {
      state.elOnLoadStatus = action.payload;
    },
    setImageError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUri,
  setImageError,
  setImageStatus,
  setElOnLoadStatus,
  setImageLoaded,
} = imageUrlSlice.actions;
export default imageUrlSlice.reducer;
