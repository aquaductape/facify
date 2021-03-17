import { batch, useDispatch, useSelector } from "react-redux";
import {
  selectDemographicsDisplay,
  selectHoverActive,
  setDemoItemHoverActive,
  setHoverActive,
} from "../ImageResult/demographicsSlice";

type TBoundingBoxProps = {
  id: string;
  parentId: number;
};

const BoundingBox = ({ id, parentId }: TBoundingBoxProps) => {
  const dispatch = useDispatch();
  const demographic = useSelector(selectDemographicsDisplay({ id }));
  const hoverActive = useSelector(selectHoverActive({ id: parentId }));
  const onMouseEnter = () => {
    batch(() => {
      dispatch(
        setDemoItemHoverActive({
          id,
          // parentId,
          active: true,
          scrollIntoView: true,
        })
      );
      dispatch(setHoverActive({ id: parentId, active: true }));
    });
  };
  const onMouseLeave = () => {
    batch(() => {
      dispatch(
        setDemoItemHoverActive({
          id,
          // parentId,
          active: false,
          scrollIntoView: false,
        })
      );
      dispatch(setHoverActive({ id: parentId, active: false }));
    });
  };

  const renderBox = {
    top: demographic.bounding_box.top_row * 100 + "%",
    right: 100 - demographic.bounding_box.right_col * 100 + "%",
    bottom: 100 - demographic.bounding_box.bottom_row * 100 + "%",
    left: demographic.bounding_box.left_col * 100 + "%",
  };

  return (
    <div
      className="bounding-box active"
      style={renderBox}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* static */}
      <style jsx>
        {`
          .bounding-box {
            position: absolute;
          }

          .active {
            border: 2px solid #fff;
            outline: 2px solid #224aff;
            outline-offset: -1px;
            opacity: 1;
          }
        `}
      </style>
      {/* dynamic */}
      <style jsx>
        {`
          .active {
            opacity: ${!demographic.hoverActive && hoverActive ? "0.4" : "1"};
          }
        `}
      </style>
    </div>
  );
};

export default BoundingBox;
