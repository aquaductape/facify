import { useEffect, useRef } from "react";
import { TMqlGroup } from "../../../../hooks/useMatchMedia";

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
};

type TSentinelItem = {
  id: string;
  desktop?: boolean;
  el: HTMLElement;
  onObserve: TObserverCallback;
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
let mMql: MediaQueryList | null = null;
let windowInit = false;

export const theadObserver = {
  disconnect: (id?: string) => {
    if (id != null) {
      const item = sentinelItems.find((item) => item.id === id)!;
      observer?.unobserve(item.el);
      return;
    }

    sentinelItems.forEach(({ el }) => observer?.unobserve(el));
  },
  reconnect: () =>
    sentinelItems.forEach(({ el, desktop }) => {
      if (!desktopValid(mMql!, desktop)) return;

      observer?.observe(el);
    }),
};

const desktopValid = (
  e: MediaQueryList | MediaQueryListEvent,
  desktop?: boolean
) => {
  // if media is less than 1300px
  if (!desktop) return true;
  // if media is greater than 1300px
  if (e.matches && desktop) return true;
  return false;
};

const useCreateObserver = ({
  id,
  desktop,
  hasInit,
  sentinelElRef,
  imageHeightRef,
  imageHeight,
  observerCallback,
  mql: _mql,
  mqlCallback,
}: TCreateObserverProps) => {
  const onMediaQueryListenerRef = useRef<
    ((e: MediaQueryListEvent) => void) | null
  >(null);
  const prevScrollYRef = useRef(0);
  const inputHeight = 45;
  const topPadding = 15;
  const barHeight = 0;

  useEffect(() => {
    if (imageHeightRef.current == null || hasInit.current) return;

    const mql = _mql.minWidth_1300;
    mMql = mql;

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
            if (result) result.onObserve(entry, observer);
          });
        },
        {
          threshold: [0, 1],
          rootMargin: `-${0}px 0px 0px 0px`,
        }
      );
    };

    const onMediaQueryListener = (e: MediaQueryListEvent) => {
      // observer!.disconnect();
      // observer = null;
      // observer = createObserver(!e.matches);

      sentinelItems.forEach((item) => {
        if (item.onMql) item.onMql({ e, observer: observer! });
      });
    };

    hasInit.current = true;

    sentinelItems.push({
      id,
      desktop,
      el: sentinelElRef.current!,
      onObserve: observerCallback,
      onMql: mqlCallback,
    });

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

    if (observer && desktopValid(mql, desktop)) {
      // if (observer) {
      observer.observe(sentinelElRef.current!);
    }
  }, [imageHeight]);

  useEffect(() => {
    return () => {
      const idx = sentinelItems.findIndex((item) => item.id === id!)!;

      if (idx !== -1) {
        sentinelItems.splice(idx, 1);
      }

      if (!sentinelItems.length) {
        // mql.removeEventListener("change", onMediaQueryListenerRef.current!);
        mqlInit = false;
        windowInit = false;
        observer = null;
      }
    };
  }, []);
};

export default useCreateObserver;
