import { combineReducers } from "@reduxjs/toolkit";
import imageUrlReducer from "../containers/UploadImageForm/imageUrlSlice";
import demographicsReducer from "../containers/FaceDetectionResult/ImageResult/demographicsSlice";
import imageHeightReducer from "../containers/Table/imageHeightSlice";
import formReducer from "../containers/UploadImageForm/formSlice";
import menuReducer from "../containers/Menu/menuSlice";

const rootReducer = combineReducers({
  imageUrl: imageUrlReducer,
  demographics: demographicsReducer,
  imageHeight: imageHeightReducer,
  form: formReducer,
  menu: menuReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
