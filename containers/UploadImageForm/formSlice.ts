import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { CONSTANTS } from "../../constants";

export type TURLItem = {
  id: string;
  content: string;
  name: string;
  error: boolean;
  errorMsg: string;
};
type TSubmit = {
  active: boolean;
  from: "text" | "webcam" | "dragAndDrop" | "file" | null;
};
type TFormState = {
  inputResult: TURLItem[];
  submit: TSubmit;
  error: boolean;
  urlItems: TURLItem[];
  toggleInputTextBox: boolean;
};

// https://i.imgur.com/nt0RgAH.jpg https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg https://static.tvtropes.org/pmwiki/pub/images/aubrey_plaza.jpg
const initialState: TFormState = {
  toggleInputTextBox: false,
  error: false,
  submit: {
    active: false,
    from: null,
  },
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
    setToggleInputTextBox: (state, action: PayloadAction<boolean>) => {
      state.toggleInputTextBox = action.payload;
    },
    addUrlItem: (state, action: PayloadAction<TURLItem | TURLItem[]>) => {
      const result = action.payload;

      if (Array.isArray(result)) {
        state.urlItems.push(...result);
        return;
      }

      state.urlItems.push(result);
    },
    removeUrlItem: (
      state,
      action: PayloadAction<{ id?: string; type?: "pop" | "all" }>
    ) => {
      const { id, type } = action.payload;

      if (type === "pop") {
        state.urlItems.pop();
        return;
      }
      if (type === "all") {
        state.urlItems = [];
        return;
      }
      const foundIdx = state.urlItems.findIndex((item) => item.id === id);
      state.urlItems.splice(foundIdx, 1);
    },
    setUrlItemError: (
      state,
      action: PayloadAction<{ id: string; error: boolean }>
    ) => {
      const { id, error } = action.payload;

      const item = state.urlItems.find((item) => item.id === id)!;
      if (error) {
        item.errorMsg = CONSTANTS.imageExistErrorMsg;
      }
      item.error = error;
    },
    addInputResult: (state, action: PayloadAction<TURLItem | TURLItem[]>) => {
      const result = action.payload;

      if (Array.isArray(result)) {
        state.inputResult.push(...result);
        return;
      }

      state.inputResult.push(result);
    },
    setInputResultFromUrlItems: (state) => {
      state.inputResult = state.urlItems;
    },
    removeInvalidUrlItems: (state) => {
      state.urlItems = state.urlItems.filter(({ error }) => !error);
    },
    clearAllFormValues: (state) => {
      state.inputResult = [];
      state.urlItems = [];
    },
    setSubmit: (state, action: PayloadAction<TSubmit>) => {
      state.submit = action.payload;
    },
  },
});

export const {
  setToggleInputTextBox,
  addUrlItem,
  removeUrlItem,
  setUrlItemError,
  addInputResult,
  setInputResultFromUrlItems,
  clearAllFormValues,
  removeInvalidUrlItems,
  setSubmit,
} = formSlice.actions;
export default formSlice.reducer;
