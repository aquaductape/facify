import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/rootReducer";
export type TImageItem = {
  id: string;
  uri: string | null;
  imageStatus: "EMPTY" | "LOADING" | "DONE";
  elOnLoadStatus: "EMPTY" | "LOADING" | "DONE";
  error: string | null;
  naturalHeight: number | null;
  naturalWidth: number | null;
  name: string;
};
type TImageUrlState = {
  images: TImageItem[];
  imageLoaded: boolean;
};

const initialState: TImageUrlState = {
  images: [],
  imageLoaded: false,
};

export const selectName = ({ id }: { id: string }) => {
  return createSelector(
    (state: RootState) => state.imageUrl.images,
    (result) =>
      result.find((item) => {
        console.log("get name");
        return item.id === id;
      })!.name
  );
};

const imageUrlSlice = createSlice({
  name: "imageUrl",
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<TImageItem>) => {
      state.images.push(action.payload);
    },
    setImageLoaded: (state, action: PayloadAction<boolean>) => {
      state.imageLoaded = action.payload;
    },
    setUri: (state, action: PayloadAction<{ id: string; uri: string }>) => {
      const { id, uri } = action.payload;
      const result = state.images.find((item) => item.id === id)!;
      result.uri = uri;
    },
    setImageStatus: (
      state,
      action: PayloadAction<{
        id: string;
        imageStatus: "EMPTY" | "LOADING" | "DONE";
      }>
    ) => {
      const { id, imageStatus } = action.payload;
      const result = state.images.find((item) => item.id === id)!;
      result.imageStatus = imageStatus;
    },
    setElOnLoadStatus: (
      state,
      action: PayloadAction<{
        id: string;
        elOnLoadStatus: "EMPTY" | "LOADING" | "DONE";
      }>
    ) => {
      const { id, elOnLoadStatus } = action.payload;
      const result = state.images.find((item) => item.id === id)!;
      result.elOnLoadStatus = elOnLoadStatus;
    },
    setImageError: (
      state,
      action: PayloadAction<{ id: string; error: string | null }>
    ) => {
      const { id, error } = action.payload;
      const result = state.images.find((item) => item.id === id)!;
      result.error = error;
    },
    saveImageDimensions: (
      state,
      action: PayloadAction<{
        id: string;
        naturalHeight: number;
        naturalWidth: number;
      }>
    ) => {
      const { id, naturalHeight, naturalWidth } = action.payload;
      const result = state.images.find((item) => item.id === id)!;
      result.naturalHeight = naturalHeight;
      result.naturalWidth = naturalWidth;
    },
  },
});

export const {
  addImage,
  setUri,
  setImageError,
  setImageStatus,
  setElOnLoadStatus,
  saveImageDimensions,
  setImageLoaded,
} = imageUrlSlice.actions;
export default imageUrlSlice.reducer;
