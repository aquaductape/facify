import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMatchMedia } from "../../hooks/matchMedia";
import { RootState } from "../../store/rootReducer";
import { setScrollShadow, setShowStickyTHead } from "./tableSlice";
import useCreateObserver, {
  TMqlCallback,
  TObserverCallback,
} from "./useCreateObserver";

const HorizontalSentinel = ({ id }: { id: string }) => {
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
        dispatch(setScrollShadow({ id, scrollShadow: !isVisible }));
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

const THeadSentinel = ({ id }: { id: string }) => {
  const sentinelId = "THeadSentinel";
  const dispatch = useDispatch();
  const imageHeight = useSelector(
    (state: RootState) =>
      state.demographics.demographics.find((item) => item.id === id)!
        .imageHeight
  );
  const theadSelector = `.thead-sticky-mobile-${id}`;
  const theadElRef = useRef<HTMLDivElement | null>(
    document.querySelector(theadSelector)
  );
  const timestampStickyVisibleRef = useRef(0);
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

    theadElRef.current!.style.transform = `translateY(${position}px)`;
  };

  const observerCallback: TObserverCallback = (entry) => {
    let isVisible = false;
    if (entry.intersectionRatio > 0) {
      isVisible = true;
    }
    // console.log(id, entry.target, { isVisible });

    window.clearTimeout(timestampStickyVisibleRef.current);

    if (isVisible) {
      timestampStickyVisibleRef.current = window.setTimeout(() => {
        theadStickyVisibleRef.current = !isVisible;
      }, 300);
    } else {
      theadStickyVisibleRef.current = !isVisible;
    }
    dispatch(
      setShowStickyTHead({ id, active: !isVisible, triggeredBy: sentinelId })
    );
  };

  const mqlCallback: TMqlCallback = ({ observer }) => {
    console.log("cb ", id);
    observer.observe(sentinelElRef.current!);
  };

  useEffect(() => {
    if (imageHeight == null) return;

    console.log({ imageHeight });
    imageHeightRef.current = imageHeight;

    if (!theadElRef.current) {
      theadElRef.current = document.querySelector(theadSelector);
    }

    setTimeout(() => {
      prevScrollYRef.current = Math.ceil(
        sentinelElRef.current!.getBoundingClientRect().top -
          imageHeight! -
          inputHeight -
          topPadding +
          window.scrollY
      );
      console.log("prevScrollRef", imageHeight);
    }, 100);
  }, [imageHeight]);

  useCreateObserver({
    id: id + sentinelId,
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
    <div
      data-observer-id={id + sentinelId}
      className="sentinel"
      ref={sentinelElRef}
    >
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

const InfoResultSentinel = ({ id }: { id: string }) => {
  const sentinelId = `infoResultSentinel`;
  const dispatch = useDispatch();
  const imageHeight = useSelector(
    (state: RootState) =>
      state.demographics.demographics.find((item) => item.id === id)!
        .imageHeight
  );

  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const imageHeightRef = useRef<number | null>(null);
  const theadStickyVisibleRef = useRef(false);
  const hasInit = useRef(false);
  const mqlRef = useMatchMedia();

  const observerCallback: TObserverCallback = (entry, observer) => {
    // console.log("InfoResultSentinel");
    let isVisible = false;
    if (entry.intersectionRatio > 0) {
      isVisible = true;
    }
    // console.log(entry.target, { isVisible });
    theadStickyVisibleRef.current = !isVisible;
    dispatch(
      setShowStickyTHead({ id, active: !isVisible, triggeredBy: sentinelId })
    );
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
    id: id + sentinelId,
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
    <div
      data-observer-id={id + sentinelId}
      className="sentinel"
      ref={sentinelElRef}
    >
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
