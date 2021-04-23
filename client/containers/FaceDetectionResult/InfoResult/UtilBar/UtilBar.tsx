import { useSelector } from "react-redux";
import Face from "../../../../components/svg/Face";
import { RootState } from "../../../../store/rootReducer";
import { selectDemographicParentChildIds } from "../../ImageResult/demographicsSlice";
import ClassifyDropdownBtns from "../Classify/ClassifyDropdownBtns";

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
            height: 100%;
          }

          .face-icon {
            width: 20px;
            flex-shrink: 0;
            height: 100%;
          }
          .face-text {
            flex: none;
            margin-left: 5px;
          }
        `}
      </style>
    </div>
  );
};

const UtilBar = ({ id, parentIdx }: TUtilBarProps) => {
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
      </div>
      <style jsx>
        {`
          .container {
            background: #fff;
            color: #000;
            border-bottom: 3px solid #000;
            height: 42px;
            padding: 0 8px;
          }

          .content {
            position: relative;
            display: flex;
            height: 100%;
            align-items: center;
          }

          .classify-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default UtilBar;
