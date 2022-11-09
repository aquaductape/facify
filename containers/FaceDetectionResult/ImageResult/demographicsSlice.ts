import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store/rootReducer";
import { TConcept, TConceptVal, TDemographics } from "../../../ts";
import isObjEmpty from "../../../utils/isObjEmpty";
import { JSON_Stringify_Parse } from "../../../utils/jsonStringifyParse";

export type TDemographicsDisplay = {
  id: string;
  uri?: string;
  removed: boolean;
  hoverActive: boolean;
  generalHover: boolean;
  scrollIntoView: boolean;
  scrollTimestamp: number;
};

type TImageUrl = {
  uri: string;
  naturalWidth: number | null;
  naturalHeight: number | null;
};

export type TSortValueType =
  | "numerical"
  | "alphabetical"
  | "percentage"
  | "none";
type TSortConcept = {
  active: boolean;
  values: {
    type: TSortValueType;
    active: boolean;
  }[];
};
type TTableClassify = {
  dirty: {
    sort: Partial<TConceptVal<boolean>>;
    filter: Partial<TConceptVal<boolean>>;
    dirty: boolean;
  };
  sort: {
    action: string | null;
    concepts: TConceptVal<TSortConcept>;
    childIds: string[] | null;
  };
  filter: {
    concepts: TConceptVal<{ [key: string]: boolean }>;
    action: "all-results" | "top-result";
    childIds: string[] | null;
  };
};

