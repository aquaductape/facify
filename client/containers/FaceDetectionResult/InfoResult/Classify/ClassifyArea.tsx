import { useSelector } from "react-redux";
import TransitionSlide from "../../../../components/TransitionSlide";
import { RootState } from "../../../../store/rootReducer";
import ClassifySection from "./ClassifySection";

const ClassifyArea = () => {
  const classify = useSelector((state: RootState) => state.classify);

  return (
    <div className="container">
      <TransitionSlide
        in={classify.open}
        slideTo={"up"}
        positionAbsolute={false}
      >
        <ClassifySection type={classify.type}></ClassifySection>
      </TransitionSlide>
      <style jsx>
        {`
          .container {
            position: fixed;
            top: 0;
            left: 0;
          }
        `}
      </style>
    </div>
  );
};

export default ClassifyArea;
