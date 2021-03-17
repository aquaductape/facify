import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store/rootReducer";
import { TDemographics } from "../../../ts";

export type TDemographicsDisplay = {
  id: string;
  uri?: string;
  hoverActive: boolean;
  generalHover: boolean;
  scrollIntoView: boolean;
};

type TImageUrl = {
  uri: string;
  naturalWidth: number | null;
  naturalHeight: number | null;
};

type TParent = {
  id: string;
  imageUrl: TImageUrl;
  name: string;
  hoverActive: boolean;
  childIds: string[];
};

export type TDemographicNode = TDemographicsDisplay & TDemographics;

type TDemographicNodeCollection = {
  [key: string]: TDemographicNode;
};

type TDemographicState = {
  parents: TParent[];
  demographicNodes: TDemographicNodeCollection;
  hoverActive: boolean;
};

const initialState: TDemographicState = {
  parents: [],
  demographicNodes: {},
  hoverActive: false,
};

export const selectDemographicsDisplay = ({ id }: { id: string }) => {
  return createSelector(
    (state: RootState) => state.demographics.demographicNodes,
    (result) => {
      return result[id];
    }
  );
};
export const selectDemographicsConcepts = ({ id }: { id: string }) => {
  return createSelector(
    (state: RootState) => state.demographics.demographicNodes,
    (result) => {
      return result[id].concepts;
    }
  );
};

export const selectDemographicParentChildIds = ({ id }: { id: number }) => {
  return createSelector(
    (state: RootState) => state.demographics.parents,
    (result) => result[id].childIds
  );
};

export const selectImageUrl = ({ id }: { id: number }) => {
  return createSelector(
    (state: RootState) => state.demographics.parents,
    (result) => {
      return result[id].imageUrl;
    }
  );
};

export const selectName = ({ id }: { id: number }) => {
  return createSelector(
    (state: RootState) => state.demographics.parents,
    (result) => result[id].name
  );
};

export const selectHoverActive = ({ id }: { id: number }) => {
  return createSelector(
    (state: RootState) => state.demographics.parents,
    (result) => result[id].hoverActive
  );
};

export const selectParents = () => {
  return createSelector(
    (state: RootState) => state.demographics.parents,
    (result) => result
  );
};

const demographicsSlice = createSlice({
  name: "demographics",
  initialState,
  reducers: {
    addDemographicsParentAndChildren: (
      state,
      action: PayloadAction<{
        parent: Omit<TParent, "childIds">;
        data: TDemographicNode[];
      }>
    ) => {
      const data = action.payload.data;
      const parent = action.payload.parent as TParent;

      parent.childIds = data.map((item) => item.id);
      state.parents.push(parent);
      data.forEach((item) => {
        state.demographicNodes[item.id] = item;
      });
    },
    removeParentAndNodeChildren: (
      state,
      action: PayloadAction<{ id: number }>
    ) => {
      const { id } = action.payload;
      const { childIds } = state.parents[id];

      state.parents.splice(id, 1);

      childIds.forEach((childId) => {
        delete state.demographicNodes[childId];
      });
    },
    setDemoItemHoverActive: (
      state,
      action: PayloadAction<{
        id: string;
        // parentId: number;
        active: boolean;
        // activeBy
        scrollIntoView?: boolean;
      }>
    ) => {
      const {
        id,
        //
        // parentId,
        active,
        scrollIntoView,
      } = action.payload;

      const result = state.demographicNodes[id];
      result.hoverActive = active;
      if (scrollIntoView != null) {
        result.scrollIntoView = scrollIntoView;
      }
    },
    setDemoItemUri: (
      state,
      action: PayloadAction<{ id: number; uri: string }>
    ) => {
      const { id, uri } = action.payload;
      const result = state.demographicNodes[id];
    },
    setHoverActive: (
      state,
      action: PayloadAction<{ id: number; active: boolean }>
    ) => {
      const { id, active } = action.payload;
      // state.hoverActive = active;
      state.parents[id].hoverActive = active;
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
  removeParentAndNodeChildren,
  setImageDimensions,
  setDemoItemHoverActive,
  setHoverActive,
} = demographicsSlice.actions;
export default demographicsSlice.reducer;
