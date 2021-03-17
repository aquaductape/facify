import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useMatchMedia } from "../../hooks/useMatchMedia";
import { RootState } from "../../store/rootReducer";
import { hasAttributeValue } from "../../utils/hasAttributeValue";
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
  const theadSelector = `[data-id-thead-sticky="${id}"] .thead-container`;

  const theadElRef = useRef<HTMLDivElement | null>(null);
  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const imageHeightRef = useRef<number | null>(null);
  const theadStickyVisibleRef = useRef(false);
  const hasInit = useRef(false);

  const timeStampStickyVisibleRef = useRef(0);

  const mqlRef = useMatchMedia();

  const observerCallback: TObserverCallback = (entry) => {
    const theadEl = theadElRef.current;
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

    if (!theadEl) return;

    theadEl.setAttribute(
      "data-triggered-by-thead",
      !isVisible ? "true" : "false"
    );

    if (
      hasAttributeValue(theadEl, {
        attr: "data-triggered-by-info-result",
        val: "true",
      })
    )
      return;

    theadEl.setAttribute("aria-hidden", isVisible ? "true" : "false");
    theadEl.style.transform = !isVisible
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
  const theadSelector = `[data-id-thead-sticky="${id}"]`;
  const theadInnerSelector = ".thead-container";

  const tableElRef = useRef<HTMLTableElement | null>(null);
  const theadStaticElRef = useRef<HTMLDivElement | null>(null);
  const theadElRef = useRef<HTMLDivElement | null>(null);
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
  };

  const mqlCallback: TMqlCallback = ({ e, observer }) => {
    // theadElRef.current = doc

    if (e.matches) {
      theadElRef.current!.style.top = "";
    } else {
      theadElRef.current!.style.top = `${positionRef.current}px`;
    }

    observer.observe(sentinelElRef.current!);
  };

  useEffect(() => {
    if (imageHeight == null || mqlRef.current?.minWidth_1300.matches) return;

    imageHeightRef.current = imageHeight;
    const position = imageHeight + inputHeight + topPadding;
    positionRef.current = position;

    theadElRef.current!.style.top = `${position}px`;
  }, [imageHeight, triggerRefresh]);

  useEffect(() => {
    tableElRef.current = document.querySelector(tableSelector);
    theadStaticElRef.current = tableElRef.current!.querySelector(
      theadStaticSelector
    );
    theadElRef.current = document.querySelector(theadSelector);
    theadInnerElRef.current = theadElRef.current!.querySelector(
      theadInnerSelector
    );
    // imgElRef.current = document.querySelector(imgSelector);
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

const InfoResultSentinel = ({ id }: { id: string }) => {
  const sentinelId = `infoResultSentinel`;

  const imageHeight = useSelector(selectImageHeight({ id }));

  const theadSelector = `[data-id-thead-sticky="${id}"] .thead-container`;
  const theadInnerElRef = useRef<HTMLDivElement | null>(null);
  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const imageHeightRef = useRef<number | null>(null);
  const theadStickyVisibleRef = useRef(false);
  const hasInit = useRef(false);
  const mqlRef = useMatchMedia();

  const observerCallback: TObserverCallback = (entry, observer) => {
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
    theadInnerElRef.current = document.querySelector(theadSelector);
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

export { HorizontalSentinel, THeadSentinel, InfoResultSentinel, BarSentinel };
