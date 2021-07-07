import { useEffect, useRef } from "react";

export type TMqlGroup = {
  // 850px
  minWidth_550: MediaQueryList;
  minWidth_1300: MediaQueryList;
  minWidth_1900_and_minHeight_850: MediaQueryList;
};
const mqlGroup: TMqlGroup = {} as TMqlGroup;
const mqlRef: { current: TMqlGroup | null } = {
  current: null,
};
let mqlInit = false;

export const useMatchMedia = () => {
  useEffect(() => {
    if (mqlInit) return;
    mqlInit = true;

    // 850px
    mqlGroup.minWidth_550 = matchMedia("(min-width: 550px)");
    mqlGroup.minWidth_1300 = matchMedia("(min-width: 1300px)");
    mqlGroup.minWidth_1900_and_minHeight_850 = matchMedia(
      "(min-width: 1900px) and (min-height: 850px)"
    );
    mqlRef.current = mqlGroup;
  }, []);

  return mqlRef;
};
