import React from "react";
import { useSelector } from "react-redux";
import Face from "../../components/svg/Face";
import { selectDemographicParentChildIds } from "../FaceDetectionResult/ImageResult/demographicsSlice";

const Stats = ({ id }: { id: number }) => {
  const demographics = useSelector(selectDemographicParentChildIds({ id }));
  // face from boundingbox.length
  const faces = demographics.length;
  const strFace = faces && faces === 1 ? "Face" : "Faces";
  const msg = `${faces} ${strFace}`;
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
      <span className="icon">
        <Face title={msg}></Face>
      </span>
      <span className="icon-text">{faces}</span>
      <style jsx>
        {`
          .stats {
            display: flex;
            align-items: center;
            height: 100%;
          }
          .icon {
            height: 20px;
            width: 20px;
          }

          .icon-text {
            margin: 0 5px;
          }
        `}
      </style>
    </div>
  );
};

export default Stats;
