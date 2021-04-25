import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadFromLocalStorage, saveToLocalStorage } from "../../utils/ls";

type TMenuSlice = {
  disableNotificationCountDown: boolean;
  reduceAnimation: boolean;
};

const name = "menu";

const initialState: TMenuSlice = {
  disableNotificationCountDown: false,
  reduceAnimation: false,
};

const menuSlice = createSlice({
  name,
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<Partial<TMenuSlice>>) => {
      const result = action.payload as TMenuSlice;

      for (const key in result) {
        // @ts-ignore
        state[key] = result[key];
      }

      saveToLocalStorage({ key: name, value: state });
    },
  },
});

export const { setMenu } = menuSlice.actions;
export default menuSlice.reducer;
