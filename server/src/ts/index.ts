export type TConcept = { id: string; name: string; value: number };
export type TDataOutput = {
  id: string;
  bounding_box: {
    top_row: number;
    left_col: number;
    bottom_row: number;
    right_col: number;
  };
  concepts: {
    "multicultural-appearance": TConcept[];
    "gender-appearance": TConcept[];
    "age-appearence": TConcept[];
    [key: string]: TConcept[];
  };
};
