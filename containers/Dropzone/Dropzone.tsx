import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { batch, useDispatch, useSelector } from "react-redux";
import { CONSTANTS } from "../../constants";
import { useMatchMedia } from "../../hooks/useMatchMedia";
import { RootState } from "../../store/rootReducer";
import { JSON_Stringify_Parse } from "../../utils/jsonStringifyParse";
import { onFileUpload } from "../UploadImageForm/FileInput/utils/onFileUpload";
import {
  addInputResult,
  setSubmit,
  TURLItem,
} from "../UploadImageForm/formSlice";
import { setImgQueue, TImgQueue } from "../UploadImageForm/imageUrlSlice";
import { setOpenLoader } from "../UploadImageForm/Loader/loaderSlice";

const Dropzone = () => {
  const dispatch = useDispatch();
  const formSubmit = useSelector((state: RootState) => state.form.submit);
  const imageLoaded = useSelector(
    (state: RootState) => state.imageUrl.imageLoaded
  );
  const [imgFiles, setImgFiles] = useState<(TURLItem & { file: File })[]>([]);
  const mqlRef = useMatchMedia();

  const onDrop = useCallback((files: File[]) => {
    const imageTypes = CONSTANTS.supportedImgFormats.map(
      (img) => `image/${img}`
    );

    const imageFiles = files.filter((file) => imageTypes.includes(file.type));

    const inputResult: (TURLItem & { file: File })[] = [];

    imageFiles.forEach((file) => {
      inputResult.push({
        id: nanoid(),
        name: file.name,
        content: "",
        error: false,
        errorMsg: "",
        file,
      });
    });

    batch(() => {
      dispatch(
        addInputResult(
          inputResult.map((item) => {
            const result = { ...item };
            // @ts-ignore
            delete result.file;
            return result as TURLItem;
          })
        )
      );
      dispatch(setSubmit({ active: true, from: "dragAndDrop" }));
      dispatch(
        setImgQueue(
          inputResult.map(
            (item) =>
              ({
                id: item.id,
                content: item.content,
                error: item.error,
                errorMsg: item.errorMsg,
                name: item.name,
                countdown: true,
                countdownActive: false,
                currentImgStatus: item.error ? "DONE" : "EMPTY",
                inQueue: true,
              } as TImgQueue)
          )
        )
      );
    });

    setImgFiles(inputResult);
  }, []);

  useEffect(() => {
    if (!formSubmit.active || formSubmit.from !== "dragAndDrop") return;
    if (!imgFiles.length) return;
    console.log({ imgFiles });

    dispatch(setSubmit({ active: false, from: null }));
    dispatch(setOpenLoader(true));

    const run = async () => {
      for (let i = 0; i < imgFiles.length; i++) {
        const item = imgFiles[i];
        await onFileUpload({ item, idx: i, dispatch, imageLoaded, mqlRef });
      }
    };

    run();

    setImgFiles([]);
  }, [formSubmit, imgFiles]);

  const {
    getRootProps,
    isDragActive,

    rootRef,
  } = useDropzone({ onDrop });

  useEffect(() => {
    console.log({ isDragActive });
  }, [isDragActive]);

  useEffect(() => {
    /* lastTarget is set first on dragenter, then
   compared with during dragleave. */
    let lastTarget: EventTarget;

    const dropZoneEl = rootRef.current!;

    window.addEventListener("dragenter", function (e) {
      lastTarget = e.target!; // cache the last target here
      // unhide our dropzone overlay
      dropZoneEl.style.display = "block";

      const onDrop = () => {
        dropZoneEl.style.display = "";
        window.removeEventListener("drop", onDrop);
      };
      window.addEventListener("drop", onDrop);
    });

    window.addEventListener("dragleave", function (e) {
      // this is the magic part. when leaving the window,
      // e.target happens to be exactly what we want: what we cached
      // at the start, the dropzone we dragged into.
      // so..if dragleave target matches our cache, we hide the dropzone.
      // `e.target === document` is a workaround for Firefox 57
      if (e.target === lastTarget || e.target === document) {
        dropZoneEl.style.display = "";
      }
    });
  }, []);

  return (
    <div className="container" {...getRootProps()}>
      <div className="dropzone">
        <span>Image Dropzone</span>
      </div>
      <style jsx>
        {`
          .container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 10px;
            border: 6px dashed #000;
            display: none;
            z-index: 999;
          }

          .dropzone {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 50px;
            color: #fff;
            height: calc(100% - 40px);
            margin: 20px;
            background: rgba(0, 0, 0, 0.7);
          }
        `}
      </style>
    </div>
  );
};

export default Dropzone;
