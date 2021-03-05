import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMatchMedia } from "../../hooks/matchMedia";
import { RootState } from "../../store/rootReducer";
import { setScrollShadow, setShowStickyTHead } from "./tableSlice";
import useCreateObserver, {
  TMqlCallback,
  TObserverCallback,
} from "./useCreateObserver";

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

let timestampStickyVisible = 0;
const THeadSentinel = () => {
  const id = "THeadSentinel";
  const dispatch = useDispatch();
  const imageHeight = useSelector(
    (state: RootState) => state.demographics.imageHeight
  );

  const theadEl = document.querySelector(
    `.thead-sticky-mobile`
  ) as HTMLDivElement;
  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const imageHeightRef = useRef<number | null>(null);
  const theadStickyVisibleRef = useRef(false);
  const hasInit = useRef(false);
  const prevScrollYRef = useRef(0);
  const mqlRef = useMatchMedia();
  const inputHeight = 45;
  const topPadding = 15;

  const onScroll = () => {
    if (!theadStickyVisibleRef.current) return;

    const scrollY = window.scrollY;
    const position = scrollY - prevScrollYRef.current;

    theadEl.style.transform = `translateY(${position}px)`;
  };

  const observerCallback: TObserverCallback = (entry) => {
    let isVisible = false;
    if (entry.intersectionRatio > 0) {
      isVisible = true;
    }
    console.log(entry.target, { isVisible });

    window.clearTimeout(timestampStickyVisible);

    if (isVisible) {
      timestampStickyVisible = window.setTimeout(() => {
        theadStickyVisibleRef.current = !isVisible;
      }, 300);
    } else {
      theadStickyVisibleRef.current = !isVisible;
    }
    dispatch(setShowStickyTHead({ active: !isVisible, triggeredBy: id }));
  };

  const mqlCallback: TMqlCallback = ({ observer }) => {
    console.log("cb ", id);
    observer.observe(sentinelElRef.current!);
  };

  useEffect(() => {
    if (imageHeight == null) return;

    console.log({ imageHeight });
    imageHeightRef.current = imageHeight;

    prevScrollYRef.current = Math.ceil(
      sentinelElRef.current!.getBoundingClientRect().top -
        imageHeight! -
        inputHeight -
        topPadding +
        window.scrollY
    );
  }, [imageHeight]);

  useCreateObserver({
    id,
    hasInit,
    imageHeight,
    imageHeightRef,
    mql: mqlRef.current!,
    observerCallback,
    sentinelElRef,
    theadStickyVisibleRef,
    mqlCallback,
    scrollCallback: onScroll,
  });

  return (
    <div data-observer-id={id} className="sentinel" ref={sentinelElRef}>
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

const InfoResultSentinel = () => {
  const id = "infoResultSentinel";
  const dispatch = useDispatch();
  const imageHeight = useSelector(
    (state: RootState) => state.demographics.imageHeight
  );

  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const imageHeightRef = useRef<number | null>(null);
  const theadStickyVisibleRef = useRef(false);
  const hasInit = useRef(false);
  const mqlRef = useMatchMedia();

  const observerCallback: TObserverCallback = (entry, observer) => {
    console.log("InfoResultSentinel");
    let isVisible = false;
    if (entry.intersectionRatio > 0) {
      isVisible = true;
    }
    console.log(entry.target, { isVisible });
    theadStickyVisibleRef.current = !isVisible;
    dispatch(setShowStickyTHead({ active: !isVisible, triggeredBy: id }));
  };

  const mqlCallback: TMqlCallback = ({ e, observer }) => {
    if (e.matches) {
      console.log("reobserve: ", id);
      observer.observe(sentinelElRef.current!);
    } else {
      console.log("unobserve: ", id);
      observer.unobserve(sentinelElRef.current!);
    }
  };

  useEffect(() => {
    if (imageHeight == null) return;

    imageHeightRef.current = imageHeight;
  }, [imageHeight]);

  useCreateObserver({
    id,
    desktop: true,
    hasInit,
    imageHeight,
    imageHeightRef,
    mql: mqlRef.current!,
    observerCallback,
    sentinelElRef,
    theadStickyVisibleRef,
    mqlCallback,
  });

  return (
    <div data-observer-id={id} className="sentinel" ref={sentinelElRef}>
      <style jsx>
        {`
          .sentinel {
            position: absolute;
            top: 0px;
            left: 0;
            width: 100%;
            height: 0px;
          }
        `}
      </style>
    </div>
  );
};

export { HorizontalSentinel, THeadSentinel, InfoResultSentinel };
