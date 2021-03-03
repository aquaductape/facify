import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMatchMedia } from "../../hooks/matchMedia";
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

type TCreateObserverProps = {
  imageHeight: number | null;
  imageHeightRef: React.MutableRefObject<number | null>;
  sentinelInnerScrollRef: React.MutableRefObject<HTMLDivElement | null>;
  hasInit: React.MutableRefObject<boolean>;
  theadStickyVisibleRef: React.MutableRefObject<boolean>;
  matchOnDesktop?: boolean;
  mql: MediaQueryList;
  observerCallback: IntersectionObserverCallback;
  mqlCallback?: (
    e: MediaQueryListEvent,
    observer: IntersectionObserver
  ) => void;
  observerRoot?: null | HTMLElement;
};
//
let observer: IntersectionObserver | null = null;
const useCreateObserver = ({
  matchOnDesktop,
  hasInit,
  theadStickyVisibleRef,
  sentinelInnerScrollRef,
  imageHeightRef,
  imageHeight,
  observerCallback,
  mql,
  mqlCallback,
  observerRoot = null,
}: TCreateObserverProps) => {
  useEffect(() => {
    if (imageHeight == null || hasInit.current) return;
    hasInit.current = true;

    const theadEl = document.querySelector(
      `.thead-sticky-${matchOnDesktop ? "desktop" : "mobile"}`
    ) as HTMLDivElement;
    const inputHeight = 45;
    const topPadding = 15;

    const createObserver = (mediaMatches: boolean) => {
      const positionTop = mediaMatches
        ? imageHeightRef.current! + topPadding + inputHeight
        : 0;
      console.log(imageHeightRef.current);
      return new IntersectionObserver(observerCallback, {
        threshold: [0, 1],
        rootMargin: `-${positionTop}px 0px 0px 0px`,
      });
    };

    const onMediaQueryListEvent = (e: MediaQueryListEvent) => {
      console.log("change!!");
      observer!.disconnect();
      observer = createObserver(!e.matches);
      observer.observe(sentinelInnerScrollRef.current!);

      mqlCallback && mqlCallback(e, observer);

      if (!e.matches) {
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    };

    console.log("createObserver");
    if (!observer) {
      observer = createObserver(!mql.matches);

      mql.addEventListener("change", onMediaQueryListEvent);
    }
    observer.observe(sentinelInnerScrollRef.current!);

    console.log({ imageHeight });

    let prevScrollY = Math.ceil(
      sentinelInnerScrollRef.current!.getBoundingClientRect().top -
        imageHeight -
        inputHeight -
        topPadding +
        window.scrollY
    );
    console.log({ prevScrollY }, sentinelInnerScrollRef.current);
    const onScroll = () => {
      if (!theadStickyVisibleRef.current) return;

      const scrollY = window.scrollY;
      const position = scrollY - prevScrollY;

      console.log({ position, scrollY, prevScrollY });

      theadEl.style.transform = `translateY(${position}px)`;
    };

    if (!mql.matches) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer!.unobserve(sentinelInnerScrollRef.current!);
      // mql.removeEventListener('change', mediaQueryListCb)
    };
  }, [imageHeight]);
};

const THeadSentinel = () => {
  const dispatch = useDispatch();
  const imageHeight = useSelector(
    (state: RootState) => state.demographics.imageHeight
  );

  const sentinelInnerScrollRef = useRef<HTMLDivElement | null>(null);
  const imageHeightRef = useRef<number | null>(null);
  const theadStickyVisibleRef = useRef(false);
  const hasInit = useRef(false);
  const mqlRef = useMatchMedia();

  const observerCallback: IntersectionObserverCallback = (
    entries,
    observer
  ) => {
    entries.forEach((entry) => {
      let isVisible = false;
      if (entry.intersectionRatio > 0) {
        isVisible = true;
      }
      console.log(entry.target, { isVisible });
      theadStickyVisibleRef.current = !isVisible;
      dispatch(setShowStickyTHead(!isVisible));
    });
  };

  useEffect(() => {
    if (imageHeight == null) return;

    imageHeightRef.current = imageHeight;
  }, [imageHeight]);

  useCreateObserver({
    hasInit,
    imageHeight,
    imageHeightRef,
    mql: mqlRef.current!,
    observerCallback,
    sentinelInnerScrollRef,
    theadStickyVisibleRef,
  });

  return (
    <div className="sentinel" ref={sentinelInnerScrollRef}>
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
  const dispatch = useDispatch();
  const imageHeight = useSelector(
    (state: RootState) => state.demographics.imageHeight
  );

  const sentinelInnerScrollRef = useRef<HTMLDivElement | null>(null);
  const imageHeightRef = useRef<number | null>(null);
  const theadStickyVisibleRef = useRef(false);
  const hasInit = useRef(false);
  const mqlRef = useMatchMedia();

  const observerCallback: IntersectionObserverCallback = (
    entries,
    observer
  ) => {
    entries.forEach((entry) => {
      let isVisible = false;
      if (entry.intersectionRatio > 0) {
        isVisible = true;
      }
      console.log(entry.target, { isVisible });
      theadStickyVisibleRef.current = !isVisible;
      dispatch(setShowStickyTHead(!isVisible));
    });
  };

  const mqlCallback = (
    e: MediaQueryListEvent,
    observer: IntersectionObserver
  ) => {
    if (e.matches) {
      observer.unobserve(sentinelInnerScrollRef.current!);
    } else {
      observer.observe(sentinelInnerScrollRef.current!);
    }
  };

  useEffect(() => {
    if (imageHeight == null) return;

    imageHeightRef.current = imageHeight;
  }, [imageHeight]);

  useCreateObserver({
    hasInit,
    imageHeight,
    imageHeightRef,
    mql: mqlRef.current!,
    observerCallback,
    sentinelInnerScrollRef,
    theadStickyVisibleRef,
    mqlCallback,
  });

  return (
    <div className="sentinel" ref={sentinelInnerScrollRef}>
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
