import { useSelector } from "react-redux";
import FaceDetect from "../../components/Logo/svg/FaceDetect";
import LandingPageImgExample from "../../components/Logo/svg/LandingPageImgExample";
import LogoIcon from "../../components/Logo/svg/LogoIcon";
import { RootState } from "../../store/rootReducer";

// Upload an image and we'll detect not only just faces, but show age, gender and multicultural appearance approximation.
// Detect not only just faces, but show age, gender and multicultural appearance approximation.

// Upload image by:
//  drag&drop files (up to 5 at time)
//  url
//  webcam
// Image size over 3.5 MB will be compressed
const Landing = () => {
  const imageLoaded = useSelector(
    (state: RootState) => state.imageUrl.imageLoaded
  );

  if (imageLoaded) {
    return null;
  }

  return (
    <section>
      <div className="info">
        <div className="header-title">
          <div className="header-title--logo" title="Facify">
            <LogoIcon></LogoIcon>
          </div>
          <h1>
            Find <span>Faces</span>
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
          <p>Upload Image by:</p>
          <ul>
            <li>Drag & Drop Files (up to 5 at time)</li>
            <li>Paste URL</li>
            <li>Capture photo by webcam</li>
          </ul>
        </div>
      </div>
      <div className="hero">
        <div className="landing-img">
          <LandingPageImgExample></LandingPageImgExample>
        </div>
        <p className="image-size-info">
          Image size over 3.5 megabytes will be compressed
        </p>
      </div>
      <style jsx>
        {`
          section {
            padding: 25px;
          }

          .header-title {
            display: flex;
            align-items: center;
            justify-content: center;
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

          .info {
            line-height: 25px;
          }
          .list {
            margin: 30px 0;
          }

          .list p {
            margin: 0;
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
              padding: 50px 20px;
              margin: 0 auto;
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
              min-height: 470px;
            }

            .info {
              align-self: center;
            }
          }
          @media (min-width: 1400px) {
            .hero {
              width: 100%;
              margin-right: -150px;
            }
          }

          @media (min-width: 1900px) {
            .hero {
              margin-right: -320px;
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
    </section>
  );
};

export default Landing;
