import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { batch, useDispatch, useSelector, shallowEqual } from "react-redux";
import { appHeight } from "../../../constants";
import { RootState } from "../../../store/rootReducer";
import { parseConcept } from "../../../utils/parseConcept";
import { reflow } from "../../../utils/reflow";
import {
  saveImageDimensions,
  setElOnLoadStatus,
  TImageItem,
} from "../../UploadImageForm/imageUrlSlice";
import BoundingBox from "../BoundingBox/BoundingBox";
import { setImageHeight } from "./demographicsSlice";

type TImageResultProps = Pick<
  TImageItem,
  "id" | "error" | "imageStatus" | "uri"
>;
const ImageResult = ({ id, error, imageStatus, uri }: TImageResultProps) => {
  const dispatch = useDispatch();
  const [renderBoundingBox, setRenderBoundingBox] = useState(false);
  const demographics = useSelector(
    (state: RootState) =>
      state.demographics.demographics.find((item) => {
        return item.id === id;
      })!.data
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
      let imageHeight = imgRef.current!.clientHeight;
      const diff = containerWidth / imgWidth;
      imgRef.current!.style.height = `${imageHeight * diff}px`;
      reflow();
      imageHeight = imgRef.current!.clientHeight;
      if (imageHeight < 200) imageHeight = 200;

      dispatch(setImageHeight({ id, imageHeight }));
    }, 150)
  );

  const onMainImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.target as HTMLImageElement;
    const { naturalHeight, naturalWidth } = img;
    batch(() => {
      dispatch(saveImageDimensions({ id, naturalHeight, naturalWidth }));
      dispatch(setElOnLoadStatus({ id, elOnLoadStatus: "DONE" }));
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
    ? demographics.map(({ id: demographicId, bounding_box }) => (
        <BoundingBox
          id={id}
          demographicId={demographicId}
          bounding_box={bounding_box}
          key={demographicId}
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
            min-height: 200px;
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