type TParent = {
  id: string;
  imageUrl: TImageUrl;
  name: string;
  hoverActive: boolean;
  childIds: string[];
  tableClassify: TTableClassify;
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
  // TODO: Understand Fully on how this works.
  // saving createSelector doesn't work, unrelated slice dispatches still run it. Returning it as a function works, but this runs createSelector every dispatch that changes demographicNodes
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

const setDirty = (tableClassify: TTableClassify) => {
  const { concepts: values } = tableClassify.filter;

  for (const key in values) {
    const isEmpty = isObjEmpty(values[key]);

    if (isEmpty) {
      delete tableClassify.dirty.filter[key];
      continue;
    }
    tableClassify.dirty.dirty = true;
    tableClassify.dirty.filter[key] = true;
  }
};

const checkDirtyAndFilterChildren = ({
  childIds,
  tableClassify,
  demographicNodes,
}: {
  childIds: string[];
  tableClassify: TTableClassify;
  demographicNodes: TDemographicNodeCollection;
}) => {
  const filteredChildIdsArr: string[] = [];

  const isDirty = () => {
    const { concepts: values } = tableClassify.filter;

    for (const key in values) {
      const isEmpty = isObjEmpty(values[key]);

      if (!isEmpty) {
        return true;
      }
    }

    return false;
  };

  const filterChildrenIds = () => {
    childIds.forEach((childId) => {
      const demographicNode = demographicNodes[childId];
      filterIds(demographicNode);
    });
  };

  const filterIds = (demographicNode: TDemographicNode) => {
    const concepts = tableClassify.filter.concepts;
    let areAllConceptsEmpty = true;

    for (const key in concepts) {
      const classifyConcept = concepts[key];
      const childConcept = demographicNode.concepts[key];
      let isConceptEmpty = true;
      let pass = false;

      for (const name in classifyConcept) {
        areAllConceptsEmpty = false;
        isConceptEmpty = false;

        const found = childConcept[0].name === name;

        if (found) {
          pass = true;
          demographicNode.removed = false;
          break;
        }
      }

      if (!pass && !isConceptEmpty) {
        demographicNode.removed = true;
        return;
      }
    }

    filteredChildIdsArr.push(demographicNode.id);
    if (areAllConceptsEmpty && demographicNode.removed) {
      demographicNode.removed = false;
    }
  };

  filterChildrenIds();

  tableClassify.filter.childIds = isDirty() ? filteredChildIdsArr : null;
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
          concepts: {
            "appearance-age": {},
            "appearance-gender": {},
            "appearance-multicultural": {},
          },
          action: "top-result",
          childIds: null,
        },
        sort: {
          action: null,
          concepts: {
            "appearance-face": {
              active: false,
              values: [{ type: "none", active: true }],
            },
            "appearance-age": {
              active: false,
              values: [
                { type: "numerical", active: true },
                { type: "percentage", active: false },
              ],
            },
            "appearance-gender": {
              active: false,
              values: [
                { type: "alphabetical", active: true },
                { type: "percentage", active: false },
              ],
            },
            "appearance-multicultural": {
              active: false,
              values: [
                { type: "alphabetical", active: true },
                { type: "percentage", active: false },
              ],
            },
          },
          childIds: null,
        },
        dirty: { sort: {}, filter: {}, dirty: false },
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
      const parent = state.parents[id];
      const { childIds, imageUrl } = parent;

      if (imageUrl.uri.match(/^blob:.+/)) {
        window.URL.revokeObjectURL(imageUrl.uri);
      }

      state.parents.splice(id, 1);

      childIds.forEach((childId) => {
        window.URL.revokeObjectURL(state.demographicNodes[childId].uri!);
        delete state.demographicNodes[childId];
      });
    },
    setSortValue: (
      state,
      action: PayloadAction<{
        id: number;
        category: "face" | "age" | "gender" | "multicultural";
        value: TSortValueType;
      }>
    ) => {
      const { id, value, category } = action.payload;
      const { tableClassify } = state.parents[id];

      const categoryAppearance = `appearance-${category}`;

      tableClassify.sort.concepts[categoryAppearance].values.forEach(
        (val) => (val.active = false)
      );

      const currentSortOnValue = tableClassify.sort.concepts[
        categoryAppearance
      ].values.find((_value) => _value.type === value)!;
      currentSortOnValue.active = true;
    },
    sortChildIds: (
      state,
      action: PayloadAction<{
        id: number;
        category: "face" | "age" | "gender" | "multicultural";
        sortOnValue?: TSortValueType;
        action: "ASC" | "DESC" | "Initial";
      }>
    ) => {
      const { id, category, action: actionValue, sortOnValue } = action.payload;
      const { tableClassify, childIds } = state.parents[id];
      const categoryAppearance = `appearance-${category}`;

      const resetDirty = () => {
        const categories = tableClassify.dirty.sort;
        for (const key in categories) {
          categories[key] = false;
        }
      };

      const resetActive = () => {
        const { concepts } = tableClassify.sort;
        for (const key in concepts) {
          concepts[key].active = false;
        }
      };

      const resetSortOnValue = () => {
        if (!sortOnValue) return;

        tableClassify.sort.concepts[categoryAppearance].values.forEach(
          (val) => (val.active = false)
        );
      };

      const getSortOnValue = () => {
        return tableClassify.sort.concepts[categoryAppearance].values.find(
          (value) => {
            if (!sortOnValue) return value.active;
            return value.type === sortOnValue;
          }
        )!;
      };

      resetDirty();
      tableClassify.sort.action = actionValue;
      tableClassify.dirty.sort[categoryAppearance] = true;

      if (actionValue === "Initial") {
        tableClassify.dirty.sort[categoryAppearance] = false;
        tableClassify.sort.action = null;
        tableClassify.sort.childIds = null;
        resetActive();
        resetSortOnValue();
        const currentSortOnValue = getSortOnValue();
        currentSortOnValue.active = true;
        return;
      }

      resetActive();
      tableClassify.sort.concepts[categoryAppearance].active = true;

      if (!tableClassify.sort.childIds) {
        tableClassify.sort.childIds = JSON_Stringify_Parse(childIds);
      }

      resetSortOnValue();
      const currentSortOnValue = getSortOnValue();
      currentSortOnValue.active = true;

      if (category === "face") {
        tableClassify.sort.childIds.reverse();
        return;
      }

      tableClassify.sort.childIds.sort((a, b) => {
        const a_category =
          state.demographicNodes[a].concepts[categoryAppearance][0];
        const b_category =
          state.demographicNodes[b].concepts[categoryAppearance][0];

        if (currentSortOnValue.type === "numerical") {
          const a_childIdValue = Number(a_category.name.match(/\d+/)![0]);
          const b_childIdValue = Number(b_category.name.match(/\d+/)![0]);

          if (actionValue === "ASC") {
            return a_childIdValue - b_childIdValue;
          } else {
            return b_childIdValue - a_childIdValue;
          }
        }

        if (currentSortOnValue.type === "percentage") {
          const a_childIdValue = a_category.value;
          const b_childIdValue = b_category.value;

          if (actionValue === "ASC") {
            return a_childIdValue - b_childIdValue;
          } else {
            return b_childIdValue - a_childIdValue;
          }
        }

        // currentSortOnValue.type is 'alphabetical'
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
    resetSort: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      const { id } = action.payload;

      const { tableClassify } = state.parents[id];

      const resetDirty = () => {
        tableClassify.dirty.sort = {};
      };

      const resetActive = () => {
        const { concepts } = tableClassify.sort;
        for (const key in concepts) {
          concepts[key].active = false;
        }
      };

      resetDirty();

      tableClassify.sort.action = null;
      tableClassify.sort.childIds = null;
      resetActive();
      // const currentSortOnValue = getSortOnValue();
      // currentSortOnValue.active = true;
    },
    filterChildIds: (
      state,
      action: PayloadAction<{ id: number; concept: string; value: string }>
    ) => {
      const { id, value, concept } = action.payload;

      const { demographicNodes } = state;
      const { tableClassify, childIds } = state.parents[id];

      if (tableClassify.filter.concepts[concept][value]) {
        delete tableClassify.filter.concepts[concept][value];
        setDirty(tableClassify);
        checkDirtyAndFilterChildren({
          childIds,
          demographicNodes,
          tableClassify,
        });
        return;
      }

      tableClassify.filter.concepts[concept][value] = true;
      setDirty(tableClassify);
      checkDirtyAndFilterChildren({
        childIds,
        demographicNodes,
        tableClassify,
      });
    },
    resetFilter: (
      state,
      action: PayloadAction<{
        id: number;
        concept: "age" | "gender" | "multicultural" | "all";
      }>
    ) => {
      const { id, concept } = action.payload;

      const { demographicNodes } = state;
      const { tableClassify, childIds } = state.parents[id];
      const { dirty, filter } = tableClassify;

      if (concept === "all") {
        const values = filter.concepts;

        filter.childIds = null;
        dirty.filter = {};

        for (const key in values) {
          values[key] = {};
        }

        childIds.forEach((childId) => {
          demographicNodes[childId].removed = false;
        });
        return;
      }

      filter.concepts[`appearance-${concept}`] = {};

      setDirty(tableClassify);
      checkDirtyAndFilterChildren({
        childIds,
        tableClassify,
        demographicNodes,
      });
    },
    setDemoItemHoverActive: (
      state,
      action: PayloadAction<{
        id: string;
        parentId?: number;
        active: boolean;
        generalActive?: boolean;
        scrollIntoView?: boolean;
        scrollTimestamp?: number;
      }>
    ) => {
      const {
        id,
        parentId,
        active,
        generalActive,
        scrollIntoView,
        scrollTimestamp,
      } = action.payload;

      const result = state.demographicNodes[id];
      result.hoverActive = active;

      if (scrollIntoView != null) {
        result.scrollIntoView = scrollIntoView;
      }

      if (scrollTimestamp != null) {
        result.scrollTimestamp = scrollTimestamp;
      }

      if (generalActive != null) {
        state.parents[parentId!].hoverActive = generalActive;
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
  setSortValue,
  sortChildIds,
  resetSort,
  filterChildIds,
  resetFilter,
} = demographicsSlice.actions;
export default demographicsSlice.reducer;
