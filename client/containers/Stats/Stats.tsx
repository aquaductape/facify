import React from "react";
import { useSelector } from "react-redux";
import FaceIcon from "../../components/Logo/svg/FaceIcon";
import { RootState } from "../../store/rootReducer";
import { selectDemographicsData } from "../FaceDetectionResult/ImageResult/demographicsSlice";

const Stats = ({ id }: { id: string }) => {
  const demographics = useSelector(selectDemographicsData({ id }));
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
        <FaceIcon title={msg}></FaceIcon>
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
