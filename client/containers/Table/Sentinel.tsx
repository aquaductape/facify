import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { setScrollShadow, setShowStickyTHead } from "./tableSlice";

const HorizontalSentinel = () => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observerCb: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        let isVisible = false;
        if (entry.intersectionRatio > 0) {
          isVisible = true;
        }
        dispatch(setScrollShadow(!isVisible));
      });
    };
    const observer = new IntersectionObserver(observerCb, {
      threshold: [0, 1],
    });
    observer.observe(sentinelRef.current);
  }, [sentinelRef.current]);
  return (
    <div className="sentinel" ref={sentinelRef}>
      <style jsx>
        {`
          .sentinel {
            position: absolute;
            top: 0;
            right: 0;
            width: 10px;
            height: 100%;
          }
        `}
      </style>
    </div>
  );
};

const THeadSentinel = () => {
  const dispatch = useDispatch();
  const imageHeight = useSelector(
    (state: RootState) => state.demographics.imageHeight
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  const imgHeightRef = useRef<number>(0);

  useEffect(() => {
    if (imageHeight == null) return;

    imgHeightRef.current = imageHeight;
  }, [imageHeight]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observerCb: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        let isVisible = false;
        if (entry.intersectionRatio > 0) {
          isVisible = true;
        }
        console.log("header sentry", entry.intersectionRatio, isVisible);
        dispatch(setShowStickyTHead(!isVisible));
      });
    };
    const hiddenCover = 15;
    const inputheight = 45;
    const positionTop = imgHeightRef.current + hiddenCover + inputheight;

    const observer = new IntersectionObserver(observerCb, {
      threshold: [0, 1],
      rootMargin: `-${positionTop}px 0px 0px 0px`,
    });
    observer.observe(sentinelRef.current);
  }, [sentinelRef.current]);

  return (
    <div className="sentinel" ref={sentinelRef}>
      <style jsx>
        {`
          .sentinel {
            position: absolute;
            top: 28px;
            left: 0;
            width: 100%;
            height: 0px;
          }
        `}
      </style>
    </div>
  );
};

export { HorizontalSentinel, THeadSentinel };
