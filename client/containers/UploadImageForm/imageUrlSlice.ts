import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TImgStatus = "EMPTY" | "DONE" | "COMPRESSING" | "SCANNING";
export type TImageItem = {};
type TImageUrlState = {
  uri: string | null;
  imageStatus: "EMPTY" | "LOADING" | "DONE";
  elOnLoadStatus: "EMPTY" | "LOADING" | "DONE";
  error: string | null;
  imageLoaded: boolean;
  currentAddedImg: {
    id: string;
    name: string;
    error: boolean;
    errorMsg: string;
  } | null;
  currentImgStatus: TImgStatus;
};

const initialState: TImageUrlState = {
  uri: null,
  imageStatus: "EMPTY",
  elOnLoadStatus: "EMPTY",
  currentImgStatus: "EMPTY",
  error: null,
  imageLoaded: false,
  currentAddedImg: null,
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
    setCurrentImageStatus: (state, action: PayloadAction<TImgStatus>) => {
      state.currentImgStatus = action.payload;
    },
    setCurrentAddedImage: (
      state,
      action: PayloadAction<{
        set?: { id: string; name: string; error: boolean; errorMsg: string };
        updateError?: string;
      }>
    ) => {
      const { set, updateError } = action.payload;
      if (set) {
        state.currentAddedImg = set;
        return;
      }

      if (updateError) {
        state.currentAddedImg!.error = true;
        state.currentAddedImg!.errorMsg = updateError;
        return;
      }
      // state.currentAddedImg
    },
  },
});

export const {
  setUri,
  setImageError,
  setImageStatus,
  setElOnLoadStatus,
  setImageLoaded,
  setCurrentImageStatus,
  setCurrentAddedImage,
} = imageUrlSlice.actions;
export default imageUrlSlice.reducer;
