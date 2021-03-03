import { useEffect, useRef } from "react";

let mql: MediaQueryList | null = null;
const mqlRef: { current: MediaQueryList | null } = {
  current: null,
};

export const useMatchMedia = () => {
  // const mqlRef = useRef<MediaQueryList | null>(mql); // won't work cuz it will return new ref objs

  useEffect(() => {
    if (mql == null) {
      console.log("init mql");
      mql = matchMedia("(min-width: 1300px)");
      mqlRef.current = mql;
    }
  }, []);

  return mqlRef;
};
