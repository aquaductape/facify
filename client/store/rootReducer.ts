import { combineReducers } from "@reduxjs/toolkit";
import imageUrlReducer from "../containers/UploadImageForm/imageUrlSlice";
import demographicsReducer from "../containers/FaceDetectionResult/ImageResult/demographicsSlice";

const rootReducer = combineReducers({
  imageUrl: imageUrlReducer,
  demographics: demographicsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
