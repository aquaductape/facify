import { batch, useDispatch, useSelector } from "react-redux";
import { useMatchMedia } from "../../../hooks/matchMedia";
import { RootState } from "../../../store/rootReducer";
import { TDemographics } from "../../../ts";
import {
  setDemoItemHoverActive,
  setHoverActive,
} from "../ImageResult/demographicsSlice";

type TBoundingBoxProps = Pick<TDemographics, "id" | "bounding_box"> & {
  idx: number;
};

const BoundingBox = ({ id, idx, bounding_box }: TBoundingBoxProps) => {
  const dispatch = useDispatch();
  const demographic = useSelector(
    (state: RootState) => state.demographics.demographicsDisplay[idx]
  )!;
  const hoverActive = useSelector(
    (state: RootState) => state.demographics.hoverActive
  )!;
  const mqlRef = useMatchMedia();
  // , onToggleBoundingBoxHighlight from redux
  const onMouseEnter = () => {
    batch(() => {
      dispatch(
        setDemoItemHoverActive({
          id,
          active: true,
          scrollIntoView: mqlRef.current!.matches ? true : false,
        })
      );
      dispatch(setHoverActive({ active: true }));
    });
  };
  const onMouseLeave = () => {
    batch(() => {
      dispatch(
        setDemoItemHoverActive({ id, active: false, scrollIntoView: false })
      );
      dispatch(setHoverActive({ active: false }));
    });
  };

  const renderBox = {
    top: bounding_box.top_row * 100 + "%",
    right: 100 - bounding_box.right_col * 100 + "%",
    bottom: 100 - bounding_box.bottom_row * 100 + "%",
    left: bounding_box.left_col * 100 + "%",
  };

  return (
    <div
      // id={"face-bounding-box-" + boxId}
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
            border: 3px solid #224aff;
            outline: 1px solid #fff;
            outline-offset: -1px;
          }
        `}
      </style>
      {/* dynamic */}
      <style jsx>
        {`
          .active {
            ${!demographic.hoverActive && hoverActive ? "opacity: 0;" : ""}
          }
        `}
      </style>
    </div>
  );
};

export default BoundingBox;
