import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TransitionSlide from "../../../components/TransitionSlide";
import { useMatchMedia } from "../../../hooks/useMatchMedia";
import { RootState } from "../../../store/rootReducer";
import { TURLItem } from "../formSlice";
import WebcamCamera from "./WebcamCamera";

type TWebcamProps = {
  setOpenLoader: React.Dispatch<React.SetStateAction<boolean>>;
};
const WebcamBtn = ({ setOpenLoader }: TWebcamProps) => {
  const dispatch = useDispatch();
  const formSubmit = useSelector((state: RootState) => state.form.submit);
  const imageLoaded = useSelector(
    (state: RootState) => state.imageUrl.imageLoaded
  );
  const mqlRef = useMatchMedia();
  const [fileItems, setFileItems] = useState<(TURLItem & { file: File })[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const onClick = () => setShowCamera(true);

  return (
    <div className="container">
      <div className="camera">
        <TransitionSlide
          in={showCamera}
          slideTo={"down"}
          positionAbsolute={false}
        >
          <WebcamCamera
            setOpenLoader={setOpenLoader}
            setShowCamera={setShowCamera}
          ></WebcamCamera>
        </TransitionSlide>
      </div>
      <button className="input-button--webcam" onClick={onClick}>
        WebCam
      </button>
      <style jsx>
        {`
          .container {
            display: none;
            width: 100%;
            height: 100%;
          }

          .camera {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 20;
          }

          .input-button--webcam {
            width: 100%;
            height: 100%;
            border: none;
            padding: 10px 20px;
            background: #fff;
            font-size: 18px;
            cursor: pointer;
            transition: 250ms background-color, 250ms color;
          }

          .input-button--webcam:focus {
            outline: none;
          }

          .input-button--webcam.focus-visible {
            background: #c6c6c6;
            color: #000;
            outline: 3px solid #000;
            outline-offset: 2px;
          }

          @media not all and (pointer: coarse) {
            .input-button--webcam:hover {
              background: #c6c6c6;
              color: #000;
            }
          }

          @media (min-width: 800px) {
            .container {
              display: block;
            }
          }
        `}
      </style>
    </div>
  );
};

export default WebcamBtn;
