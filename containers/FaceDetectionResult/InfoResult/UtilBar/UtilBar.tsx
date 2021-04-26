import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import Face from "../../../../components/svg/Face";
import { RootState } from "../../../../store/rootReducer";
import { selectDemographicParentChildIds } from "../../ImageResult/demographicsSlice";
import ClassifyDropdownBtns from "../Classify/ClassifyDropdownBtns";
import { RelativeSection } from "../Classify/Section/Section";

type TUtilBarProps = {
  id: string;
  parentIdx: number;
};

const FaceIndicator = ({ id, parentIdx }: TUtilBarProps) => {
  const demographics = useSelector(
    selectDemographicParentChildIds({ id: parentIdx })
  );

  const filteredIds = useSelector(
    (state: RootState) =>
      state.demographics.parents[parentIdx].tableClassify.filter.childIds
  );
  const faces = demographics.length;
  const facesText = filteredIds ? `${filteredIds.length} / ${faces}` : faces;

  return (
    <div className="face-description">
      <div className="face-icon">
        <Face title={"Total Number of Faces"}></Face>
      </div>
      <div className="face-text">
        <span>{facesText}</span>
      </div>
      <style jsx>
        {`
          .face-description {
            display: flex;
            align-items: center;
            width: 20px;
            height: 100%;
          }

          .face-icon {
            flex-shrink: 0;
            width: 100%;
            height: 100%;
          }
          .face-text {
            flex: none;
            margin-left: 5px;
          }

          @media (min-width: 1300px) {
            .face-description {
              width: 25px;
            }
          }
        `}
      </style>
    </div>
  );
};

const UtilBar = ({ id, parentIdx }: TUtilBarProps) => {
  const classify = useSelector((state: RootState) => state.classify);

  return (
    <div className="container">
      <div className="content">
        <FaceIndicator id={id} parentIdx={parentIdx}></FaceIndicator>
        <div className="classify-container">
          <ClassifyDropdownBtns
            id={id}
            parentIdx={parentIdx}
          ></ClassifyDropdownBtns>
        </div>
        <CSSTransition
          classNames="slide"
          in={classify.open && classify.location === "bar"}
          timeout={200}
          unmountOnExit
        >
          <RelativeSection
            id={classify.id}
            parentIdx={classify.parentIdx}
            type={classify.type}
          ></RelativeSection>
        </CSSTransition>
      </div>
      <style jsx>
        {`
          .container {
            background: #fff;
            color: #000;
            height: 100%;
          }

          .content {
            position: relative;
            display: flex;
            height: 100%;
            align-items: center;
            z-index: 5;
          }

          .classify-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }
        `}
      </style>
    </div>
  );
};

export default UtilBar;
