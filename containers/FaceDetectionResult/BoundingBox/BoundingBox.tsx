import { batch, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
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

  const onBlur = () => {
    if (!demographic.generalHover) return;

    dispatch(
      setDemoItemHoverActive({
        id,
        parentId,
        active: false,
        scrollIntoView: false,
        generalActive: false,
      })
    );
  };

  const onClick = () => {
    dispatch(
      setDemoItemHoverActive({
        id,
        parentId,
        active: true,
        scrollIntoView: true,
        generalActive: true,
        scrollTimestamp: Date.now(),
      })
    );
  };

  const onMouseEnter = () => {
    dispatch(
      setDemoItemHoverActive({
        id,
        parentId,
        active: true,
        generalActive: true,
        scrollIntoView: false,
      })
    );
  };

  const onMouseLeave = () => {
    dispatch(
      setDemoItemHoverActive({
        id,
        parentId,
        generalActive: false,
        active: false,
        scrollIntoView: false,
      })
    );
  };

  const renderBox = {
    top: demographic.bounding_box.top_row * 100 + "%",
    right: 100 - demographic.bounding_box.right_col * 100 + "%",
    bottom: 100 - demographic.bounding_box.bottom_row * 100 + "%",
    left: demographic.bounding_box.left_col * 100 + "%",
  };

  if (demographic.removed) return null;

  return (
    <div
      className="bounding-box active"
      style={renderBox}
      onClick={onClick}
      onBlur={onBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={-1}
    >
      {/* static */}
      <style jsx>
        {`
          .bounding-box {
            position: absolute;
            cursor: pointer;
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
