import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

export type TImageItem = {};
type TURLItem = { id: string; content: string; error: boolean };
type TFormState = {
  inputResult: TURLItem[];
  error: boolean;
  urlItems: TURLItem[];
};

const initialState: TFormState = {
  error: false,
  inputResult: [],
  urlItems: [
    // { id: nanoid(), content: "https://i.imgur.com/nt0RgAH.jpg", error: false },
    // {
    //   id: nanoid(),
    //   content:
    //     "https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg",
    //   error: false,
    // },
    // {
    //   id: nanoid(),
    //   content: "https://static.tvtropes.org/pmwiki/pub/images/aubrey_plaza.jpg",
    //   error: false,
    // },
  ],
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addUrlItem: (state, action: PayloadAction<TURLItem | TURLItem[]>) => {
      const result = action.payload;
      if (Array.isArray(result)) {
        state.urlItems.push(...result);
        return;
      }

      state.urlItems.push(result);
    },
    removeUrlItem: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;

      const foundIdx = state.urlItems.findIndex((item) => item.id === id);
      state.urlItems.splice(foundIdx, 1);
    },
    setUrlItemError: (
      state,
      action: PayloadAction<{ id: string; error: boolean }>
    ) => {
      const { id, error } = action.payload;

      const item = state.urlItems.find((item) => item.id === id)!;
      item.error = error;
    },
    setInputValueFromUrlItems: (state) => {
      state.inputResult = state.urlItems;
    },
    clearAllFormValues: (state) => {
      state.inputResult = [];
      state.urlItems = [];
    },
  },
});

export const {
  addUrlItem,
  removeUrlItem,
  setUrlItemError,
  setInputValueFromUrlItems,
  clearAllFormValues,
} = formSlice.actions;
export default formSlice.reducer;
