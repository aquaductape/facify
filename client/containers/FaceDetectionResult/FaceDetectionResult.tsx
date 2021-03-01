import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import ImageResult from "./ImageResult/ImageResult";
import InfoResult from "./InfoResult/InfoResult";

const FaceDetectionResult = () => {
  const { error, imageStatus, uri } = useSelector(
    (state: RootState) => state.imageUrl
  );

  if (error) return <div>{error}</div>;
  return (
    <div className="image-panel">
      <ImageResult />
      <InfoResult />
      <style jsx>
        {`
          .image-panel {
          }

          @media (min-width: 1300px) {
            .image-panel {
              display: grid;
              grid-template-columns: 450px 3fr;
            }
          }

          @media (min-width: 1500px) {
            .image-panel {
              display: grid;
              grid-template-columns: 650px 1fr;
            }
          }
        `}
      </style>
    </div>
  );
};

export default FaceDetectionResult;
