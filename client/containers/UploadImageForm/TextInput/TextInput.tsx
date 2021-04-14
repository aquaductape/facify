import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMatchMedia } from "../../../hooks/useMatchMedia";
import { RootState } from "../../../store/rootReducer";
import store from "../../../store/store";
import { convertFileToBase64 } from "../../../utils/convertFileToBase64";
import dataURLtoFile from "../../../utils/dataURLtoFile";
import { getBase64FromUrl } from "../../../utils/getBase64FromUrl";
import { getImageNameFromUrl } from "../../../utils/getImageNameFromUrl";
import { TDemographicNode } from "../../FaceDetectionResult/ImageResult/demographicsSlice";
import { clearAllFormValues, TURLItem } from "../formSlice";
import { setCurrentAddedImage, setCurrentImageStatus } from "../imageUrlSlice";
import {
  getImageDimensions,
  postClarifaiAPI,
  addImageAndAnimate,
} from "../upload";
import Input from "./InputBox";

type TSubmitBtnProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  isOpenRef: React.MutableRefObject<boolean>;
  displayErrorRef: React.MutableRefObject<boolean>;
};
const SubmitBtn = ({
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,

  isOpenRef,
  displayErrorRef,
}: TSubmitBtnProps) => {
  const urlItems = useSelector((state: RootState) => state.form.urlItems);

  const onSubmitClick = () => {
    if (!isOpenRef.current && !urlItems.length) {
      // display red error border and shake input
      const submitBoxEl = document.getElementById("submit-box")!;
      const inputEl = submitBoxEl.querySelector("input")!;

      submitBoxEl.classList.add("submitError");
      inputEl.classList.add("submitError");
      displayErrorRef.current = true;
      inputEl.placeholder = "Past URL *";
      inputEl.style.animation = "Shake ease-in 150ms 2";

      window.clearTimeout(clearDisplayErrorTimeout);
      clearDisplayErrorTimeout = window.setTimeout(() => {
        displayErrorRef.current = false;
        inputEl.placeholder = "Past URL ...";
        submitBoxEl.classList.remove("submitError");
        inputEl.classList.remove("submitError");
        inputEl.style.animation = "";
        // remove
      }, 2000);
      return;
    }
  };
  return (
    <button
      id="detect-button"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onSubmitClick}
      className="detect-button"
      type="submit"
    >
      Detect
      <style jsx>
        {`
          .detect-button {
            position: relative;
            border: none;
            padding: 10px 20px;
            color: #fff;
            position: relative;
            background: #000066;
            font-size: 18px;
            cursor: pointer;
            transition: 250ms background-color, 250ms color;
            z-index: 15;
          }

          .detect-button:hover {
            color: #ffffff;
            background: #000000;
          }

          .detect-button:focus {
            outline: none;
          }

          .detect-button.focus-visible {
            color: #ffffff;
            background: #000000;
            outline: 3px solid #000;
            outline-offset: 2px;
          }
        `}
      </style>
    </button>
  );
};

let clearDisplayErrorTimeout = 0;

type TFormTextInput = {
  setOpenLoader: React.Dispatch<React.SetStateAction<boolean>>;
};
const TextInput = React.memo(({ setOpenLoader }: TFormTextInput) => {
  const dispatch = useDispatch();
  const imageLoaded = useSelector(
    (state: RootState) => state.imageUrl.imageLoaded
  );
  const formInputResult = useSelector(
    (state: RootState) => state.form.inputResult
  );
  const [error, setError] = useState(false);
  const isOpenRef = useRef(false);
  const displayErrorRef = useRef(false);
  const submitHoverRef = useRef(false);

  const mqlRef = useMatchMedia();

  const onSubmitForm = async (urlItem: TURLItem) => {
    let urlContent = urlItem.content;

    dispatch(setCurrentImageStatus("EMPTY"));

    dispatch(
      setCurrentAddedImage({
        set: {
          id: urlItem.id,
          name: urlItem.name,
          error: urlItem.error,
          errorMsg: urlItem.errorMsg,
        },
      })
    );

    if (urlItem.error) {
      dispatch(setCurrentImageStatus("DONE"));
      return;
    }

    let { base64, sizeMB, error } = await getBase64FromUrl({
      url: urlContent,
      proxy: "/api/convert-base64",
    });

    if (error) {
      console.log("base64", { error });
      dispatch(setCurrentImageStatus("DONE"));
      dispatch(setCurrentAddedImage({ updateError: error }));
      return;
    }

    console.log({ sizeMB });

    const name = getImageNameFromUrl(urlItem.content);

    if (sizeMB != null && sizeMB > 3.5) {
      dispatch(setCurrentImageStatus("COMPRESSING"));
      const result = await convertFileToBase64(dataURLtoFile(base64));
      base64 = result.base64;
      urlContent = window.URL.createObjectURL(result.file);
    }

    dispatch(setCurrentImageStatus("SCANNING"));

    const result = await postClarifaiAPI({ base64 });

    if (
      result.status.code !== 10000 && // OK
      result.status.code !== 10010 // Mixed Success
    ) {
      const errorMsg = `Server Error. ${result.status.message}`;
      dispatch(setCurrentImageStatus("DONE"));
      dispatch(setCurrentAddedImage({ updateError: errorMsg }));
      return;
    }

    const data = (result.data as unknown) as TDemographicNode[];
    const img = await getImageDimensions(urlContent);

    await addImageAndAnimate({
      id: urlItem.id,
      croppedUrl: base64,
      url: urlContent,
      data,
      img,
      name,
      dispatch,
      imageLoaded,
      mql: mqlRef.current!,
    });
  };

  const onSubmitBtnMouseEvents = (isMouseenter: boolean) => {
    if (displayErrorRef.current) isMouseenter = false;

    if (submitHoverRef.current === isMouseenter) return;
    submitHoverRef.current = isMouseenter;

    const submitBoxEl = document.getElementById("submit-box")!;

    if (isMouseenter) {
      submitBoxEl.classList.add("submitHover");
    } else {
      submitBoxEl.classList.remove("submitHover");
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(e.target);
  };

  useEffect(() => {
    if (!formInputResult.length || !store.getState().form.urlItems.length)
      return;
    setOpenLoader(true);

    const run = async () => {
      // const values = formInputResult.map(({ content }) => content);

      for (const item of formInputResult) {
        await onSubmitForm(item);
      }
    };

    run();
  }, [formInputResult.length]);

  return (
    <form id="url-input-form" onSubmit={onSubmit} aria-label="Paste Image URL">
      <Input
        submitHoverRef={submitHoverRef}
        isOpenRef={isOpenRef}
        displayErrorRef={displayErrorRef}
      ></Input>
      <SubmitBtn
        onFocus={() => onSubmitBtnMouseEvents(true)}
        onMouseEnter={() => onSubmitBtnMouseEvents(true)}
        onBlur={() => onSubmitBtnMouseEvents(false)}
        onMouseLeave={() => onSubmitBtnMouseEvents(false)}
        displayErrorRef={displayErrorRef}
        isOpenRef={isOpenRef}
      ></SubmitBtn>
      <style jsx>
        {`
          form {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        `}
      </style>
    </form>
  );
});

export default TextInput;
