import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";

const Stats = () => {
  const demographics = useSelector(
    (state: RootState) => state.demographics.demographics
  );
  // face from boundingbox.length
  const faces = demographics.length;
  const strFace = faces && faces === 1 ? "Face" : "Faces";
  //
  // 	let render =
  // 		!loading && faces ? (
  // 			<div className="stats">
  // 				<p>Found {`${faces} ${strFace}`} </p>
  // 			</div>
  // 		) : null;
  // 	return render;
  return (
    <div className="stats">
      <h2>Found {`${faces} ${strFace}`}</h2>
    </div>
  );
};

export default Stats;
