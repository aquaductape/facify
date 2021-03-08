import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store/rootReducer";
import { TDemographics } from "../../../ts";

let parentId = 0;
let demographicId = 0;

type TDemographicsDisplay = {
  id: number;
  hoverActive: boolean;
  generalHover: boolean;
  scrollIntoView: boolean;
};
type TDemographicsItem = {
  id: string;
  data: TDemographics[];
  display: TDemographicsDisplay[];
  imageHeight: number | null;
  hoverActive: boolean;
};

type TImageUrl = {
  uri: string;
  naturalWidth: number | null;
  naturalHeight: number | null;
};

type TParent = {
  id: number;
  imageUrl: TImageUrl;
  name: string;
  childIds: number[];
};

export type TDemographicNode = TDemographicsDisplay & TDemographics;

type TImageResultState = {
  parents: TParent[];
  demographicNodes: TDemographicNode[];
  hoverActive: boolean;
};

const initialState: TImageResultState = {
  parents: [],
  demographicNodes: [],
  hoverActive: false,
};

export const selectDemographicsDisplay = ({
  id,
}: {
  id: number;
  activeOnly?: boolean;
}) => {
  return createSelector(
    (state: RootState) => state.demographics.demographicNodes,
    (result) => {
      console.log("get node");
      return result[id];
    }
  );
};

export const selectDemographicParentChildIds = ({ id }: { id: number }) => {
  return createSelector(
    (state: RootState) => state.demographics,
    (result) => result.parents[id].childIds
  );
};

export const selectImageUrl = ({ id }: { id: number }) => {
  return createSelector(
    (state: RootState) => state.demographics,
    (result) => result.parents[id].imageUrl
  );
};

export const selectName = ({ id }: { id: number }) => {
  return createSelector(
    (state: RootState) => state.demographics,
    (result) => result.parents[id].name
  );
};

const demographicsSlice = createSlice({
  name: "demographics",
  initialState,
  reducers: {
    addDemographicsParentAndChildren: {
      reducer: (
        state,
        action: PayloadAction<{
          data: TDemographicNode[];
          parent: TParent;
        }>
      ) => {
        const { data, parent } = action.payload;

        parent.childIds = data.map((item) => item.id);

        state.demographicNodes.push(...data);
        state.parents.push(parent);
      },
      prepare: ({
        data: _data,
        parent: _parent,
      }: {
        data: Omit<TDemographicNode, "id">[];
        parent: Omit<TParent, "id" | "childIds">;
      }) => {
        const data = (_data as unknown) as TDemographicNode[];
        const parent = (_parent as unknown) as TParent;

        parent.id = parentId++;

        data.forEach((item) => {
          const id = demographicId++;
          item.id = id;
        });

        return { payload: { data, parent } };
      },
    },
    addParent: {
      reducer: (state, action: PayloadAction<TParent | TParent[]>) => {
        const newParent = action.payload;
        if (Array.isArray(newParent)) {
          state.parents.push(...newParent);
          return;
        }

        state.parents.push(newParent);
      },
      prepare: (_input: Omit<TParent, "id"> | Omit<TParent, "id">[]) => {
        const input = (_input as unknown) as TParent | TParent[];

        if (Array.isArray(input)) {
          input.forEach((item) => (item.id = parentId++));

          return { payload: input };
        }

        input.id = parentId++;

        return { payload: input };
      },
    },
    setDemoItemHoverActive: (
      state,
      action: PayloadAction<{
        id: number;
        parentId: number;
        active: boolean;
        // activeBy
        scrollIntoView?: boolean;
      }>
    ) => {
      const { id, parentId, active, scrollIntoView } = action.payload;

      const parent = state.parents[parentId];
      parent.childIds.forEach((childId) => {
        const result = state.demographicNodes[childId];
        if (childId === id) {
          result.hoverActive = active;

          if (scrollIntoView != null) {
            result.scrollIntoView = scrollIntoView;
          }
        }

        result.generalHover = active;
      });

      // const result = state.demographicNodes[id];
      // result.hoverActive = active;
      // if (scrollIntoView != null) {
      //   result.scrollIntoView = scrollIntoView;
      // }
    },
    setHoverActive: (state, action: PayloadAction<{ active: boolean }>) => {
      const { active } = action.payload;
      // const result = state.demographics.find((item) => item.id === id)!;
      state.hoverActive = active;
    },
    setImageDimensions: (
      state,
      action: PayloadAction<{
        id: number;
        uri: string;
        naturalHeight: number;
        naturalWidth: number;
      }>
    ) => {
      const { id, uri, naturalHeight, naturalWidth } = action.payload;

      state.parents[id].imageUrl = {
        uri,
        naturalHeight,
        naturalWidth,
      };
    },
  },
});

export const {
  addDemographicsParentAndChildren,
  setImageDimensions,
  setDemoItemHoverActive,
  setHoverActive,
} = demographicsSlice.actions;
export default demographicsSlice.reducer;
