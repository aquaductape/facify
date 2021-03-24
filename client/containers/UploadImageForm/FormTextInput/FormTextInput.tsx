import { nanoid } from "nanoid";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMatchMedia } from "../../../hooks/useMatchMedia";
import { RootState } from "../../../store/rootReducer";
import { convertFileToBase64 } from "../../../utils/convertFileToBase64";
import dataURLtoFile from "../../../utils/dataURLtoFile";
import { getBase64FromUrl } from "../../../utils/getBase64FromUrl";
import { getImageNameFromUrl } from "../../../utils/getImageNameFromUrl";
import { TDemographicNode } from "../../FaceDetectionResult/ImageResult/demographicsSlice";
import { clearAllFormValues } from "../formSlice";
import {
  getImageDimensions,
  postClarifaiAPI,
  uploadAndAnimate,
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
            border: none;
            padding: 10px 20px;
            color: #fff;
            position: relative;
            background: #000066;
            font-size: 1rem;
            cursor: pointer;
            transition: 250ms background-color, 250ms color;
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

const FormTextInput = () => {
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

  const onSubmitForm = async (urlValue: string) => {
    let { base64, sizeMB } = await getBase64FromUrl({
      url: urlValue,
      proxy: "/api/convert-base64",
    });

    console.log({ sizeMB });

    const name = getImageNameFromUrl(urlValue);

    if (sizeMB != null && sizeMB > 3.5) {
      const result = await convertFileToBase64(dataURLtoFile(base64));
      base64 = result.base64;
      urlValue = window.URL.createObjectURL(result.file);
    }

    const result = await postClarifaiAPI({ base64 });
    const data = (result.data as unknown) as TDemographicNode[];
    const img = await getImageDimensions(urlValue);

    await uploadAndAnimate({
      id: nanoid(),
      croppedUrl: base64,
      url: urlValue,
      data,
      img,
      name,
      dispatch,
      imageLoaded,
      mql: mqlRef.current!,
    });

    // setShowLoader(false);
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
    if (!formInputResult.length) return;

    const run = async () => {
      const values = formInputResult.map(({ content }) => content);

      for (const value of values) {
        await onSubmitForm(value);
      }
    };

    run();

    dispatch(clearAllFormValues());
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
};

export default FormTextInput;
