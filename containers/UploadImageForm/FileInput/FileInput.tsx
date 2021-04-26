import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { useMatchMedia } from "../../../hooks/useMatchMedia";
import { RootState } from "../../../store/rootReducer";
import { convertFileToBase64 } from "../../../utils/convertFileToBase64";
import { JSON_Stringify_Parse } from "../../../utils/jsonStringifyParse";
import { TDemographicNode } from "../../FaceDetectionResult/ImageResult/demographicsSlice";
import {
  addInputResult,
  setInputResultFromUrlItems,
  setSubmit,
  TURLItem,
} from "../formSlice";
import {
  setCurrentImageStatus,
  setImgQueue,
  updateImgQueue,
} from "../imageUrlSlice";
import { TQueue } from "../Loader/Loader";
import {
  addImageAndAnimate,
  getImageDimensions,
  postClarifaiAPI,
} from "../upload";

type TFileInputProps = {
  setOpenLoader: React.Dispatch<React.SetStateAction<boolean>>;
};
const FileInput = ({ setOpenLoader }: TFileInputProps) => {
  const dispatch = useDispatch();
  const formSubmit = useSelector((state: RootState) => state.form.submit);
  const imageLoaded = useSelector(
    (state: RootState) => state.imageUrl.imageLoaded
  );
  const mqlRef = useMatchMedia();
  const [fileItems, setFileItems] = useState<(TURLItem & { file: File })[]>([]);

  const onFileUpload = async (item: { file: File } & TURLItem, idx: number) => {
    dispatch(setCurrentImageStatus("EMPTY"));

    const maxSizeMB = 3.5;
    const kbRatio = 1_000_000;

    if (item.file.size > maxSizeMB * kbRatio) {
      dispatch(setCurrentImageStatus("COMPRESSING"));
    }
    const { base64, file: newFile } = await convertFileToBase64(item.file);
    dispatch(setCurrentImageStatus("SCANNING"));

    const result = await postClarifaiAPI({ base64, inputFrom: "file" });

    if (
      result.status.code !== 10000 && // OK
      result.status.code !== 10010 // Mixed Success
    ) {
      const errorMsg = `Server Error. ${result.status.message}`;
      dispatch(setCurrentImageStatus("DONE"));
      dispatch(
        updateImgQueue({
          id: item.id,
          props: { error: true, errorMsg, currentImgStatus: "DONE" },
        })
      );
      return;
    }

    const objectUrl = window.URL.createObjectURL(newFile);
    const img = await getImageDimensions(objectUrl);
    const data = (result.data as unknown) as TDemographicNode[];
    const mql = mqlRef.current!;

    await addImageAndAnimate({
      id: item.id,
      croppedUrl: base64,
      url: objectUrl,
      data,
      img,
      name: item.name,
      dispatch,
      firstImage: !imageLoaded && idx === 0,
      mql,
    });
  };

  const onFilesInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from((e.target.files as unknown) as File[]);
    if (!files) return;
    if (files!.length > 10) {
      // throw notification error: "cannot upload more than 10 images"
      return;
    }

    const inputResult: (TURLItem & { file: File })[] = [];

    files.forEach((file) => {
      (inputResult as TURLItem[]).push({
        id: nanoid(),
        name: file.name,
        content: "",
        error: false,
        errorMsg: "",
      });
    });

    for (let i = 0; i < inputResult.length; i++) {
      const item = inputResult[i];
      item.file = files[i];
    }

    batch(() => {
      dispatch(addInputResult(JSON_Stringify_Parse(inputResult)));
      dispatch(setSubmit({ active: true, from: "file" }));
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
              } as TQueue)
          )
        )
      );
    });
    setFileItems(inputResult);
  };

  useEffect(() => {
    if (!formSubmit.active || formSubmit.from !== "file") return;
    console.log(formSubmit);
    dispatch(setSubmit({ active: false, from: null }));

    setOpenLoader(true);

    const run = async () => {
      for (let i = 0; i < fileItems.length; i++) {
        const item = fileItems[i];
        await onFileUpload(item, i);
      }
    };

    run();

    setFileItems([]);
  }, [formSubmit, fileItems.length]);

  return (
    <>
      <input
        onChange={onFilesInput}
        type="file"
        name="file"
        accept="image/png, image/jpeg"
        id="upload-image-form-file"
        className="input-file--hidden"
      />
      <label className="label-input-file" htmlFor="upload-image-form-file">
        Upload
      </label>
      <style jsx>{`
        .input-file--hidden {
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
        }

        .label-input-file {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 250ms background-color, 250ms color;
        }

        .input-file--hidden.focus-visible + .label-input-file {
          background: #c6c6c6;
          color: #000;
        }

        .input-file--hidden:focus + .label-input-file {
          outline: none;
        }

        .input-file--hidden.focus-visible + .label-input-file {
          outline: 3px solid #000;
          outline-offset: 2px;
          z-index: 1;
        }

        @media not all and (pointer: coarse) {
          .label-input-file:hover {
            background: #c6c6c6;
            color: #000;
          }
        }
      `}</style>
    </>
  );
};

export default FileInput;
