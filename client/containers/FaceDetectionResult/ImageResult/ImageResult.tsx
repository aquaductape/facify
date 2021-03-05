import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { appHeight } from "../../../constants";
import { RootState } from "../../../store/rootReducer";
import { parseConcept } from "../../../utils/parseConcept";
import { reflow } from "../../../utils/reflow";
import {
  saveImageDimensions,
  setElOnLoadStatus,
} from "../../UploadImageForm/imageUrlSlice";
import BoundingBox from "../BoundingBox/BoundingBox";
import { setImageHeight } from "./demographicsSlice";

const ImageResult = () => {
  const dispatch = useDispatch();
  const [renderBoundingBox, setRenderBoundingBox] = useState(false);
  const { error, imageStatus, uri } = useSelector(
    (state: RootState) => state.imageUrl
  );
  const demographics = useSelector(
    (state: RootState) => state.demographics.demographics
  );

  const renderBoundingBoxRef = useRef(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const resizeImgRef = useRef<() => void>(
    debounce(() => {
      if (!renderBoundingBoxRef.current) return;
      console.log("fire");
      const containerWidth = imageContainerRef.current!.clientWidth;
      const imgWidth = imgRef.current!.clientWidth;
      let imgHeight = imgRef.current!.clientHeight;
      const diff = containerWidth / imgWidth;
      imgRef.current!.style.height = `${imgHeight * diff}px`;
      reflow();
      imgHeight = imgRef.current!.clientHeight;

      dispatch(setImageHeight(imgHeight));
    }, 150)
  );

  const onMainImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.target as HTMLImageElement;
    const { naturalHeight, naturalWidth } = img;
    batch(() => {
      dispatch(saveImageDimensions({ naturalHeight, naturalWidth }));
      dispatch(setElOnLoadStatus("DONE"));
    });
    // creates cropped image url
    console.log("loaded!!");

    setRenderBoundingBox(true);
    renderBoundingBoxRef.current = true;
    // it's too bad I have to use setTimeout when onLoad is supposed to fire when image is fully loaded
    // also try catch doesn't work
    setTimeout(() => {
      window.URL.revokeObjectURL(img.src);
    }, 500);
  };

  if (error) return <div>{error}</div>;

  const demographicsList = renderBoundingBox
    ? demographics.map(({ id, bounding_box }, idx) => (
        <BoundingBox
          id={id}
          bounding_box={bounding_box}
          idx={idx}
          key={id}
        ></BoundingBox>
      ))
    : null;

  const alt = () => {
    if (!renderBoundingBox) return "";

    const faces = demographics.length;
    const strFace = faces && faces === 1 ? "face" : "faces";
    let msg = `${faces} ${strFace} detected. `;

    demographics.forEach((demo, idx) => {
      const { concepts } = demo;
      msg += parseConcept({ concepts, faceNumber: idx + 1 });
    });

    return msg;
  };

  useEffect(() => {
    if (!renderBoundingBox) return;
    resizeImgRef.current!();
  }, [renderBoundingBox]);

  useEffect(() => {
    window.addEventListener("resize", resizeImgRef.current!, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", resizeImgRef.current!);
    };
  }, []);

  return (
    <div className="container" ref={imageContainerRef}>
      <div className="image-demo-container">
        <img
          ref={imgRef}
          onLoad={onMainImageLoad}
          className="image-demo"
          src={uri!}
          alt={alt()}
        />
        {demographicsList}
      </div>
      <style jsx>
        {`
          .container {
            position: sticky;
            top: 60px;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #000;
            max-height: ${appHeight}px;
            overflow: hidden;
            z-index: 55;
          }

          .image-demo-container {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          img {
            width: auto;
            max-height: ${appHeight}px;
          }
        `}
      </style>
    </div>
  );
};

export default ImageResult;
