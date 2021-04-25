import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

export type TImgStatus = "EMPTY" | "DONE" | "COMPRESSING" | "SCANNING";
export type TImageItem = {};
type TImgQueue = {
  id: string;
  name: string;
  currentImgStatus: TImgStatus;
  error: boolean;
  errorMsg: string;
  countdown: boolean;
  countdownActive: boolean;
};
type TImageUrlState = {
  uri: string | null;
  imageStatus: "EMPTY" | "LOADING" | "DONE";
  elOnLoadStatus: "EMPTY" | "LOADING" | "DONE";
  error: string | null;
  imageLoaded: boolean;
  imgQueue: TImgQueue[];
  currentImgStatus: TImgStatus;
};

const initialState: TImageUrlState = {
  uri: null,
  imageStatus: "EMPTY",
  elOnLoadStatus: "EMPTY",
  currentImgStatus: "EMPTY",
  error: null,
  imageLoaded: false,
  imgQueue: [
    // {
    //   id: nanoid(),
    //   error: true,
    //   name:
    //     "post-malon-superlongsuperlongsuperlongsuperlongsuperlongsuperlong.jpg",
    //   errorMsg: "BAD",
    //   countdown: true,
    //   countdownActive: false,
    //   currentImgStatus: "DONE",
    // },
    // {
    //   id: nanoid(),
    //   error: true,
    //   name: "aubrey-superlongsuperlongsuperlongsuperlongsuperlongsuperlong.jpg",
    //   errorMsg: "Bad",
    //   countdown: true,
    //   countdownActive: false,
    //   currentImgStatus: "DONE",
    // },
    // {
    //   id: nanoid(),
    //   error: false,
    //   name: "elon-superlongsuperlongsuperlongsuperlongsuperlongsuperlong.gif",
    //   errorMsg: "",
    //   countdown: true,
    //   countdownActive: false,
    //   currentImgStatus: "EMPTY",
    // },
    // {
    //   id: nanoid(),
    //   error: false,
    //   name: "post-malon",
    //   errorMsg: "",
    //   countdown: true,
    //   countdownActive: false,
    //   currentImgStatus: "EMPTY",
    // },
    // {
    //   id: nanoid(),
    //   error: false,
    //   errorMsg: "",
    //   name: "aubrey",
    //   countdown: true,
    //   countdownActive: false,
    //   currentImgStatus: "EMPTY",
    // },
  ],
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
    setImgQueue: (state, action: PayloadAction<TImgQueue[]>) => {
      state.imgQueue = action.payload;
    },
    updateImgQueue: (
      state,
      action: PayloadAction<{
        id: string;
        props: Partial<Omit<TImgQueue, "id">>;
      }>
    ) => {
      const { id, props } = action.payload;

      const imgItem = state.imgQueue.find((item) => item.id === id);

      for (const key in props) {
        // @ts-ignore
        imgItem[key] = props[key];
      }
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
  setImgQueue,
  updateImgQueue,
} = imageUrlSlice.actions;
export default imageUrlSlice.reducer;
