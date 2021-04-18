import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useMatchMedia } from "../../../../hooks/useMatchMedia";
import { FireFox } from "../../../../lib/onFocusOut/browserInfo";
import { RootState } from "../../../../store/rootReducer";
import { hasAttributeValue } from "../../../../utils/hasAttributeValue";
import { parseConceptValue } from "../../../../utils/parseConcept";
import { selectImageHeight } from "./imageHeightSlice";
import useCreateObserver, {
  TMqlCallback,
  TObserverCallback,
} from "./useCreateObserver";

const HorizontalSentinel = ({ id }: { id: string }) => {
  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  // const shadowElRef = useRef<HTMLDivElement | null>(null)
  const shadowSelector = `[data-id-scroll-shadow="${id}"]`;

  useEffect(() => {
    const shadowElRef = document.querySelector(
      shadowSelector
    ) as HTMLDivElement;
    const observerCb: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        let isVisible = false;
        if (entry.intersectionRatio > 0) {
          isVisible = true;
        }

        shadowElRef.style.opacity = !isVisible ? "1" : "0";
      });
    };
    const observer = new IntersectionObserver(observerCb, {
      threshold: [0, 1],
    });
    observer.observe(sentinelElRef.current!);
  }, []);

  return (
    <div className="sentinel" ref={sentinelElRef}>
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
  const imageHeight = useSelector(selectImageHeight({ id }));

  const sentinelId = "THeadSentinel";
  const theadSelector = `[data-id-sticky-thead="${id}"]`;
  const theadInnerSelector = ".thead-container";

  const theadElRef = useRef<HTMLDivElement | null>(null);
  const theadInnerElRef = useRef<HTMLDivElement | null>(null);
  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const imageHeightRef = useRef<number | null>(null);
  const theadStickyVisibleRef = useRef(false);
  const hasInit = useRef(false);

  const timeStampStickyVisibleRef = useRef(0);

  const mqlRef = useMatchMedia();

  const observerCallback: TObserverCallback = (entry) => {
    const theadInnerEl = theadInnerElRef.current;
    let isVisible = false;

    const nearBottom =
      entry.boundingClientRect.top / entry.rootBounds!.height > 0.9;
    if (entry.intersectionRatio > 0 || nearBottom) {
      // if (entry.intersectionRatio > 0) {
      isVisible = true;
    }

    window.clearTimeout(timeStampStickyVisibleRef.current);

    if (isVisible) {
      timeStampStickyVisibleRef.current = window.setTimeout(() => {
        theadStickyVisibleRef.current = !isVisible;
      }, 300);
    } else {
      theadStickyVisibleRef.current = !isVisible;
    }

    if (!theadInnerEl) return;

    theadInnerEl.setAttribute(
      "data-triggered-by-thead",
      !isVisible ? "true" : "false"
    );

    if (
      hasAttributeValue(theadInnerEl, {
        attr: "data-triggered-by-info-result",
        val: "true",
      })
    ) {
      return;
    }

    theadInnerEl.setAttribute("aria-hidden", isVisible ? "true" : "false");
    theadInnerEl.style.transform = !isVisible
      ? "translateY(0%)"
      : "translateY(-125%)";
  };

  const mqlCallback: TMqlCallback = ({ e, observer }) => {
    if (e.matches) {
      observer.observe(sentinelElRef.current!);
    } else {
      observer.unobserve(sentinelElRef.current!);
    }
  };

  useEffect(() => {
    if (imageHeight == null) return;

    imageHeightRef.current = imageHeight;
  }, [imageHeight]);

  useEffect(() => {
    theadElRef.current = document.querySelector(theadSelector);
    theadInnerElRef.current = theadElRef.current!.querySelector(
      theadInnerSelector
    );
  }, []);

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
    // scrollCallback: onScroll,
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

const BarSentinel = ({ id }: { id: string }) => {
  const imageHeight = useSelector(selectImageHeight({ id }));
  const triggerRefresh = useSelector(
    (state: RootState) => state.imageHeight.triggerRefresh
  );

  const sentinelId = "BarSentinel";
  const tableSelector = `[data-id-table="${id}"]`;
  const theadStaticSelector = `[data-id-static-thead="${id}"]`;
  const theadStickySelector = `[data-id-sticky-thead="${id}"]`;
  const theadInnerSelector = ".thead-container";

  const tableElRef = useRef<HTMLTableElement | null>(null);
  const theadStaticElRef = useRef<HTMLDivElement | null>(null);
  const theadStickyElRef = useRef<HTMLDivElement | null>(null);
  const theadInnerElRef = useRef<HTMLDivElement | null>(null);
  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const imageHeightRef = useRef<number | null>(null);
  const theadStickyVisibleRef = useRef(false);
  const positionRef = useRef(0);
  const hasInit = useRef(false);

  const timeStampStickyVisibleRef = useRef(0);

  const mqlRef = useMatchMedia();
  const inputHeight = 45;
  const barHeight = 0;
  const topPadding = 15;
  const bottomStop = 140;

  const observerCallback: TObserverCallback = (entry) => {
    const theadEl = theadStickyElRef.current!;
    const theadInnerEl = theadInnerElRef.current;
    let isVisible = false;

    const nearBottom =
      entry.boundingClientRect.top + 100 > entry.rootBounds!.height;
    if (entry.intersectionRatio > 0 || nearBottom) {
      isVisible = true;
    }

    window.clearTimeout(timeStampStickyVisibleRef.current);

    if (isVisible) {
      timeStampStickyVisibleRef.current = window.setTimeout(() => {
        theadStickyVisibleRef.current = !isVisible;
      }, 300);
    } else {
      theadStickyVisibleRef.current = !isVisible;
    }

    if (!theadInnerEl) return;

    theadInnerEl.setAttribute(
      "data-triggered-by-thead",
      !isVisible ? "true" : "false"
    );

    if (
      hasAttributeValue(theadInnerEl, {
        attr: "data-triggered-by-info-result",
        val: "true",
      })
    )
      return;

    theadInnerEl.setAttribute("aria-hidden", isVisible ? "true" : "false");
    theadInnerEl.style.transform = !isVisible
      ? "translateY(0%)"
      : "translateY(-125%)";

    if (!FireFox) {
      forceRestoreScrollPosition();
    }
  };

  /**
   * Chrome bug, haven't tested on all platforms, setting css translate on child will reset parent's scrollLeft position
   */
  const forceRestoreScrollPosition = () => {
    const theadEl = theadStickyElRef.current!;
    // uses polling
    const max = 10;
    let count = 0;

    const scrollLeft = Number(theadEl.getAttribute("scroll-left")) || 0;

    if (scrollLeft === 0) return;

    const run = () => {
      if (count >= max) {
        return;
      }
      setTimeout(() => {
        let matches = false;
        const scrollLeft = Number(theadEl.getAttribute("scroll-left")) || 0;
        if (scrollLeft === theadEl.scrollLeft) matches = true;
        theadEl.scrollLeft = scrollLeft;
        count++;

        if (matches) return;
        run();
      }, 50);
    };

    run();
  };

  const mqlCallback: TMqlCallback = ({ e, observer }) => {
    // theadElRef.current = doc

    if (e.matches) {
      theadStickyElRef.current!.style.top = "";
    } else {
      theadStickyElRef.current!.style.top = `${positionRef.current}px`;
    }

    observer.observe(sentinelElRef.current!);
  };

  useEffect(() => {
    if (imageHeight == null || mqlRef.current?.minWidth_1300.matches) return;

    imageHeightRef.current = imageHeight;
    const position = imageHeight + inputHeight + topPadding;
    positionRef.current = position;

    theadStickyElRef.current!.style.top = `${position}px`;
  }, [imageHeight, triggerRefresh]);

  useEffect(() => {
    tableElRef.current = document.querySelector(tableSelector);
    theadStaticElRef.current = tableElRef.current!.querySelector(
      theadStaticSelector
    );
    theadStickyElRef.current = document.querySelector(theadStickySelector);
    theadInnerElRef.current = theadStickyElRef.current!.querySelector(
      theadInnerSelector
    );
  }, []);

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
            top: 0;
            left: 0;
            width: 100%;
            height: 0px;
          }
        `}
      </style>
    </div>
  );
};

// parentEl.scrollLeft = 100
// childEl.style.transform = 'translateY(100%)'

const InfoResultSentinel = ({ id }: { id: string }) => {
  const sentinelId = `infoResultSentinel`;

  const imageHeight = useSelector(selectImageHeight({ id }));

  const theadSelector = `[data-id-sticky-thead="${id}"]`;
  const theadInnerSelector = ".thead-container";
  const theadElRef = useRef<HTMLDivElement | null>(null);
  const theadInnerElRef = useRef<HTMLDivElement | null>(null);
  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const imageHeightRef = useRef<number | null>(null);
  const theadStickyVisibleRef = useRef(false);
  const hasInit = useRef(false);
  const mqlRef = useMatchMedia();

  const observerCallback: TObserverCallback = (entry, observer) => {
    const theadEl = theadElRef.current!;
    const theadInnerEl = theadInnerElRef.current!;
    let isVisible = false;

    const nearBottom =
      entry.boundingClientRect.top + 100 > entry.rootBounds!.height;
    if (entry.intersectionRatio > 0 || nearBottom) {
      // if (entry.intersectionRatio > 0) {
      isVisible = true;
    }

    theadStickyVisibleRef.current = !isVisible;

    if (!theadInnerEl) return;

    theadInnerEl.setAttribute(
      "data-triggered-by-info-result",
      !isVisible ? "true" : "false"
    );

    if (
      hasAttributeValue(theadInnerEl, {
        attr: "data-triggered-by-thead",
        val: "true",
      })
    )
      return;

    theadInnerEl.setAttribute("aria-hidden", isVisible ? "true" : "false");
    theadInnerEl.style.transform = !isVisible
      ? "translateY(0%)"
      : "translateY(-125%)";
  };

  const mqlCallback: TMqlCallback = ({ e, observer }) => {
    if (e.matches) {
      observer.observe(sentinelElRef.current!);
    } else {
      observer.unobserve(sentinelElRef.current!);
    }
  };

  useEffect(() => {
    if (imageHeight == null) return;
    imageHeightRef.current = imageHeight;
  }, [imageHeight]);

  useEffect(() => {
    theadElRef.current = document.querySelector(theadSelector);
    theadInnerElRef.current = theadElRef.current!.querySelector(
      theadInnerSelector
    );
  }, []);

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
            top: -45px;
            left: 0;
            width: 100%;
            height: 0px;
          }
        `}
      </style>
    </div>
  );
};

