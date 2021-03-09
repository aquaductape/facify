import React, { useEffect } from "react";
import LogoText from "../../components/Logo/LogoText";
import { appHeight } from "../../constants";
import getScrollbarWidth from "../../utils/getScrollWidth";
import FaceDetectionResult from "../FaceDetectionResult/FaceDetectionResult";
import Landing from "../Landing/Landing";
import UploadImageForm from "../UploadImageForm/UploadImageForm";

const Main = () => {
  useEffect(() => {
    const result = getScrollbarWidth();
    console.log(result);
  }, []);

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
            margin-bottom: 50px;
          }

          .hidden-cover {
            position: fixed;
            top: 0;
            left: 15px;
            right: 15px;
            height: 15px;
            background: var(--blue-main);
            z-index: 80;
          }
          .hide-shadow {
            position: absolute;
            top: 0;
            right: -10px;
            display: none;
            width: 10px;
            height: 70px;
            background: var(--blue-main);
          }

          @media (min-width: 768px) {
            .hidden-cover {
              left: 50px;
              right: 50px;
            }
          }

          @media (min-width: 1300px) {
            main {
              box-shadow: 0px 10px 0 #00000054;
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
