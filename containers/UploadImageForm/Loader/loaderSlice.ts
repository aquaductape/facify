import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TLoaderSlice = {
  open: boolean;
};

const name = "loader";

const initialState: TLoaderSlice = {
  open: false,
};

const loaderSlice = createSlice({
  name,
  initialState,
  reducers: {
    setOpenLoader: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
  },
});

export const { setOpenLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
