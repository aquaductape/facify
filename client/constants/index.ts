import { TSortValueType } from "../containers/FaceDetectionResult/ImageResult/demographicsSlice";

export const CONSTANTS = {
  imageHeight: 250,
  imageHeightDesktop: 700,
  appStickyStartTop:
    133 + // Logo
    45, // form bar
  loaderCountDownDisabledDuration: 1000,
  loaderSuccessDuration: 5000,
  loaderErrorDuration: 2500,
  imageExistErrorMsg: "URL is invalid or image doesn't exist",
  uploadImageFormHeight: 45,
  viewportTopPadding: 15,
  utilBarHeight: 42,
  theadHeight: 38,
  filterConcepts: {
    concepts: ["face", "age", "gender", "multicultural"],
    ageList: [
      "0-2",
      "3-9",
      "10-19",
      "20-29",
      "30-39",
      "40-49",
      "50-59",
      "60-69",
    ],
    genderList: ["Masculine", "Feminine"],
    multiculturalList: [
      "Middle Eastern",
      "Latino Hispanic",
      "East Asian",
      "Black",
      "Southeast Asian",
      "Indian",
      "White",
    ],
  },
  sortConcepts: {
    face: [
      {
        action: "ASC",
        value: "none",
      },
      {
        action: "DESC",
        value: "none",
      },
      {
        action: "Initial",
        value: "none",
      },
    ],
    age: [
      {
        action: "ASC",
        value: "numerical",
      },
      {
        action: "DESC",
        value: "numerical",
      },
      {
        action: "ASC",
        value: "percentage",
      },
      {
        action: "DESC",
        value: "percentage",
      },
      {
        action: "Initial",
        value: "numerical",
      },
    ],
    gender: [
      {
        action: "ASC",
        value: "alphabetical",
      },
      {
        action: "DESC",
        value: "alphabetical",
      },
      {
        action: "ASC",
        value: "percentage",
      },
      {
        action: "DESC",
        value: "percentage",
      },
      {
        action: "Initial",
        value: "alphabetical",
      },
    ],
    multicultural: [
      {
        action: "ASC",
        value: "alphabetical",
      },
      {
        action: "DESC",
        value: "alphabetical",
      },
      {
        action: "ASC",
        value: "percentage",
      },
      {
        action: "DESC",
        value: "percentage",
      },
      {
        action: "Initial",
        value: "alphabetical",
      },
    ],
  } as {
    [key: string]: {
      action: "ASC" | "DESC" | "Initial";
      value: TSortValueType;
    }[];
  },
};
