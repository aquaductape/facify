import { useEffect, useRef } from "react";

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
const Sentinel = ({ top, scrollShadowElsRef }: TSentinelProps) => {
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
            position: ${top ? "absolute" : "static"};
            ${top ? "top: 0.5px;" : "bottom: 0;"}
            left: 0;
            width: 100%;
            height: 10px;
          }
        `}
      </style>
    </div>
  );
};

export default Sentinel;
