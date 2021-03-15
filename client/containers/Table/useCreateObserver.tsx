import { useEffect, useRef } from "react";
import { TMqlGroup } from "../../hooks/useMatchMedia";

type TCreateObserverProps = {
  id: string;
  desktop?: boolean;
  imageHeight: number | null;
  imageHeightRef: React.MutableRefObject<number | null>;
  sentinelElRef: React.MutableRefObject<HTMLDivElement | null>;
  hasInit: React.MutableRefObject<boolean>;
  theadStickyVisibleRef: React.MutableRefObject<boolean>;
  matchOnDesktop?: boolean;
  mql: TMqlGroup;
  observerCallback: TObserverCallback;
  mqlCallback?: TMqlCallback;
  scrollCallback?: () => void;
};

type TSentinelItem = {
  id: string;
  onObserve: TObserverCallback;
  onScroll?: () => void;
  onMql?: TMqlCallback;
};

export type TObserverCallback = (
  entry: IntersectionObserverEntry,
  observer: IntersectionObserver
) => void;

export type TObserverItem = {
  id: string;
  callback: TObserverCallback;
};

export type TMqlCallback = (props: {
  e: MediaQueryListEvent;
  observer: IntersectionObserver;
}) => void;

let observer: IntersectionObserver | null = null;
let sentinelItems: TSentinelItem[] = [];
let mqlInit = false;
let windowInit = false;

const useCreateObserver = ({
  id,
  desktop,
  hasInit,
  sentinelElRef,
  imageHeightRef,
  imageHeight,
  observerCallback,
  scrollCallback,
  mql: _mql,
  mqlCallback,
}: TCreateObserverProps) => {
  const onScrollRef = useRef<(() => void) | null>(null);
  // onMediaQueryListEvent =
  const onMediaQueryListenerRef = useRef<
    ((e: MediaQueryListEvent) => void) | null
  >(null);
  const prevScrollYRef = useRef(0);
  const inputHeight = 45;
  const topPadding = 15;
  const barHeight = 0;

  //   const onUpdateRootMargin = (imageHeight: number | null) => {
  //     if (imageHeight == null || !hasInit.current) return;
  //     if (imageHeight > 300 && mql.matches) return;
  //
  //     console.log("onupdateroot", mql.matches);
  //
  //     observer!.disconnect();
  //     observer = null;
  //     observer = createObserver(!mql.matches);
  //   };
  //
  //   useEffect(() => {
  //     onUpdateRootMargin(imageHeight);
  //   }, [imageHeight]);

  useEffect(() => {
    if (imageHeightRef.current == null || hasInit.current) return;

    const mql = _mql.minWidth_1300;

    const createObserver = (mediaMatches: boolean) => {
      if (observer) return observer;

      const positionTop = mediaMatches
        ? imageHeightRef.current! + topPadding + inputHeight + barHeight
        : 50;

      return new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            const target = entry.target as HTMLElement;
            const id = target.dataset.observerId;
            const result = sentinelItems.find((item) => item.id === id);
            // console.log(sentinelItems, id);
            if (result) result.onObserve(entry, observer);
          });
        },
        {
          threshold: [0, 1],
          rootMargin: `-${0}px 0px 0px 0px`,
        }
      );
    };

    const desktopValid = (e: MediaQueryList | MediaQueryListEvent) => {
      // if media is less than 1300px
      if (!desktop) return true;
      // if media is greater than 1300px
      if (e.matches && desktop) return true;
      return false;
    };

    const onMediaQueryListener = (e: MediaQueryListEvent) => {
      // observer!.disconnect();
      // observer = null;
      // observer = createObserver(!e.matches);

      sentinelItems.forEach((item) => {
        if (item.onMql) item.onMql({ e, observer: observer! });
      });

      if (!e.matches) {
        console.log("addwindow");
        window.addEventListener("scroll", onScrollRef.current!, {
          passive: true,
        });
      } else {
        console.log("removewindow");
        window.removeEventListener("scroll", onScrollRef.current!);
      }
    };

    const onScroll = () => {
      sentinelItems.forEach((item) => {
        if (item.onScroll) item.onScroll();
      });
    };

    hasInit.current = true;

    sentinelItems.push({
      id,
      onObserve: observerCallback,
      onMql: mqlCallback,
      onScroll: scrollCallback,
    });

    // console.log(sentinelItems);

    if (!onMediaQueryListenerRef.current) {
      onMediaQueryListenerRef.current = onMediaQueryListener;
    }

    if (!observer) {
      observer = createObserver(!mql.matches);
    }

    if (!desktop && !mqlInit) {
      mql.addEventListener("change", onMediaQueryListenerRef.current!);
      mqlInit = true;
    }

    if (observer && desktopValid(mql)) {
      // if (observer) {
      console.log("observe", id);
      observer.observe(sentinelElRef.current!);
    }

    if (!onScrollRef.current) {
      onScrollRef.current = onScroll;
    }

    if (scrollCallback && !windowInit && !mql.matches) {
      console.log("addwindow");
      windowInit = true;
      window.addEventListener("scroll", onScrollRef.current!, {
        passive: true,
      });
    }
  }, [imageHeight]);

  useEffect(() => {
    return () => {
      // const sentinelEl = sentinelElRef.current as HTMLElement;
      // observer!.unobserve(sentinelEl);

      const idx = sentinelItems.findIndex((item) => item.id === id!)!;

      if (idx !== -1) {
        sentinelItems.splice(idx, 1);
      }

      console.log("CLEAN UP");
      if (!sentinelItems.length) {
        window.removeEventListener("scroll", onScrollRef.current!);
        // mql.removeEventListener("change", onMediaQueryListenerRef.current!);
        mqlInit = false;
        windowInit = false;
        observer = null;
      }
    };
  }, []);
};

export default useCreateObserver;
