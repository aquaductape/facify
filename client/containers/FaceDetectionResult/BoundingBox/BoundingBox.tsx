import { createSelector } from "@reduxjs/toolkit";
import { batch, useDispatch, useSelector } from "react-redux";
import { useMatchMedia } from "../../../hooks/matchMedia";
import { RootState } from "../../../store/rootReducer";
import { TDemographics } from "../../../ts";
import {
  selectDemographicsDisplay,
  selectHoverActive,
  setDemoItemHoverActive,
  setHoverActive,
} from "../ImageResult/demographicsSlice";

type TBoundingBoxProps = Pick<TDemographics, "bounding_box"> & {
  id: string;
  demographicId: string;
};

const BoundingBox = ({
  id,
  demographicId,
  bounding_box,
}: TBoundingBoxProps) => {
  const dispatch = useDispatch();
  // const demographic = useSelector(
  //   (state: RootState) =>
  //     state.demographics.demographics
  //       .find((item) => {
  //         // console.log("find demoitem");
  //         return item.id === id;
  //       })!
  //       .display.find((item) => {
  //         // console.log("find demodisplay");
  //         return item.id === demographicId;
  //       })!
  // );
  const demographic = useSelector(
    selectDemographicsDisplay({ id, demographicId })
  );
  const hoverActive = useSelector(selectHoverActive({ id }))!;
  const mqlRef = useMatchMedia();
  // , onToggleBoundingBoxHighlight from redux
  const onMouseEnter = () => {
    batch(() => {
      dispatch(
        setDemoItemHoverActive({
          id,
          demographicId,
          active: true,
          scrollIntoView: mqlRef.current!.matches ? true : false,
        })
      );
      dispatch(setHoverActive({ id, active: true }));
    });
  };
  const onMouseLeave = () => {
    batch(() => {
      dispatch(
        setDemoItemHoverActive({
          id,
          demographicId,
          active: false,
          scrollIntoView: false,
        })
      );
      dispatch(setHoverActive({ id, active: false }));
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
