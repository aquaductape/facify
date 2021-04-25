import { useEffect, useRef } from "react";
import { CONSTANTS } from "../../../../../constants";
import Menu from "./Menu";

type TSectionProps = {
  id: string;
  parentIdx: number;
  type: "sort" | "filter" | null;
};

export const StickySection = ({ id, parentIdx, type }: TSectionProps) => {
  const containerElRef = useRef<HTMLDivElement | null>(null);
  const theadStickyElRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelVisibleRef = useRef({ top: false, bottom: false });
  const onScrollRef = useRef<(() => void) | null>(null);
  const scrollEventActiveRef = useRef<{
    active: boolean;
    type: "top" | "bottom";
  }>({
    active: false,
    type: "top",
  });
  const positionRef = useRef({
    top: 0,
    translate: 0,
    scrollY: 0,
  });

  const onScroll = () => {
    const { scrollY } = window;
    const position = positionRef.current;
    const diff = position.scrollY - scrollY;

    containerElRef.current!.style.transform = `translateY(${diff}px)`;
  };

  useEffect(() => {
    const demographicNodeSelector = `demographic-node-${id}`;
    const theadStickySelector = `[data-id-sticky-thead="${id}"]`;
    const barSentinelTopSelector = `[data-id-classify-sentinel-top="${id}"]`;
    const barSentinelBottomSelector = `[data-id-classify-sentinel-bottom="${id}"]`;

    const parentEl = document.getElementById(demographicNodeSelector)!;
    const theadStickyEl = parentEl.querySelector(
      theadStickySelector
    ) as HTMLElement;
    const barSentinelTopEl = parentEl.querySelector(
      barSentinelTopSelector
    ) as HTMLElement;
    const barSentinelBottomEl = parentEl.querySelector(
      barSentinelBottomSelector
    ) as HTMLElement;

    theadStickyElRef.current = theadStickyEl;

    positionRef.current.top = getTheadStickyTopPosition();
    setContainerTopPosition();

    const observer = createIntersectionObserver();
    observer.observe(barSentinelTopEl);
    observer.observe(barSentinelBottomEl);
    observerRef.current = observer;

    onScrollRef.current = onScroll;

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScrollRef.current!);
    };
  }, []);

  const getTheadStickyTopPosition = () => {
    return (
      theadStickyElRef.current!.getBoundingClientRect().top -
      containerElRef.current!.clientHeight -
      CONSTANTS.utilBarHeight +
      2 // not pixel perfect
    );
  };

  const setContainerTopPosition = () => {
    containerElRef.current!.style.top = `${positionRef.current.top}px`;
    containerElRef.current!.style.transform = "";
  };

  const createIntersectionObserver = () => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const sentinelVisible = sentinelVisibleRef.current;
        const scrollEventActive = scrollEventActiveRef.current;
        const position = positionRef.current;
        const el = entry.target as HTMLElement;
        let isVisible = false;

        if (entry.intersectionRatio > 0) {
          isVisible = true;
        }

        // if (!scrollEventActiveRef && el.dataset.idClassifySentinelTop) {
        //   sentinelVisible.top = isVisible;
        // }
        // if(!scrollEventActiveRef && el.dataset.idClassifySentinelBottom) {
        //   sentinelVisible.bottom = isVisible;
        // }
        console.log(
          entry.target,
          scrollEventActive.type,
          el.dataset.idClassifySentinelBottom,
          { isVisible }
        );

        if (
          (scrollEventActive.active &&
            scrollEventActive.type === "top" &&
            el.dataset.idClassifySentinelTop) ||
          (scrollEventActive.active &&
            scrollEventActive.type === "bottom" &&
            el.dataset.idClassifySentinelBottom)
        ) {
          console.log("remove");
          window.removeEventListener("scroll", onScrollRef.current!);
          position.scrollY = window.scrollY;
          position.translate = 0;
          position.top = getTheadStickyTopPosition();

          setContainerTopPosition();
          scrollEventActive.active = false;
          return;
        }

        if (
          isVisible &&
          el.dataset.idClassifySentinelTop &&
          entry.boundingClientRect.top < window.innerHeight * 0.5
        ) {
          scrollEventActive.active = true;
          scrollEventActive.type = "top";
          position.scrollY = window.scrollY;
          position.translate = 0;
          position.top = getTheadStickyTopPosition();

          setContainerTopPosition();
          console.log("add scroll from top");
          window.addEventListener("scroll", onScrollRef.current!);
          return;
        }

        if (
          !isVisible &&
          el.dataset.idClassifySentinelBottom &&
          entry.boundingClientRect.top < window.innerHeight * 0.5
        ) {
          scrollEventActive.active = true;
          scrollEventActive.type = "bottom";
          position.scrollY = window.scrollY;
          position.translate = 0;
          position.top = getTheadStickyTopPosition();

          setContainerTopPosition();
          console.log("add scroll from bottom");
          window.addEventListener("scroll", onScrollRef.current!);
          return;
        }
      });
    });

    return observer;
  };
  // when sentinel is observer fires (either visible or hidden), to make sure that section is placed pixel perfect, you have to get BCR of theadStickyEl

  return (
    <div className="container" ref={containerElRef}>
      <div className="sentinel"></div>
      <div className="classify-section inner">
        <Menu id={id} parentIdx={parentIdx} type={type}></Menu>
      </div>
      <style jsx>{`
        .container {
          position: absolute;
          top: 0;
          width: 100%;
          max-width: 1550px;
          padding: 0 15px;
        }

        .container.slide-enter,
        .container.slide-exit {
          overflow: hidden;
        }

        .slide-enter .inner {
          transform: translateY(101%);
        }

        .slide-enter-active .inner {
          transform: translateY(0);
          transition: transform 200ms;
        }

        .slide-exit .inner {
          transform: translateY(0);
        }

        .slide-exit-active .inner {
          transform: translateY(101%);
          transition: transform 200ms;
        }

        .inner {
          height: 222px;
          background: #fff;
          border-bottom: 3px solid #666666;
          box-shadow: 0 -10px 10px -8px #0009;
          margin-top: 5px;
        }

        .sentinel {
          position: absolute;
        }

        @media (min-width: 768px) {
          .container {
            padding: 0 50px;
          }
        }
      `}</style>
    </div>
  );
};

export const RelativeSection = ({ id, parentIdx, type }: TSectionProps) => {
  return (
    <div className="container">
      <div className="classify-section inner">
        <Menu id={id} parentIdx={parentIdx} type={type}></Menu>
      </div>
      <style jsx>{`
        .container {
          position: absolute;
          top: 45px;
          width: 100%;
        }

        .container.slide-enter,
        .container.slide-exit {
          overflow: hidden;
        }

        .slide-enter .inner {
          transform: translateY(-101%);
        }

        .slide-enter-active .inner {
          transform: translateY(0);
          transition: transform 200ms;
        }

        .slide-exit .inner {
          transform: translateY(0);
        }

        .slide-exit-active .inner {
          transform: translateY(-101%);
          transition: transform 200ms;
        }

        .inner {
          height: 222px;
          background: #fff;
          border: 1px solid #999;
          border-top: 3px solid #666666;
          box-shadow: 0 10px 10px -8px #0009;
          margin-bottom: 5px;
        }
      `}</style>
    </div>
  );
};
