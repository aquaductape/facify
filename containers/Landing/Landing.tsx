import { useSelector } from "react-redux";
import Logo from "../../components/svg/Logo";
import { RootState } from "../../store/rootReducer";
import LandingPageImgExample from "./LandingPageImgExample";

const Landing = () => {
  //   const imageLoaded = useSelector(
  //     (state: RootState) => state.imageUrl.imageLoaded
  //   );
  //
  //   if (imageLoaded) {
  //     return null;
  //   }

  return (
    <div id="landing" className="container">
      <div className="inner">
        <div className="info">
          <div className="header-title">
            <div className="header-title--logo" title="Facify">
              <Logo></Logo>
            </div>
            <h1>
              Find <span className="header-title-subtext">Faces</span>
            </h1>
          </div>
          <p className="info">
            Detects not only just faces, it approximates age, gender and
            multicultural appearance.
          </p>
          <div className="list">
            <p className="list-title">Upload Image(s) by:</p>
            <ul>
              <li>Drag & Drop Files (up to 5 at time)</li>
              <li>Paste URL</li>
              <li>Capture photo by webcam</li>
            </ul>
          </div>
          <p className="image-size-info desktop">
            Image size over 3.5 megabytes will be compressed
          </p>
        </div>
        <div className="hero">
          <div className="landing-img">
            <LandingPageImgExample></LandingPageImgExample>
          </div>
          <p className="image-size-info mobile">
            Image size over 3.5 megabytes will be compressed
          </p>
        </div>
      </div>

      <style jsx>
        {`
          .container {
            background: #fff;
          }

          .inner {
            padding: 25px;
          }

          .header-title-subtext {
            display: block;
            color: var(--blue-main);
          }

          .header-title {
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 30px;
            margin-top: 15px;
            margin-bottom: 30px;
          }

          .landing-img {
            width: calc(100% + 25px);
            margin-left: -12.5px;
          }

          .header-title--logo {
            width: 75px;
            height: 75px;
            background: var(--blue-main);
            filter: drop-shadow(4px 4px 0px #000066);
          }

          h1 {
            margin-left: 25px;
          }

          .image-size-info {
            font-size: 16px;
            color: #333;
            text-align: center;
          }

          .image-size-info.desktop {
            display: none;
          }

          .image-size-info.mobile {
            display: block;
          }

          .info {
            line-height: 25px;
          }

          .list {
            margin: 30px 0;
          }

          .list-title {
            margin: 0;
            margin-bottom: -10px;
          }

          li {
            list-style-type: square;
          }

          @media (min-width: 420px) {
            .header-title-subtext {
              display: inline;
            }

            .header-title {
              line-height: unset;
              margin-top: 30px;
              margin-bottom: 30px;
            }

            .landing-img {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
            }

            .inner {
              font-size: 20px;
            }
          }

          @media (min-width: 1000px) {
            .landing-img {
              max-width: 700px;
            }

            .inner {
              display: flex;
              align-items: center;
              max-width: 1000px;
              padding: 50px;
              margin: 0 auto;
            }

            .image-size-info.desktop {
              display: block;
              text-align: left;
            }

            .image-size-info.mobile {
              display: none;
            }

            .info {
              align-self: flex-start;
              width: 80%;
            }

            .hero {
              width: 80%;
            }

            .header-title {
              justify-content: flex-start;
              margin-bottom: 50px;
            }

            .header-title--logo {
              width: 100px;
              height: 100px;
            }
          }

          @media (min-width: 1300px) {
            .inner {
              height: 70vh;
              max-height: 800px;
              min-height: 550px;
            }

            .info {
              align-self: center;
            }

            .info {
              width: 90%;
            }
          }

          @media (min-width: 1400px) {
            .hero {
              width: 100%;
              margin-right: -180px;
            }
          }

          @media (min-width: 1900px) and (min-height: 850px) {
            .inner {
              max-width: 1200px;
            }

            .info {
              width: 80%;
            }

            .hero {
              margin-right: -310px;
            }

            .landing-img {
              height: 500px;
              width: 900px;
              transform: scale(1.1);
            }

            .landing-img svg {
              width: auto;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Landing;
