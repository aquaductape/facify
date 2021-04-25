import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { RootState } from "../../../../store/rootReducer";
import { StickySection } from "./Section/Section";

const ClassifyArea = () => {
  const classify = useSelector((state: RootState) => state.classify);

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
