import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import ImageResult from "./ImageResult/ImageResult";
import InfoResult from "./InfoResult/InfoResult";
import Seperator from "./Bar/Seperator";
import Bar from "./Bar/Bar";
import { reflow } from "../../utils/reflow";
import { animationEnd } from "../UploadImageForm/animateUpload";

type TResultProps = {
  id: string;
  idx: number;
};

const Result = React.memo(({ id, idx }: TResultProps) => {
  const demographicNodeElRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (idx === 0) {
      return;
    }

    const demographicNodeEl = demographicNodeElRef.current!;

    demographicNodeEl.style.opacity = "1";

    demographicNodeEl.style.transform = "translateY(-100%)";
    demographicNodeEl.style.position = "relative";
    demographicNodeEl.style.zIndex = "-1";
    reflow();
    demographicNodeEl.style.opacity = "1";
    demographicNodeEl.style.transition = "500ms transform";
    demographicNodeEl.style.transform = "";

    setTimeout(() => {
      demographicNodeEl.style.position = "";
      demographicNodeEl.style.background = "";
      demographicNodeEl.style.zIndex = "";
      demographicNodeEl.style.transition = "";

      animationEnd({ id });
    }, 500);
  }, []);
  return (
    <li
      id={`demographic-node-${id}`}
      className="container"
      ref={demographicNodeElRef}
    >
      <div className="bar-container">
        {idx ? <Seperator id={id}></Seperator> : null}
        <Bar id={id} idx={idx}></Bar>
      </div>

      <div className="image-panel">
        <ImageResult id={id} idx={idx} />
        <InfoResult id={id} idx={idx} />
      </div>

      <style jsx>
        {`
          .container {
            display: block;
            padding: 0;
            margin: 0;
            list-style-type: none;
            opacity: 0;
            background: #fff;
          }

          .image-panel {
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
    </li>
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
    <ul>
      {images.map(({ id }, idx) => {
        return <Result id={id} idx={idx} key={id}></Result>;
      })}
      <style jsx>
        {`
          ul {
            padding: 0;
            margin: 0;
          }
        `}
      </style>
    </ul>
  );
};

export default FaceDetectionResult;
