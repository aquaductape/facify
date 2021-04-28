import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TImgStatus = "EMPTY" | "DONE" | "COMPRESSING" | "SCANNING";
export type TImageItem = {};
export type TImgQueue = {
  id: string;
  name: string;
  currentImgStatus: TImgStatus;
  error: boolean;
  errorMsg: string;
  countdown: boolean;
  countdownActive: boolean;
  inQueue: boolean;
};
type TImageUrlState = {
  uri: string | null;
  imageStatus: "EMPTY" | "LOADING" | "DONE";
  elOnLoadStatus: "EMPTY" | "LOADING" | "DONE";
  error: string | null;
  imageLoaded: boolean;
  imgQueue: TImgQueue[];
};

const initialState: TImageUrlState = {
  uri: null,
  imageStatus: "EMPTY",
  elOnLoadStatus: "EMPTY",
  error: null,
  imageLoaded: false,
  imgQueue: [
    // {
    //   id: nanoid(),
    //   error: false,
    //   name: "jack",
    //   errorMsg: "",
    //   countdown: true,
    //   countdownActive: false,
    //   currentImgStatus: "EMPTY",
    //   inQueue: true,
    // },
    // {
    //   id: nanoid(),
    //   error: true,
    //   name: "aubrey",
    //   errorMsg: "BAD",
    //   countdown: true,
    //   countdownActive: false,
    //   currentImgStatus: "DONE",
    //   inQueue: true,
    // },
    // {
    //   id: nanoid(),
    //   error: false,
    //   name: "elon",
    //   errorMsg: "",
    //   countdown: true,
    //   countdownActive: false,
    //   currentImgStatus: "EMPTY",
    //   inQueue: true,
    // },
    // {
    //   id: nanoid(),
    //   error: false,
    //   name: "post-malon",
    //   errorMsg: "",
    //   countdown: true,
    //   countdownActive: false,
    //   currentImgStatus: "EMPTY",
    //   inQueue: true,
    // },
    // {
    //   id: nanoid(),
    //   error: false,
    //   errorMsg: "",
    //   name: "emma",
    //   countdown: true,
    //   countdownActive: false,
    //   currentImgStatus: "EMPTY",
    //   inQueue: true,
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
  setImgQueue,
  updateImgQueue,
} = imageUrlSlice.actions;
export default imageUrlSlice.reducer;
