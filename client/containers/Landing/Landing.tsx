import { useState } from "react";
import { useSelector } from "react-redux";
import FaceDetect from "../../components/Logo/svg/FaceDetect";
import LogoIcon from "../../components/Logo/svg/LogoIcon";
import { RootState } from "../../store/rootReducer";

const Landing = () => {
  const { error, imageStatus, uri } = useSelector(
    (state: RootState) => state.imageUrl
  );

  if (imageStatus === "DONE") {
    return null;
  }

  return (
    <section>
      <div className="header-title--container">
        <div className="header-title">
          <div className="header-title--logo" title="Facify">
            <LogoIcon></LogoIcon>
          </div>
          <h1>
            Find <span>Faces</span>
          </h1>
        </div>
      </div>
      <div className="header-image" title="human face vector art">
        <FaceDetect></FaceDetect>
      </div>
      <div className="header-text">
        <p>By using Computer Vision AI, you'll receive</p>
        <ul>
          <li>Crop Faces</li>
        </ul>
      </div>
    </section>
  );
};

export default Landing;
