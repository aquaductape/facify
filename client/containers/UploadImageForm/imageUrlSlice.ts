import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type TImageUrlState = {
  uri: string | null;
  imageStatus: "EMPTY" | "LOADING" | "DONE";
  elOnLoadStatus: "EMPTY" | "LOADING" | "DONE";
  error: string | null;
  naturalHeight: number | null;
  naturalWidth: number | null;
};

const initialState: TImageUrlState = {
  uri: null,
  imageStatus: "EMPTY",
  elOnLoadStatus: "EMPTY",
  naturalHeight: null,
  naturalWidth: null,
  error: null,
};

const imageUrlSlice = createSlice({
  name: "imageUrl",
  initialState,
  reducers: {
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
    saveImageDimensions: (
      state,
      action: PayloadAction<{ naturalHeight: number; naturalWidth: number }>
    ) => {
      const { naturalHeight, naturalWidth } = action.payload;
      state.naturalHeight = naturalHeight;
      state.naturalWidth = naturalWidth;
    },
  },
});

export const {
  setUri,
  setImageError,
  setImageStatus,
  setElOnLoadStatus,
  saveImageDimensions,
} = imageUrlSlice.actions;
export default imageUrlSlice.reducer;
