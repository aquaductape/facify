import React, { FormEvent, useEffect, useRef, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { useMatchMedia } from "../../../hooks/useMatchMedia";
import { RootState } from "../../../store/rootReducer";
import store from "../../../store/store";
import { convertFileToBase64 } from "../../../utils/convertFileToBase64";
import dataURLtoFile from "../../../utils/dataURLtoFile";
import { delayP } from "../../../utils/delayP";
import { getBase64FromUrl } from "../../../utils/getBase64FromUrl";
import { getImageNameFromUrl } from "../../../utils/getImageNameFromUrl";
import { TDemographicNode } from "../../FaceDetectionResult/ImageResult/demographicsSlice";
import { clearAllFormValues, setSubmit, TURLItem } from "../formSlice";
import { setImgQueue, TImgQueue, updateImgQueue } from "../imageUrlSlice";
import { TQueue } from "../Loader/Loader";
import { setOpenLoader } from "../Loader/loaderSlice";
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
  const dispatch = useDispatch();
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

    // dispatch(setSubmit({ active: true, from: "text" }));
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
          .detect-button[type="submit"] {
            -webkit-appearance: none;
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
            border: none;
            padding: 10px 20px;
            color: #fff;
            background: #000066;
            font-size: 18px;
            cursor: pointer;
            transition: 250ms background-color, 250ms color;
            z-index: 15;
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

          @media not all and (pointer: coarse) {
            .detect-button:hover {
              color: #ffffff;
              background: #000000;
            }
          }
        `}
      </style>
    </button>
  );
};

let clearDisplayErrorTimeout = 0;

type TFormTextInput = {};

const TextInput = React.memo(() => {
  const dispatch = useDispatch();
  const imageLoaded = useSelector(
    (state: RootState) => state.imageUrl.imageLoaded
  );
  const formSubmit = useSelector((state: RootState) => state.form.submit);
  const mobileHoverTimerIdRef = useRef(0);
  const isOpenRef = useRef(false);
  const displayErrorRef = useRef(false);
  const submitHoverRef = useRef(false);

  const mqlRef = useMatchMedia();

  const onSubmitForm = async (urlItem: TURLItem, idx: number) => {
    let urlContent = urlItem.content;

    if (urlItem.error) {
      console.log("errrro");
      return;
    }

    let { base64, sizeMB, error } = await getBase64FromUrl({
      url: urlContent,
      proxy: "/api/convert-base64",
    });

    if (error) {
      dispatch(
        updateImgQueue({
          id: urlItem.id,
          props: { error: true, errorMsg: error, currentImgStatus: "DONE" },
        })
      );
      return;
    }

    const name = getImageNameFromUrl(urlItem.content);

    if (sizeMB != null && sizeMB > 3.5) {
      dispatch(
        updateImgQueue({
          id: urlItem.id,
          props: { currentImgStatus: "COMPRESSING" },
        })
      );
      const result = await convertFileToBase64(dataURLtoFile(base64));
      base64 = result.base64;
      urlContent = window.URL.createObjectURL(result.file);
    }

    dispatch(
      updateImgQueue({
        id: urlItem.id,
        props: { currentImgStatus: "SCANNING" },
      })
    );

    const result = await postClarifaiAPI({ base64, resetOrientation: false });

    if (
      result.status.code !== 10000 && // OK
      result.status.code !== 10010 // Mixed Success
    ) {
      const errorMsg = `Server Error. ${result.status.message}`;
      dispatch(
        updateImgQueue({
          id: urlItem.id,
          props: { error: true, errorMsg, currentImgStatus: "DONE" },
        })
      );
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
      firstImage: !imageLoaded && idx === 0,
      mql: mqlRef.current!,
    });
  };

  const onSubmitBtnMouseEvents = (isMouseenter: boolean) => {
    if (displayErrorRef.current) isMouseenter = false;

    if (submitHoverRef.current === isMouseenter) return;
    submitHoverRef.current = isMouseenter;

    const submitBoxEl = document.getElementById("submit-box")!;
    const isTouchDevice = !matchMedia("not all and (pointer: coarse)").matches;

    if (isTouchDevice && isMouseenter) {
      window.clearTimeout(mobileHoverTimerIdRef.current);

      const timerId = window.setTimeout(() => {
        submitBoxEl.classList.remove("submitHover");
        submitHoverRef.current = true;
      }, 1000);
      mobileHoverTimerIdRef.current = timerId;
    }

    if (isMouseenter) {
      submitBoxEl.classList.add("submitHover");
    } else {
      submitBoxEl.classList.remove("submitHover");
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (!formSubmit.active || formSubmit.from !== "text") return;
    const formInputResult = store.getState().form.inputResult;

    batch(() => {
      dispatch(setSubmit({ active: false, from: null }));
      dispatch(
        setImgQueue(
          formInputResult.map(
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

    const run = async () => {
      await delayP(50);
      dispatch(setOpenLoader(true));

      for (let i = 0; i < formInputResult.length; i++) {
        const item = formInputResult[i];
        await onSubmitForm(item, i);
      }
    };

    run();
  }, [formSubmit]);

  return (
    <form
      id="url-input-form"
      className="form"
      onSubmit={onSubmit}
      aria-label="Paste Image URL"
    >
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
          .form {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        `}
      </style>
    </form>
  );
});

export default TextInput;
