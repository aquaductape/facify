import { TSortValueType } from "../containers/FaceDetectionResult/ImageResult/demographicsSlice";

export const CONSTANTS = {
  minImageHeight: 210,
  imageHeight: 250,
  imageHeightDesktop: "70vh",
  seperatorHeight: 80,
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
  concepts: ["face", "age", "gender", "multicultural"],
  filterConcepts: {
    ageList: [
      "0-2",
      "3-9",
      "10-19",
      "20-29",
      "30-39",
      "40-49",
      "50-59",
      "60-69",
      "70+",
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
  sortActions: ["ASC", "DESC", "Initial"],
  sortConcepts: {
    face: ["none"],
    age: ["numerical", "percentage"],
    gender: ["alphabetical", "percentage"],
    multicultural: ["alphabetical", "percentage"],
  } as { [key: string]: TSortValueType[] },
};
