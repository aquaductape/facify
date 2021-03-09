import { combineReducers } from "@reduxjs/toolkit";
import imageUrlReducer from "../containers/UploadImageForm/imageUrlSlice";
import demographicsReducer from "../containers/FaceDetectionResult/ImageResult/demographicsSlice";
import imageHeightReducer from "../containers/Table/imageHeightSlice";

const rootReducer = combineReducers({
  imageUrl: imageUrlReducer,
  demographics: demographicsReducer,
  imageHeight: imageHeightReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
