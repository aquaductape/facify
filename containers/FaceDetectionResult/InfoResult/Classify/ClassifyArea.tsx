import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { useMatchMedia } from "../../../../hooks/useMatchMedia";
import { RootState } from "../../../../store/rootReducer";
import { setClassifyDisplay } from "./classifySlice";
import { StickySection } from "./Section/Section";

const ClassifyArea = () => {
  const dispatch = useDispatch();
  const classify = useSelector((state: RootState) => state.classify);
  const mql = useMatchMedia();
  const initRef = useRef(true);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = false;
      return;
    }
    if (!mql.current) return;

    mql.current!.minWidth_1300.addEventListener("change", () => {
      dispatch(setClassifyDisplay({ open: false }));
    });
  }, [mql]);

  if (mql.current && mql.current.minWidth_1300.matches) return null;

  return (
    <div className="container">
      <CSSTransition
        classNames="slide"
        in={classify.open && classify.location === "viewport"}
        timeout={200}
        unmountOnExit
      >
        <StickySection
          id={classify.id}
          parentIdx={classify.parentIdx}
          type={classify.type}
        ></StickySection>
      </CSSTransition>
      <style jsx>
        {`
          .container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 90;
          }
        `}
      </style>
    </div>
  );
};

export default ClassifyArea;
