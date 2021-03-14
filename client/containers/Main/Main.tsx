import React, { useEffect } from "react";
import LogoText from "../../components/Logo/LogoText";
import { appHeight } from "../../constants";
import getScrollbarWidth from "../../utils/getScrollWidth";
import FaceDetectionResult from "../FaceDetectionResult/FaceDetectionResult";
import Footer from "../Footer/Footer";
import Landing from "../Landing/Landing";
import UploadImageForm from "../UploadImageForm/UploadImageForm";

const Main = () => {
  useEffect(() => {
    const result = getScrollbarWidth();
    console.log(result);
  }, []);

  return (
    <>
      <div className="app-bg"></div>
      <div className="hidden-cover">
        <div className="hide-shadow"></div>
      </div>
      <LogoText></LogoText>
      <UploadImageForm></UploadImageForm>
      <main id="main">
        <div className="main-bg"></div>
        <div className="main-inner">
          <FaceDetectionResult></FaceDetectionResult>
          <Landing></Landing>
        </div>
      </main>
      <Footer></Footer>
      <style jsx>
        {`
          main {
            position: relative;
            counter-reset: demographic-counter;
          }

          .main-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #fff;
          }

          .main-inner {
            position: relative;
            z-index: 1;
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
