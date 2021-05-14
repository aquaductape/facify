import { useEffect, useMemo, useRef, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { useMatchMedia } from "../../../hooks/useMatchMedia";
import { parseConcept } from "../../../utils/parseConcept";
import {
  selectDemographicsDisplay,
  setDemoItemHoverActive,
  setHoverActive,
} from "../ImageResult/demographicsSlice";
import smoothScrollTo from "../../../utils/smoothScrollTo";

type BoundingCroppedImageProps = {
  id: string;
  parentId: string;
  parentIdNumber: number;
};

const BoundingCroppedImage = ({
  id,
  parentId,
  parentIdNumber,
}: BoundingCroppedImageProps) => {
  const dispatch = useDispatch();
  const demographic = useSelector(selectDemographicsDisplay({ id }));

  const infoResultElRef = useRef<HTMLTableElement | null>(null);
  const imgElRef = useRef<HTMLImageElement>(null);
  const mqlGroup = useMatchMedia();

  const onMouseEnter = () => {
    dispatch(
      setDemoItemHoverActive({
        id,
        parentId: parentIdNumber,
        generalActive: true,
        active: true,
      })
    );
  };

  const onMouseLeave = () => {
    dispatch(
      setDemoItemHoverActive({
        id,
        parentId: parentIdNumber,
        generalActive: false,
        active: false,
      })
    );
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
    const mql = mqlGroup.current!.minWidth_1300;
    const imageResultEl = !mql.matches
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
      const container = mql.matches ? infoResultElRef.current! : window;
      const infoPosition = mql.matches ? getInfoPosition() : 0;
      const padding = mql.matches
        ? -(theadPadding + infoPosition)
        : -(
            viewPortTopPadding +
            inputHeight +
            theadPadding +
            imageResultEl!.clientHeight
          );

      const destination = mql.matches
        ? imgElRef.current?.parentElement?.parentElement?.parentElement
            ?.offsetTop!
        : imgElRef.current!;

      smoothScrollTo({
        destination,
        duration: 500,
        easing: "easeInOutQuad",
        padding,
        container,
      });
    });
  }, [demographic.scrollIntoView, demographic.scrollTimestamp]);

  return (
    <div>
      <div className="img-container" style={{ width: "50px" }}>
        <div className="img-outline-blue"></div>
        <div className="img-outline-white"></div>
        <img
          ref={imgElRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          src={demographic.uri}
          alt={alt}
        />
      </div>
      <style jsx>
        {`
          .img-container {
            position: relative;
            margin-left: 10px;
          }

          img {
            position: relative;
            display: block;
            pointer-events: auto;
            width: 50px;
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
          .img-outline-blue,
          .img-outline-white {
            opacity: ${demographic.hoverActive ? "1" : "0"};
          }
        `}
      </style>
    </div>
  );
};

export default BoundingCroppedImage;
