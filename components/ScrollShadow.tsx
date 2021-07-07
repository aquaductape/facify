import { useEffect, useRef } from "react";
import { useMatchMedia } from "../hooks/useMatchMedia";

type TScrollShadowProps = {
  top: boolean;
  scrollShadowElsRef: React.MutableRefObject<{
    top: {
      current: HTMLDivElement | null;
    };
    bottom: {
      current: HTMLDivElement | null;
    };
  }>;
  // inputErrorRef: React.MutableRefObject<boolean>;
};

export const ScrollShadow = ({
  top,
  scrollShadowElsRef,
}: TScrollShadowProps) => {
  const mql = useMatchMedia().current!;
  let height = 25;
  let containerBottomPosition = mql.minWidth_770.matches ? 280 : 150;
  let position = top ? "top: 0;" : "bottom: 0;";
  height = top ? height : 20;

  const linearGradient = top
    ? "linear-gradient(180deg,#00000032,transparent);"
    : "linear-gradient(0deg,#00000032,transparent);";
  const radialGradient = top
    ? "radial-gradient( ellipse at 50% 0%, #00000040, transparent 150px)"
    : "radial-gradient( ellipse at 50% 100%, #00000040, transparent 150px)";
  // if (inputErrorRef.current) {
  const border = top
    ? `
            border-top-right-radius: 0;
            border-top-left-radius: 0;
    `
    : `
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
    `;
  //   position = "top: 180px;";
  // }

  return (
    <div
      ref={
        top ? scrollShadowElsRef.current.top : scrollShadowElsRef.current.bottom
      }
      className="scroll-shadow"
    >
      <div className="scroll-inner-shadow"></div>
      <style jsx>
        {`
          .scroll-shadow {
            position: absolute;
            ${position}
            right: 0;
            width: 100%;
            height: ${height}px;
            background: ${radialGradient};
            border-radius: 100%;
            ${border}
            opacity: 0;
            z-index: 10;
            pointer-events: none;
            transition: opacity 500ms;
          }
          .scroll-inner-shadow {
            width: 100%;
            height: ${20}px;
            background: ${linearGradient};
            margin-left: auto;
          }
        `}
      </style>
    </div>
  );
};

type TSentinelProps = {
  top: boolean;
  scrollShadowElsRef: React.MutableRefObject<{
    top: {
      current: HTMLDivElement | null;
    };
    bottom: {
      current: HTMLDivElement | null;
    };
  }>;
};

export const SentinelShadow = ({ top, scrollShadowElsRef }: TSentinelProps) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        let isVisible = false;

        if (entry.intersectionRatio > 0) {
          isVisible = true;
        }
        const scrollShadow = top
          ? scrollShadowElsRef.current.top.current!
          : scrollShadowElsRef.current.bottom.current!;

        if (!scrollShadow) {
          observer.disconnect();
          return;
        }

        scrollShadow.style.opacity = !isVisible ? "1" : "0";
      });
    });

    observer.observe(elRef.current!);
  }, []);

  return (
    <div ref={elRef} className="sentinel">
      <style jsx>
        {`
          .sentinel {
            position: ${top ? "absolute" : "relative"};
            ${top ? "top: 0.5px;" : "bottom: 0.5px;"}
            left: 0;
            width: 100%;
            height: 10px;
          }
        `}
      </style>
    </div>
  );
};
