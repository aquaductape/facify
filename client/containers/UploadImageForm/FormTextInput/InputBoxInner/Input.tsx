import { nanoid } from "nanoid";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import onFocusOut, {
  OnFocusOutEvent,
} from "../../../../lib/onFocusOut/onFocusOut";
import { RootState } from "../../../../store/rootReducer";
import { reflow } from "../../../../utils/reflow";
import { addUrlItem, setInputValueFromUrlItems } from "../../formSlice";

type TInputProps = {
  isOpenRef: React.MutableRefObject<boolean>;
  displayErrorRef: React.MutableRefObject<boolean>;
  contentElRef: React.MutableRefObject<HTMLDivElement | null>;
  containerElRef: React.MutableRefObject<HTMLDivElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imgError: boolean;
  setImgUrl: React.Dispatch<React.SetStateAction<string>>;
};

let submitBtnActivated = false;
const Input = ({
  isOpenRef,
  displayErrorRef,
  contentElRef,
  containerElRef,
  imgError,
  onChange,
  setImgUrl,
}: TInputProps) => {
  const dispatch = useDispatch();
  const urlItems = useSelector((state: RootState) => state.form.urlItems);

  const contentElHeightRef = useRef(100);
  const inputElRef = useRef<HTMLInputElement>(null);
  const inputFormElRef = useRef<HTMLElement | null>(null);
  const parentMainBarInputElRef = useRef<HTMLElement | null>(null);
  const onFocusOutStartRef = useRef<((e: OnFocusOutEvent) => boolean) | null>(
    null
  );
  const onCloseInputRef = useRef<(() => void) | null>(null);

  const onCloseInputEnd = () => {
    const inputEl = inputElRef.current!;
    const value = inputEl.value.trim();
    // reset
    inputEl.value = "";
    console.log({ imgError });

    if (value) {
      dispatch(addUrlItem({ id: nanoid(), content: value, error: imgError }));
    }
  };

  const urlItemsValid = () => urlItems.every((item) => !item.error);

  const submitValuesValid = () => {
    const value = inputElRef.current!.value.trim();

    // emtpy
    if (!value && !urlItems.length) {
      // display "Cannot submit empty value"
      // setDisplayTextResult("Cannot submit empty value")
      return false;
    }

    // one of the url items are invalid
    if (!urlItemsValid()) {
      return false;
    }

    // there's a value but it is invalid
    if (value && imgError) {
      return false;
    }

    return true;
  };

  const onSubmit = () => {
    const inputEl = inputElRef.current!;
    const value = inputEl.value.trim();
    // reset
    inputEl.value = "";
    console.log({ urlItems, value });

    contentElHeightRef.current = 100;

    if (value) {
      dispatch(addUrlItem({ id: nanoid(), content: value, error: false }));
    }

    if (submitBtnActivated) {
      setTimeout(() => {
        dispatch(setInputValueFromUrlItems());
      }, 100);
    }
  };

  const onFocusOutStart = (e: OnFocusOutEvent) => {
    const submitBtnEl = document.getElementById("detect-button")!;
    const target = e!.event.target;

    if (submitBtnEl === target) {
      if (!submitValuesValid()) {
        return true;
      }
      submitBtnActivated = true;
    }

    return false;
  };

  const onCloseEnd = () => {
    // submitBtnActivated
    setImgUrl("");
    if (submitBtnActivated) {
      onSubmit();
    } else {
      onCloseInputEnd();
    }

    submitBtnActivated = false;
  };

  const onOpenInput = () => {
    if (isOpenRef.current) {
      return;
    }
    isOpenRef.current = true;

    const closeBtnEl = contentElRef.current!.querySelector(
      ".close-btn"
    ) as HTMLElement;

    const run = () => {
      const contentEl = contentElRef.current!;
      const contentBarEl = contentEl.querySelector(".bar") as HTMLElement;
      const inputBoxInnerEl = inputFormElRef.current!.querySelector(
        ".input-box-inner"
      ) as HTMLElement;
      const titleEl = contentBarEl.querySelector(".title") as HTMLElement;
      const formWidth = inputFormElRef.current!.clientWidth;
      const inputEl = inputElRef.current!;
      const parentMainBarWidth = parentMainBarInputElRef.current!.clientWidth;
      const borderColumnWidth = 5;

      containerElRef.current!.classList.add("active");
      inputBoxInnerEl.classList.add("active");
      inputEl.classList.add("active");

      contentEl.style.width = `${formWidth + borderColumnWidth}px`;
      contentEl.style.minHeight = "unset";
      contentBarEl.style.height = "35px";
      titleEl.style.opacity = "0";
      inputEl.focus();

      reflow();

      inputEl.style.transition = "left 50ms 50ms linear";
      contentBarEl.style.transition = "height 50ms 50ms linear";
      contentEl.style.transition = "height 100ms linear, width 100ms linear";
      titleEl.style.transition = "opacity 100ms 50ms linear";

      inputEl.style.left = "40px";
      titleEl.style.opacity = "1";
      contentBarEl.style.height = "";
      contentEl.style.width = `${parentMainBarWidth}px`;
      contentEl.style.height = `${contentElHeightRef.current}px`;

      setTimeout(() => {
        inputEl.style.transition = "";
        contentEl.style.height = "auto";
        contentEl.style.width = "";
        contentEl.style.minHeight = "";
        contentEl.style.transition = "";
        contentBarEl.style.transition = "";
      }, 150);
    };

    onFocusOut({
      button: false,
      toggle: false,
      run,
      allow: [containerElRef.current!],
      not: [closeBtnEl],
      onStart: (e) => onFocusOutStartRef.current!(e),
      onExit: (e) => {
        if (e?.firedByEscape || e?.event.type == "click") {
          const input = inputElRef.current as HTMLElement;
          input.focus();
          input.blur();
        }

        onCloseInputRef.current!();
      },
    });
  };

  const onCloseInput = () => {
    if (!isOpenRef.current) {
      return;
    }
    isOpenRef.current = false;

    const contentEl = contentElRef.current!;
    const contentBarEl = contentEl.querySelector(".bar") as HTMLElement;
    const inputBoxInnerEl = inputFormElRef.current!.querySelector(
      ".input-box-inner"
    ) as HTMLElement;
    const titleEl = contentBarEl.querySelector(".title") as HTMLElement;
    const inputEl = inputElRef.current!;
    const formWidth = inputFormElRef.current!.clientWidth;
    const parentMainBarWidth = parentMainBarInputElRef.current!.clientWidth;
    const borderColumnWidth = 5;
    const inputValue = inputEl.value.trim();
    contentElHeightRef.current = contentEl.clientHeight + (inputValue ? 55 : 0);

    titleEl.style.opacity = "1";
    contentEl.style.width = `${parentMainBarWidth}px`;
    contentEl.style.height = `${contentElHeightRef.current}px`;

    reflow();

    inputEl.style.left = "";
    contentEl.style.width = `${formWidth + borderColumnWidth}px`;
    contentEl.style.height = `45px`;
    contentEl.style.minHeight = "unset";
    contentBarEl.style.height = "35px";
    titleEl.style.opacity = "0";
    contentBarEl.style.transition = "height 50ms linear";
    contentEl.style.transition = "height 100ms linear, width 100ms linear";
    titleEl.style.transition = "opacity 50ms linear";

    setTimeout(() => {
      contentEl.style.height = "";
      contentEl.style.width = "";
      contentEl.style.minHeight = "";
      contentEl.style.transition = "";
      contentBarEl.style.transition = "";
      containerElRef.current!.classList.remove("active");
      inputBoxInnerEl.classList.remove("active");
      inputEl.classList.remove("active");

      onCloseEnd();
    }, 150);
  };

  useEffect(() => {
    inputFormElRef.current = document.getElementById("url-input-form");
    parentMainBarInputElRef.current = document.getElementById("main-bar-input");
  }, []);

  useEffect(() => {
    onFocusOutStartRef.current = onFocusOutStart;
    onCloseInputRef.current = onCloseInput;
  });

  return (
    <>
      <input
        ref={inputElRef}
        spellCheck="false"
        // onClick={onOpenInput}

        onFocus={onOpenInput}
        onChange={onChange}
        className={`${isOpenRef.current ? "active" : ""} ${
          displayErrorRef.current ? "submitError" : ""
        }`}
        type="text"
        placeholder={"Past URL ..."}
      />
      <style jsx>
        {`
          input {
            position: relative;
            top: calc(-100% + 5px);
            left: 0;
            display: block;
            height: calc(100% - 10px);
            width: 100%;
            padding: 0 5px;
            border: 0;
            font-size: 14px;
            outline: none;
            pointer-events: all;
          }

          input::placeholder {
            color: #000;
            opacity: 0.5;
          }

          input:focus::placeholder {
            font-weight: bold;
          }

          input.active {
            position: absolute;
            top: unset;
            bottom: 5px;
            left: 5px;
            width: calc(100% - 45px);
            height: 35px;
          }

          input.submitError::placeholder {
            font-weight: bold;
            opacity: 1;
            color: red !important;
          }

          @media (min-width: 500px) {
            input {
              font-size: 16.333px;
            }
          }
        `}
      </style>
    </>
  );
};

export default Input;
