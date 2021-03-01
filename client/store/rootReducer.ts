import { combineReducers } from "@reduxjs/toolkit";
import imageUrlReducer from "../containers/UploadImageForm/imageUrlSlice";
import demographicsReducer from "../containers/FaceDetectionResult/ImageResult/demographicsSlice";
import tableReducer from "../containers/Table/tableSlice";

const rootReducer = combineReducers({
  imageUrl: imageUrlReducer,
  demographics: demographicsReducer,
  table: tableReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
