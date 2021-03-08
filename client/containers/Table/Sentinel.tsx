import React, { useEffect, useRef } from "react";
import { useMatchMedia } from "../../hooks/matchMedia";
import { hasAttributeValue } from "../../utils/hasAttributeValue";
import useCreateObserver, {
  TMqlCallback,
  TObserverCallback,
} from "./useCreateObserver";

const HorizontalSentinel = ({ id }: { id: number }) => {
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

const THeadSentinel = ({ id }: { id: number }) => {
  // const imageHeight = useSelector(selectImageHeight({ id }));

  const sentinelId = "THeadSentinel";
  const tableSelector = `[data-id-table="${id}"]`;
  const theadMobileSelector = `.thead-sticky-mobile-${id}`;
  const theadDesktopSelector = `.thead-sticky-desktop-${id}`;
  const theadInnerSelector = ".thead-container";

  const imgElRef = useRef<HTMLImageElement | null>(null);
  const tableElRef = useRef<HTMLTableElement | null>(null);
  const theadElRef = useRef<HTMLDivElement | null>(null);
  const theadInnerElRef = useRef<HTMLDivElement | null>(null);
  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const imageHeightRef = useRef<number | null>(null);
  const theadStickyVisibleRef = useRef(false);
  const updateOnScrollRef = useRef(false);
  const hasInit = useRef(false);

  const stopPositionRef = useRef(0);
  const prevScrollYRef = useRef(0);

  const timeStampStickyVisibleRef = useRef(0);
  const timeStampGetPositions = useRef(0);

  const mqlRef = useMatchMedia();
  const inputHeight = 45;
  const topPadding = 15;
  const bottomStop = 120;

  const onScroll = () => {
    if (!theadStickyVisibleRef.current) return;
    if (!updateOnScrollRef.current) return;

    const scrollY = window.scrollY;
    const position = scrollY - prevScrollYRef.current;

    if (scrollY >= stopPositionRef.current) return;
    theadElRef.current!.style.transform = `translateY(${position}px)`;
  };

  const observerCallback: TObserverCallback = (entry) => {
    const theadInnerEl = theadInnerElRef.current;
    let isVisible = false;
    if (entry.intersectionRatio > 0) {
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

    theadInnerEl.style.transform = !isVisible
      ? "translateY(0%)"
      : "translateY(-125%)";
  };

  const mqlCallback: TMqlCallback = ({ e, observer }) => {
    console.log("mqlCallback!!!", e.matches);
    updateOnScrollRef.current = !e.matches;
    getTheadEl({ mobile: !e.matches });

    observer.observe(sentinelElRef.current!);
  };

  const getPrevScroll = () => {
    prevScrollYRef.current = Math.ceil(
      sentinelElRef.current!.getBoundingClientRect().top -
        imageHeightRef.current! -
        inputHeight -
        topPadding +
        window.scrollY
    );
  };

  const getStopPosition = () => {
    stopPositionRef.current =
      tableElRef.current!.getBoundingClientRect().bottom -
      imageHeightRef.current! -
      inputHeight -
      topPadding -
      bottomStop +
      window.scrollY;
  };

  useEffect(() => {
    // if (imageHeight == null) return;

    // imageHeightRef.current = imageHeight;

    window.clearTimeout(timeStampGetPositions.current);

    timeStampGetPositions.current = window.setTimeout(() => {
      getPrevScroll();
      getStopPosition();
    }, 200);
    // }, [imageHeight]);
  }, []);

  const getTheadEl = ({ mobile }: { mobile: boolean }) => {
    const parent = mobile ? tableElRef.current! : document;
    theadElRef.current = parent.querySelector(
      mobile ? theadMobileSelector : theadDesktopSelector
    );
    theadInnerElRef.current = theadElRef.current!.querySelector(
      theadInnerSelector
    );
  };

  useEffect(() => {
    tableElRef.current = document.querySelector(tableSelector);
    getTheadEl({ mobile: !mqlRef.current!.matches });
  }, []);

  useCreateObserver({
    id: id + sentinelId,
    hasInit,
    imageHeight: 0,
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

const InfoResultSentinel = ({ id }: { id: number }) => {
  const sentinelId = `infoResultSentinel`;

  // const imageHeight = useSelector(selectImageHeight({ id }));

  const theadSelector = `.thead-sticky-desktop-${id} .thead-container`;
  const theadInnerElRef = useRef<HTMLDivElement | null>(null);
  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const imageHeightRef = useRef<number | null>(null);
  const theadStickyVisibleRef = useRef(false);
  const hasInit = useRef(false);
  const mqlRef = useMatchMedia();

  const observerCallback: TObserverCallback = (entry, observer) => {
    const theadInnerEl = theadInnerElRef.current!;
    let isVisible = false;
    if (entry.intersectionRatio > 0) {
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

    theadInnerEl.style.transform = !isVisible
      ? "translateY(0%)"
      : "translateY(-125%)";
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

  // useEffect(() => {
  // if (imageHeight == null) return;

  // imageHeightRef.current = imageHeight;
  // }, [imageHeight]);

  useEffect(() => {
    theadInnerElRef.current = document.querySelector(theadSelector);
  }, []);

  useCreateObserver({
    id: id + sentinelId,
    desktop: true,
    hasInit,
    imageHeight: 0,
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
