import { createSelector } from "@reduxjs/toolkit";
import React from "react";
import { useSelector } from "react-redux";
import CloseBtn from "../../components/Logo/svg/CloseBtn";
import { RootState } from "../../store/rootReducer";
import { TImageItem } from "../UploadImageForm/imageUrlSlice";
import ImageResult from "./ImageResult/ImageResult";
import InfoResult from "./InfoResult/InfoResult";

type TResultProps = Pick<
  TImageItem,
  "id" | "elOnLoadStatus" | "error" | "imageStatus" | "uri"
> & {
  imageLoaded: boolean;
};
const Result = React.memo(
  ({
    id,
    elOnLoadStatus,
    error,
    imageStatus,
    uri,
    imageLoaded,
  }: TResultProps) => {
    if (!imageLoaded || imageStatus !== "DONE") return null;

    return (
      <div className="container">
        {/* <div className="bar">
          <button className="btn-remove">
            <CloseBtn></CloseBtn>
          </button>
        </div> */}
        <div className="image-panel">
          <ImageResult
            id={id}
            error={error}
            imageStatus={imageStatus}
            uri={uri}
          />
          <InfoResult id={id} elOnLoadStatus={elOnLoadStatus} />
        </div>
        <style jsx>
          {`
            .image-panel {
              padding-bottom: 50px;
            }

            .btn-remove {
            }

            .bar {
              display: flex;
              justify-content: flex-end;
              height: 45px;
            }

            @media (min-width: 1300px) {
              .image-panel {
                display: grid;
                grid-template-columns: 450px 3fr;
              }
            }

            @media (min-width: 1500px) {
              .image-panel {
                display: grid;
                grid-template-columns: 650px 1fr;
              }
            }
          `}
        </style>
      </div>
    );
  }
);

const FaceDetectionResult = () => {
  const images = useSelector((state: RootState) => state.imageUrl.images);
  const imageLoaded = useSelector(
    (state: RootState) => state.imageUrl.imageLoaded
  );

  if (!imageLoaded) return null;
  // if (error) return <div>{error}</div>;
  // return null;
  return (
    <>
      {images.map(({ id, elOnLoadStatus, error, imageStatus, uri }) => (
        <Result
          id={id}
          imageLoaded={imageLoaded}
          elOnLoadStatus={elOnLoadStatus}
          error={error}
          imageStatus={imageStatus}
          uri={uri}
          key={id}
        ></Result>
      ))}
    </>
  );
};

export default FaceDetectionResult;
