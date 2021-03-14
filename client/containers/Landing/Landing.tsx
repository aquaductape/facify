import { useSelector } from "react-redux";
import LandingPageImgExample from "../../components/Logo/svg/LandingPageImgExample";
import LogoIcon from "../../components/Logo/svg/LogoIcon";
import { RootState } from "../../store/rootReducer";

const Landing = () => {
  const imageLoaded = useSelector(
    (state: RootState) => state.imageUrl.imageLoaded
  );

  if (imageLoaded) {
    return null;
  }

  return (
    <div className="container">
      <section>
        <div className="info">
          <div className="header-title">
            <div className="header-title--logo" title="Facify">
              <LogoIcon></LogoIcon>
            </div>
            <h1>
              Find <span className="header-title-subtext">Faces</span>
            </h1>
          </div>
          {/* <div className="header-image" title="human face vector art">
        <FaceDetect></FaceDetect>
      </div> */}
          <p className="info">
            Detects not only just faces, it approximates age, gender and
            multicultural appearance.
          </p>
          <div className="list">
            <p className="list-title">Upload Image by:</p>
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
      </section>
      <style jsx>
        {`
          .container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            background: #fff;
          }

          section {
            padding: 25px;
          }

          .header-title-subtext {
            color: var(--blue-main);
          }

          .header-title {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 30px;
          }

          .landing-img {
            width: calc(100% + 25px);
            margin-left: -12.5px;
          }

          .header-title--logo {
            width: 75px;
            height: 75px;
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
            .landing-img {
              width: 100%;
              max-width: 700px;
              margin: 0 auto;
            }

            section {
              font-size: 20px;
            }
          }

          @media (min-width: 1000px) {
            section {
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
            section {
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
            section {
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
