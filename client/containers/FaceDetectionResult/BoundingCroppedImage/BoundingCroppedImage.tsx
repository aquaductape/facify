import { useEffect, useRef, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { useMatchMedia } from "../../../hooks/matchMedia";
import { parseConcept } from "../../../utils/parseConcept";
import {
  selectDemographicsDisplay,
  selectImageUrl,
  setDemoItemHoverActive,
  setHoverActive,
} from "../ImageResult/demographicsSlice";
import createCroppedImgUrl from "./createCroppedImgUrl";
import smoothScrollTo from "../../../utils/smoothScrollTo";

type BoundingCroppedImageProps = {
  id: number;
  parentId: number;
  idx: number;
};

const BoundingCroppedImage = ({
  id,
  parentId,
  idx,
}: BoundingCroppedImageProps) => {
  const dispatch = useDispatch();
  const demographic = useSelector(selectDemographicsDisplay({ id }));
  const imageUrl = useSelector(selectImageUrl({ id: parentId }));

  const croppedImgUrlRef = useRef("");
  const infoResultElRef = useRef<HTMLTableElement | null>(null);
  const imgElRef = useRef<HTMLImageElement>(null);
  const mql = useMatchMedia();

  const [renderImage, setRenderImage] = useState(false);

  useEffect(() => {
    const img = {
      src: imageUrl.uri!,
      naturalWidth: imageUrl.naturalWidth!,
      naturalHeight: imageUrl.naturalHeight!,
    };

    const run = async () => {
      croppedImgUrlRef.current = await createCroppedImgUrl({
        boundingBox: demographic.bounding_box,
        img,
      });
      setRenderImage(true);
    };
    run();
  }, []);

  const onMouseEnter = () => {
    batch(() => {
      dispatch(
        setDemoItemHoverActive({
          id,
          // parentId,
          active: true,
        })
      );
      dispatch(setHoverActive({ id: parentId, active: true }));
    });
  };
  const onMouseLeave = () => {
    batch(() => {
      dispatch(
        setDemoItemHoverActive({
          id,
          // parentId,
          active: false,
        })
      );
      dispatch(setHoverActive({ id: parentId, active: false }));
    });
  };

  const alt = parseConcept({ concepts: demographic.concepts });

  useEffect(() => {
    if (!demographic.hoverActive || !demographic.scrollIntoView) return;
    if (!infoResultElRef.current) {
      infoResultElRef.current = document.querySelector(
        `[data-id-info-result="${parentId}"]`
      );
    }
    const viewPortTopPadding = 15;
    const inputHeight = 45;
    const theadPadding = 50;
    const matches = mql.current?.matches;
    const imageResultEl = !matches
      ? document.querySelector(`[data-id-image-result="${parentId}"]`)
      : null;

    const getInfoPosition = () => {
      const { scrollY } = window;
      const stickyPadding = inputHeight + viewPortTopPadding;
      const infoPositionInDoc =
        infoResultElRef.current!.getBoundingClientRect().top + scrollY;
      const diff = scrollY - infoPositionInDoc;

      if (infoPositionInDoc < diff + scrollY) {
        return diff + stickyPadding;
      }

      return 0;
    };
    requestAnimationFrame(() => {
      const container = matches ? infoResultElRef.current! : window;
      const infoPosition = matches ? getInfoPosition() : 0;
      const padding = matches
        ? -(theadPadding + infoPosition)
        : -(
            viewPortTopPadding +
            inputHeight +
            theadPadding +
            imageResultEl!.clientHeight
          );

      const destination = matches
        ? imgElRef.current?.parentElement?.parentElement?.parentElement
            ?.offsetTop!
        : imgElRef.current!;

      smoothScrollTo({
        destination,
        duration: 500,
        padding,
        container,
      });
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
