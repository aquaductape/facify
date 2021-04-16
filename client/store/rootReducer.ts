import { combineReducers } from "@reduxjs/toolkit";
import imageUrlReducer from "../containers/UploadImageForm/imageUrlSlice";
import demographicsReducer from "../containers/FaceDetectionResult/ImageResult/demographicsSlice";
import imageHeightReducer from "../containers/FaceDetectionResult/InfoResult/Table/imageHeightSlice";
import formReducer from "../containers/UploadImageForm/formSlice";
import menuReducer from "../containers/Menu/menuSlice";
import classifyReducer from "../containers/FaceDetectionResult/InfoResult/Classify/classifySlice";

const rootReducer = combineReducers({
  imageUrl: imageUrlReducer,
  demographics: demographicsReducer,
  imageHeight: imageHeightReducer,
  form: formReducer,
  menu: menuReducer,
  classify: classifyReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
