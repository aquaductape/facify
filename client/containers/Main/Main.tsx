import React, { useEffect } from "react";
import LogoText from "../../components/Logo/LogoText";
import { appHeight } from "../../constants";
import FaceDetectionResult from "../FaceDetectionResult/FaceDetectionResult";
import Landing from "../Landing/Landing";
import UploadImageForm from "../UploadImageForm/UploadImageForm";

const Main = () => {
  return (
    <>
      <div className="hidden-cover">
        <div className="hide-shadow"></div>
      </div>
      <LogoText></LogoText>
      <UploadImageForm></UploadImageForm>
      <main>
        <Landing></Landing>
        <FaceDetectionResult></FaceDetectionResult>
      </main>
      <style jsx>
        {`
          main {
          }

          .hidden-cover {
            position: fixed;
            top: 0;
            left: 15px;
            right: 15px;
            height: 15px;
            background: #224aff;
            z-index: 80;
          }
          .hide-shadow {
            position: absolute;
            top: 0;
            right: -10px;
            display: none;
            width: 10px;
            height: 70px;
            background: #224aff;
          }

          @media (min-width: 768px) {
            .hidden-cover {
              left: 50px;
              right: 50px;
            }
          }

          @media (min-width: 1300px) {
            main {
              box-shadow: 10px 10px 0 #00000054;
              max-height: ${appHeight}px;
            }

            .hide-shadow {
              display: block;
            }
          }
        `}
      </style>
    </>
  );
};

export default Main;
