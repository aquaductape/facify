import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import ImageResult from "./ImageResult/ImageResult";
import InfoResult from "./InfoResult/InfoResult";
import Seperator from "./Bar/Seperator";
import Bar from "./Bar/Bar";

type TResultProps = {
  id: number;
  idx: number;
};
const Result = React.memo(({ id, idx }: TResultProps) => {
  return (
    <div id={`demographic-node-${id}`} className="container">
      <div className="bar-container">
        {idx ? <Seperator id={id}></Seperator> : null}
        <Bar id={id} idx={idx}></Bar>
      </div>

      <div className="image-panel">
        <ImageResult id={id} />
        <InfoResult id={id} />
      </div>

      <style jsx>
        {`
          .container {
            background: #fff;
          }

          @media (min-width: 1300px) {
            .image-panel {
              display: grid;
              grid-template-columns: 450px 1fr;
            }
          }

          @media (min-width: 1400px) {
            .image-panel {
              display: grid;
              grid-template-columns: 1fr 850px;
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
      {images.map(({ id }, idx) => (
        <Result id={id} idx={idx} key={id}></Result>
      ))}
    </>
  );
};

export default FaceDetectionResult;
