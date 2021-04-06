import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { JSON_Stringify_Parse } from "../../utils/jsonStringifyParse";

export type TURLItem = {
  id: string;
  content: string;
  name: string;
  error: boolean;
  errorMsg: string;
};
type TFormState = {
  inputResult: TURLItem[];
  error: boolean;
  urlItems: TURLItem[];
};

// https://i.imgur.com/nt0RgAH.jpg https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg https://static.tvtropes.org/pmwiki/pub/images/aubrey_plaza.jpg
const initialState: TFormState = {
  error: false,
  inputResult: [
    {
      id: nanoid(),
      content: "",
      error: false,
      name:
        "post-malon-superlongsuperlongsuperlongsuperlongsuperlongsuperlong.jpg",
      errorMsg: "",
    },
    {
      id: nanoid(),
      content: "",
      error: true,
      name: "aubrey-superlongsuperlongsuperlongsuperlongsuperlongsuperlong.jpg",
      errorMsg: "",
    },
    {
      id: nanoid(),
      content: "",
      error: true,
      name: "elon-superlongsuperlongsuperlongsuperlongsuperlongsuperlong.gif",
      errorMsg: "",
    },
    {
      id: nanoid(),
      content: "",
      error: false,
      name: "post-malon",
      errorMsg: "",
    },
    // {
    //   id: nanoid(),
    //   content: "",
    //   error: false,
    //   name: "aubrey",
    // },
  ],
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
      item.error = error;
    },
    setInputValueFromUrlItems: (state) => {
      state.inputResult = state.urlItems;
    },
    removeInvalidUrlItems: (state) => {
      state.urlItems = state.urlItems.filter(({ error }) => !error);
    },
    clearAllFormValues: (state) => {
      state.inputResult = [];
      state.urlItems = [];
    },
    // this is not how you should use redux
  },
});

export const {
  addUrlItem,
  removeUrlItem,
  setUrlItemError,
  setInputValueFromUrlItems,
  clearAllFormValues,
  removeInvalidUrlItems,
} = formSlice.actions;
export default formSlice.reducer;
