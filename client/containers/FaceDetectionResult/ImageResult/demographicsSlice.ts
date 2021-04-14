import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store/rootReducer";
import { TConcept, TDemographics } from "../../../ts";
import { JSON_Stringify_Parse } from "../../../utils/jsonStringifyParse";

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
  tableClassify: {
    sort: {
      action: string | null;
      category: string | null;
      childIds: string[] | null;
    };
    filter: {
      [key: string]: string[];
      "multicultural-appearance": string[];
      "gender-appearance": string[];
      "age-appearance": string[];
    };
  };
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
        parent: Omit<TParent, "childIds" | "tableClassify">;
        data: TDemographicNode[];
      }>
    ) => {
      const data = action.payload.data;
      const parent = action.payload.parent as TParent;

      parent.childIds = data.map((item) => item.id);
      parent.tableClassify = {
        filter: {
          "age-appearance": [],
          "gender-appearance": [],
          "multicultural-appearance": [],
        },
        sort: { action: null, category: null, childIds: null },
      };
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
    sortChildIds: (
      state,
      action: PayloadAction<{
        id: number;
        category: "face" | "age" | "gender" | "multicultural";
        action: "ASC" | "DESC" | "Initial";
      }>
    ) => {
      const { id, category, action: actionValue } = action.payload;
      const parent = state.parents[id];
      const newCategory = `${category}-appearance`;

      parent.tableClassify.sort.category = category;
      parent.tableClassify.sort.action = actionValue;

      if (actionValue === "Initial") {
        parent.tableClassify.sort.action = null;
        parent.tableClassify.sort.category = null;
        parent.tableClassify.sort.childIds = null;
        return;
      }

      if (!parent.tableClassify.sort.childIds) {
        parent.tableClassify.sort.childIds = JSON_Stringify_Parse(
          parent.childIds
        );
      }

      if (category === "face") {
        parent.tableClassify.sort.childIds.reverse();
        return;
      }

      parent.tableClassify.sort.childIds.sort((a, b) => {
        const a_category = state.demographicNodes[a].concepts[newCategory][0];
        const b_category = state.demographicNodes[b].concepts[newCategory][0];

        if (category === "age") {
          const a_childIdValue = Number(a_category.name.match(/\d+/)![0]);
          const b_childIdValue = Number(b_category.name.match(/\d+/)![0]);

          if (actionValue === "ASC") {
            return a_childIdValue - b_childIdValue;
          } else {
            return b_childIdValue - a_childIdValue;
          }
        }

        const a_childIdValue = a_category.name;
        const b_childIdValue = b_category.name;

        if (a_childIdValue < b_childIdValue) {
          return actionValue === "ASC" ? -1 : 1;
        }
        if (a_childIdValue > b_childIdValue) {
          return actionValue === "ASC" ? 1 : -1;
        }

        return 0;
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
  sortChildIds,
} = demographicsSlice.actions;
export default demographicsSlice.reducer;
