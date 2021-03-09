import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import ImageResult from "./ImageResult/ImageResult";
import InfoResult from "./InfoResult/InfoResult";
import Seperator from "./Bar/Seperator";
import Bar from "./Bar/Bar";

type TResultProps = {
  _id: string;
  id: number;
  idx: number;
};
const Result = React.memo(({ id, _id, idx }: TResultProps) => {
  return (
    <div className="container">
      {idx ? <Seperator id={_id}></Seperator> : null}
      <Bar id={id} _id={_id} idx={idx}></Bar>
      <div className="image-panel">
        <ImageResult id={id} />
        <InfoResult id={id} _id={_id} />
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
});

const FaceDetectionResult = () => {
  const images = useSelector((state: RootState) => state.demographics.parents);
  const imageLoaded = useSelector(
    (state: RootState) => state.imageUrl.imageLoaded
  );

  if (!imageLoaded) return null;
  // if (error) return <div>{error}</div>;
  // return null;
  return (
    <>
      {images.map(({ id, _id }, idx) => (
        <Result id={id} _id={_id} idx={idx} key={id}></Result>
      ))}
    </>
  );
};

export default FaceDetectionResult;
