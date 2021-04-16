import { useState } from "react";
import { useSelector } from "react-redux";
import Face from "../../../../components/svg/Face";
import { selectDemographicParentChildIds } from "../../ImageResult/demographicsSlice";
import ClassifyDropdownBtns from "../Classify/ClassifyDropdownBtns";

type TUtilBarProps = {
  id: string;
  parentIdx: number;
};

const UtilBar = ({ id, parentIdx }: TUtilBarProps) => {
  const demographics = useSelector(
    selectDemographicParentChildIds({ id: parentIdx })
  );

  const faces = demographics.length;
  return (
    <div className="container">
      <div className="content">
        <div className="face-description">
          <div className="face-icon">
            <Face title={"Total Number of Faces"}></Face>
          </div>
          <div className="face-text">{faces}</div>
        </div>
        <ClassifyDropdownBtns></ClassifyDropdownBtns>
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
            display: flex;
            height: 100%;
            align-items: center;
          }

          .face-description {
            display: flex;
            align-items: center;
            height: 100%;
          }

          .face-icon {
            width: 20px;
            height: 100%;
          }
          .face-text {
            margin-left: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default UtilBar;
