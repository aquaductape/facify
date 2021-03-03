import { useEffect, useRef, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { TBoundingBox, TDemographics } from "../../../ts";
import { parseConcept } from "../../../utils/parseConcept";
import {
  setDemoItemHoverActive,
  setHoverActive,
} from "../ImageResult/demographicsSlice";
import createCroppedImgUrl from "./createCroppedImgUrl";

type BoundingCroppedImageProps = TDemographics & { idx: number };
const BoundingCroppedImage = ({
  id,
  bounding_box,
  concepts,
  idx,
}: BoundingCroppedImageProps) => {
  const dispatch = useDispatch();
  const imageUrl = useSelector((state: RootState) => state.imageUrl);
  const demographic = useSelector(
    (state: RootState) => state.demographics.demographicsDisplay[idx]
  )!;
  const [renderImage, setRenderImage] = useState(false);
  const croppedImgUrlRef = useRef("");
  const imgElRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = {
      src: imageUrl.uri!,
      naturalWidth: imageUrl.naturalWidth!,
      naturalHeight: imageUrl.naturalHeight!,
    };

    const run = async () => {
      croppedImgUrlRef.current = await createCroppedImgUrl({
        boundingBox: bounding_box,
        img,
      });
      setRenderImage(true);
    };
    run();
  }, []);

  const onMouseEnter = () => {
    batch(() => {
      dispatch(setDemoItemHoverActive({ id, active: true }));
      dispatch(setHoverActive({ active: true }));
    });
  };
  const onMouseLeave = () => {
    batch(() => {
      dispatch(setDemoItemHoverActive({ id, active: false }));
      dispatch(setHoverActive({ active: false }));
    });
  };

  const alt = parseConcept({ concepts });

  useEffect(() => {
    if (!demographic.hoverActive || !demographic.scrollIntoView) return;
    imgElRef.current?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "start",
    });
  }, [demographic.scrollIntoView]);

  return renderImage ? (
    <div>
      <div className="img-container" style={{ height: "70px" }}>
        <div className="bg"></div>
        <div className="img-outline-blue"></div>
        <div className="img-outline-white"></div>
        <img
          ref={imgElRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          src={croppedImgUrlRef.current}
          alt={alt}
        />
      </div>
      <style jsx>
        {`
          .img-container {
            position: relative;
            display: inline-block;
            height: 100%;
            margin-left: 10px;
          }
          .bg {
            position: absolute;
            top: -100px;
            left: -10px;
            width: calc(100% + 20px);
            height: 300px;
            z-index: -1;
          }

          img {
            position: relative;
            pointer-events: auto;
            height: 100%;
            z-index: 1;
          }
          .img-outline-blue,
          .img-outline-white {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }

          .img-outline-blue {
            outline: 5px solid #224aff;
          }

          .img-outline-white {
            outline: 1px solid #fff;
          }
        `}
      </style>
      {/* dynamic */}
      <style jsx>
        {`
          .bg {
            background: ${idx % 2 === 0 ? "#eee" : "#fff"};
          }

          .img-outline-blue,
          .img-outline-white {
            opacity: ${demographic.hoverActive ? "1" : "0"};
          }
        `}
      </style>
    </div>
  ) : null;
};

export default BoundingCroppedImage;
