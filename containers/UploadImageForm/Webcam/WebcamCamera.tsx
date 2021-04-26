import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import CloseBtn from "../../../components/svg/CloseBtn";
import { addInputResult } from "../formSlice";
import { setImgQueue } from "../imageUrlSlice";

type TWebcamProps = {
  setOpenLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCamera: React.Dispatch<React.SetStateAction<boolean>>;
};
const WebcamCamera = ({ setOpenLoader, setShowCamera }: TWebcamProps) => {
  const dispatch = useDispatch();
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const [allowStream, setAllowStream] = useState(true);

  const onClickBtnClose = () => {
    setShowCamera(false);
  };

  const onClickCapture = () => {
    const videoEl = videoElRef.current!;
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(videoEl, 0, 0, videoEl.clientWidth, videoEl.clientHeight);
    const dataUrl = canvas.toDataURL("image/jpeg", 1.0);

    dispatch(
      addInputResult({
        id: nanoid(),
        name: `photo-from-webcam-${Date.now()}`,
        content: dataUrl,
        error: false,
        errorMsg: "",
      })
    );
  };

  useEffect(() => {
    let stream: MediaStream;
    const constraints = {
      video: true,
    };

    const run = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElRef.current!.srcObject = stream;
        setAllowStream(true);
      } catch (err) {
        setAllowStream(false);
      }
    };

    run();

    return () => {
      if (!stream) return;
      stream.getVideoTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="container">
      <div className="bar">
        <button className="btn-close-webcam" onClick={onClickBtnClose}>
          <CloseBtn></CloseBtn>
        </button>
      </div>
      <div className="video-container">
        {allowStream ? (
          <video ref={videoElRef} autoPlay />
        ) : (
          <div className="blocked-msg">
            Camera Access is blocked on this Page. To use Camera, you must
            enable it on your Browser settings
          </div>
        )}
      </div>
      <button className="capture" onClick={onClickCapture}></button>
      <style jsx>
        {`
          .container {
            background: #fff;
            height: 500px;
          }

          .bar {
            background: #000;
            height: 45px;
          }

          .blocked-msg {
            padding: 0 60px;
            color: #fff;
          }

          .btn-close-webcam {
            display: block;
            width: 45px;
            margin-right: auto;
            background: #000;
            border: none;
            color: #ccc;
            padding: 10px;
            transition: color 250ms;
          }

          .btn-close-webcam:hover {
            color: #fff;
          }

          .video-container {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #000;
            height: 300px;
          }

          video {
            height: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default WebcamCamera;
