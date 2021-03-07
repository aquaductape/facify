import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { TImageItem } from "../UploadImageForm/imageUrlSlice";
import ImageResult from "./ImageResult/ImageResult";
import InfoResult from "./InfoResult/InfoResult";
import Seperator from "./Bar/Seperator";
import Bar from "./Bar/Bar";

type TResultProps = Pick<
  TImageItem,
  "id" | "elOnLoadStatus" | "error" | "imageStatus" | "uri"
> & {
  idx: number;
  imageLoaded: boolean;
};
const Result = React.memo(
  ({
    id,
    idx,
    elOnLoadStatus,
    error,
    imageStatus,
    uri,
    imageLoaded,
  }: TResultProps) => {
    if (!imageLoaded || imageStatus !== "DONE") return null;

    return (
      <div className="container">
        {idx ? <Seperator id={id}></Seperator> : null}
        <Bar id={id} idx={idx}></Bar>
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
            .container {
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
      {images.map(({ id, elOnLoadStatus, error, imageStatus, uri }, idx) => (
        <Result
          id={id}
          idx={idx}
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
