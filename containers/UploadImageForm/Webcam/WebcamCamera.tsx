import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CloseBtn from "../../../components/svg/CloseBtn";
import { useMatchMedia } from "../../../hooks/useMatchMedia";
import { RootState } from "../../../store/rootReducer";
import store from "../../../store/store";
import { delayP } from "../../../utils/delayP";
import { getFileFromCanvasBlob } from "../../../utils/getFileFromCanvasBlob";
import { JSON_Stringify_Parse } from "../../../utils/jsonStringifyParse";
import { reflow } from "../../../utils/reflow";
import { onFileUpload } from "../FileInput/utils/onFileUpload";
import { addInputResult, clearAllFormValues, TURLItem } from "../formSlice";
import { setImgQueue } from "../imageUrlSlice";
import { setOpenLoader } from "../Loader/loaderSlice";
import WebcamForm from "./WebcamForm";

type TWebcamProps = {
  setShowCamera: React.Dispatch<React.SetStateAction<boolean>>;
};

const WebcamCamera = ({ setShowCamera }: TWebcamProps) => {
  const dispatch = useDispatch();
  const imageLoaded = useSelector(
    (state: RootState) => state.imageUrl.imageLoaded
  );
  const mqlRef = useMatchMedia();
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const [allowStream, setAllowStream] = useState(true);

  const onClickBtnClose = () => {
    setShowCamera(false);
    //           const inputResult = store.getState().form.inputResult;
    //       inputResult.forEach((input) => {
    //         window.URL.revokeObjectURL(input.content);
    //       });
    //
    //       dispatch(clearAllFormValues());
  };

  const onClickCapture = async () => {
    const id = nanoid();
    const date = new Date();
    const name = `Facify_${date.toLocaleTimeString().replace(/\s/g, "_")}_${date
      .toDateString()
      .replace(/\s/g, "_")}`;
    const videoEl = videoElRef.current!;
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    reflow();
    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    const file = await getFileFromCanvasBlob({ canvas, name });
    const urlItem = {
      id,
      name,
      file,
      content: "",
      error: false,
      errorMsg: "",
    } as TURLItem & { file: File };

    dispatch(addInputResult(JSON_Stringify_Parse(urlItem)));

    dispatch(
      setImgQueue([
        {
          id,
          name,
          countdown: true,
          countdownActive: false,
          currentImgStatus: "EMPTY",
          error: false,
          errorMsg: "",
          errorTitle: "",
          inQueue: true,
        },
      ])
    );

    setShowCamera(false);

    await delayP(100);

    dispatch(setOpenLoader(true));

    onFileUpload({ item: urlItem, idx: 0, dispatch, imageLoaded, mqlRef });
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
      <div className="controls">
        {allowStream ? (
          <div className="capture-container">
            <button
              className="capture"
              onClick={onClickCapture}
              aria-label={"Capture photo with webcam and Submit it"}
            >
              <div className="capture-border"></div>
              <div className="capture-inner"></div>
            </button>
          </div>
        ) : null}
      </div>
      <style jsx>
        {`
          .capture-container {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }

          .form {
            margin-left: auto;
            width: calc(50% - 65px);
            height: 100%;
          }

          .capture {
            position: relative;
            width: 65px;
            height: 65px;
            pointer-events: all;
            background: none;
            border: none;
            -webkit-tap-highlight-color: transparent;
          }

          .capture-border {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #ddd;
            border-radius: 100%;
          }

          .capture-inner {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #bbb;
            border-radius: 100%;
            transform: scale(0.8);
            transition: transform 250ms, background-color 250ms;
          }

          .controls {
            position: relative;
            height: 100%;
          }

          .container {
            display: flex;
            flex-direction: column;
            background: #fff;
            height: 500px;
            margin-bottom: 15px;
            box-shadow: 0 15px 12px -15px #0000008a;
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
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #000;
            height: 350px;
          }

          video {
            height: 100%;
          }

          @media not all and (pointer: coarse) {
            .capture-inner:hover {
              transform: scale(0.9);
              background: #aaa;
            }
          }
        `}
      </style>
    </div>
  );
};

export default WebcamCamera;
