import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { RootState } from "../../../../store/rootReducer";
import Section from "./Section/Section";

const ClassifyArea = () => {
  const classify = useSelector((state: RootState) => state.classify);

  console.log({ classify });

  return (
    <div className="container">
      <CSSTransition
        classNames="slide"
        in={classify.open}
        timeout={200}
        unmountOnExit
      >
        <Section
          id={classify.id}
          parentIdx={classify.parentIdx}
          type={classify.type}
        ></Section>
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