type TClassifiySentinelProps = {
  id: string;
};
const ClassifySentinelTop = ({ id }: TClassifiySentinelProps) => {
  return (
    <div data-id-classify-sentinel-top={id} className="top">
      <style jsx>
        {`
          .top {
            position: absolute;
            top: -15px;
            left: 0;
            width: 100%;
            height: 0;
          }
        `}
      </style>
    </div>
  );
};
const ClassifySentinelBottom = ({ id }: TClassifiySentinelProps) => {
  const imageHeight = useSelector(selectImageHeight({ id }));
  const elRef = useRef<HTMLDivElement | null>(null);
  const inputHeight = 45;
  const viewportTop = 15;
  const theaderBottomMargin = 125;

  useEffect(() => {
    if (imageHeight == null) return;
    elRef.current!.style.bottom = `${
      inputHeight + viewportTop + theaderBottomMargin + imageHeight
    }px`;
  }, [imageHeight]);

  return (
    <div data-id-classify-sentinel-bottom={id} ref={elRef} className="bottom">
      <style jsx>
        {`
          .bottom {
            position: absolute;
            bottom: 163px;
            left: 0;
            width: 100%;
            height: 0;
          }
        `}
      </style>
    </div>
  );
};

export {
  HorizontalSentinel,
  THeadSentinel,
  InfoResultSentinel,
  BarSentinel,
  ClassifySentinelTop,
  ClassifySentinelBottom,
};
