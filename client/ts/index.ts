export type TBoundingBox = {
  right_col: number;
  left_col: number;
  top_row: number;
  bottom_row: number;
};

// two displays: image thumbnail preview** and table

// ** when hovered it grows and reveals stats, as well download image button(maybe not)
export type TConcept = { id: string; name: string; value: number };
export type TDemographics = {
  id: string;
  bounding_box: TBoundingBox;
  concepts: {
    "multicultural-appearance": TConcept[];
    "gender-appearance": TConcept[];
    "age-appearance": TConcept[];
    [key: string]: TConcept[];
  };
};

export type TDemographicsResponse = {
  status: {
    code: number;
    message: string;
  };
  data: TDemographics[];
};

export type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
}
  ? U
  : T;
