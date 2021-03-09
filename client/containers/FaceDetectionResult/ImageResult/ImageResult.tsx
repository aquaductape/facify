import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { batch, useDispatch, useSelector, shallowEqual } from "react-redux";
import { appHeight, appHeightDesktop } from "../../../constants";
import { reflow } from "../../../utils/reflow";
import { setImageHeight } from "../../Table/imageHeightSlice";
import BoundingBox from "../BoundingBox/BoundingBox";
import {
  selectDemographicParentChildIds,
  selectImageUrl,
  setImageDimensions,
} from "./demographicsSlice";

type TImageResultProps = {
  id: number;
};
const ImageResult = ({ id }: TImageResultProps) => {
  const dispatch = useDispatch();
  const parentId = id;
  const [renderBoundingBox, setRenderBoundingBox] = useState(false);
  const demographicParentChildren = useSelector(
    selectDemographicParentChildIds({ id })
  );
  const imageUrl = useSelector(selectImageUrl({ id }));

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
      console.log({ imageHeight });

      dispatch(setImageHeight({ id, imageHeight }));
    }, 150)
  );

  const onMainImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.target as HTMLImageElement;
    const { src, naturalHeight, naturalWidth } = img;
    // creates cropped image url
    console.log("loaded!!");

    setRenderBoundingBox(true);
    renderBoundingBoxRef.current = true;
    // it's too bad I have to use setTimeout when onLoad is supposed to fire when image is fully loaded
    // also try catch doesn't work
    // setTimeout(() => {
    //   window.URL.revokeObjectURL(img.src);
    // }, 500);
  };

  const demographicsList = renderBoundingBox
    ? demographicParentChildren.map((id) => (
        <BoundingBox id={id} parentId={parentId} key={id}></BoundingBox>
      ))
    : null;

  //   const alt = () => {
  //     if (!renderBoundingBox) return "";
  //
  //     const faces = demographicParent.length;
  //     const strFace = faces && faces === 1 ? "face" : "faces";
  //     let msg = `${faces} ${strFace} detected. `;
  //
  //     demographicParent.forEach((demo, idx) => {
  //       const { concepts } = demo;
  //       msg += parseConcept({ concepts, faceNumber: idx + 1 });
  //     });
  //
  //     return msg;
  //   };

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
          src={imageUrl.uri}
          // alt={alt()}
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
            background: #2d3556;
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

          @media (min-width: 1300px) {
            .container,
            img {
              max-height: ${appHeightDesktop}px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ImageResult;
