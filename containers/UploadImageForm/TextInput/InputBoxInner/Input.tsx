import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CONSTANTS } from "../../../../constants";
import useDidMountEffect from "../../../../hooks/useDidMountEffect";
import onFocusOut, {
  OnFocusOutEvent,
} from "../../../../lib/onFocusOut/onFocusOut";
import { RootState } from "../../../../store/rootReducer";
import { doesImageExist } from "../../../../utils/doesImageExist";
import { getImageNameFromUrl } from "../../../../utils/getImageNameFromUrl";
import { reflow } from "../../../../utils/reflow";
import {
  addUrlItem,
  setInputResultFromUrlItems,
  setSubmit,
  setToggleInputTextBox,
} from "../../formSlice";
import { splitValueIntoUrlItems } from "./utils";

type TInputProps = {
  isOpenRef: React.MutableRefObject<boolean>;
  displayErrorRef: React.MutableRefObject<boolean>;
  contentElRef: React.MutableRefObject<HTMLDivElement | null>;
  containerElRef: React.MutableRefObject<HTMLDivElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imgError: boolean;
  setImgUrl: React.Dispatch<React.SetStateAction<string>>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  onInput: React.FormEventHandler<HTMLInputElement>;
  onKeyUp: React.KeyboardEventHandler<HTMLInputElement>;
};

let submitBtnActivated = false;
const Input = ({
  isOpenRef,
  displayErrorRef,
  contentElRef,
  containerElRef,
  imgError,
  onInput,
  onChange,
  setImgUrl,
  onKeyDown,
  onKeyUp,
}: TInputProps) => {
  const dispatch = useDispatch();
  const urlItems = useSelector((state: RootState) => state.form.urlItems);
  const toggleInputTextBox = useSelector(
    (state: RootState) => state.form.toggleInputTextBox
  );

  const contentElHeightRef = useRef(100);
  const inputElRef = useRef<HTMLInputElement>(null);
  const inputFormElRef = useRef<HTMLElement | null>(null);
  const parentMainBarInputElRef = useRef<HTMLElement | null>(null);
  const onFocusOutStartRef = useRef<((e: OnFocusOutEvent) => boolean) | null>(
    null
  );
  const onCloseInputRef = useRef<(() => void) | null>(null);

  // input has multiple urls
  // isScrollContainer
  const submitValuesValid = () => {
    const value = inputElRef.current!.value.trim();

    // emtpy
    if (!value && !urlItems.length) {
      // display "Cannot submit empty value"
      // setDisplayTextResult("Cannot submit empty value")
      const inputArrowEl = document.getElementById("input-arrow")!;

      inputElRef.current?.focus();
      inputArrowEl.style.animation = "Shake-Center 300ms ease-in-out 2";

      setTimeout(() => {
        inputArrowEl.style.animation = "";
      }, 600);
      return false;
    }

    // why won't you validate error items?
    // because currently they can't be interacted by screen reader or keyboard

    // one of the url items are invalid
    // if (!urlItemsValid()) {
    //   return false;
    // }

    // there's a value but it is invalid
    if (value && imgError && !urlItems.length) {
      inputElRef.current?.focus();
      return false;
    }

    return true;
  };

  const onCloseInputEnd = async () => {
    const inputEl = inputElRef.current!;
    const value = inputEl.value;
    const urlItems = splitValueIntoUrlItems({ value });
    // reset
    inputEl.value = "";
    for (const item of urlItems) {
      const success = await doesImageExist(item.content);
      item.error = !success;
      if (item.error) {
        item.errorMsg = CONSTANTS.imageExistErrorMsg;
      }
    }

    if (urlItems.length) {
      dispatch(addUrlItem(urlItems));
    }
  };

  const onSubmit = async () => {
    contentElHeightRef.current = 100;

    await onCloseInputEnd();

    setTimeout(() => {
      dispatch(setInputResultFromUrlItems());
      dispatch(setSubmit({ active: true, from: "text" }));
    }, 100);
  };

  const onFocusOutStart = (e: OnFocusOutEvent) => {
    const submitBtnEl = document.getElementById("detect-button")!;
    const event = e!.event;
    const target = event.target;

    if (
      event.type === "keyup" &&
      // @ts-ignore
      event.key.match(/tab/i)
    ) {
      return false;
    }

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
      const utilbarEl = inputBoxInnerEl.querySelector(
        ".utilbar-container"
      ) as HTMLElement;
      const titleEl = contentBarEl.querySelector(".title") as HTMLElement;
      const shadowEl = contentEl.querySelector(".shadow") as HTMLElement;
      const formWidth = inputFormElRef.current!.clientWidth;
      const inputEl = inputElRef.current!;
      const parentMainBarWidth = parentMainBarInputElRef.current!.clientWidth;
      const borderColumnWidth = 5;

      containerElRef.current!.classList.add("active");
      inputBoxInnerEl.classList.add("active");
      inputEl.classList.add("active");

      contentEl.style.width = `${formWidth + borderColumnWidth}px`;
      utilbarEl.style.opacity = "0";
      contentEl.style.minHeight = "unset";
      contentBarEl.style.height = "35px";
      titleEl.style.opacity = "0";
      inputEl.style.zIndex = "8";
      inputEl.focus();

      reflow();

      inputEl.style.transition = "left 50ms 50ms linear";
      contentBarEl.style.transition = "height 50ms 50ms linear";
      contentEl.style.transition = "height 100ms linear, width 100ms linear";
      titleEl.style.transition = "opacity 100ms 50ms linear";
      shadowEl.style.transition = "opacity 200ms 100ms ease";
      utilbarEl.style.transition = "opacity 100ms 100ms ease";

      utilbarEl.style.opacity = "1";
      shadowEl.style.opacity = "1";
      inputEl.style.left = "40px";
      titleEl.style.opacity = "1";
      contentBarEl.style.height = "";
      contentEl.style.width = `${parentMainBarWidth}px`;
      contentEl.style.height = `${contentElHeightRef.current}px`;

      setTimeout(() => {
        utilbarEl.style.opacity = "";
        inputEl.style.zIndex = "";
        inputEl.style.transition = "";
        contentEl.style.height = "auto";
        contentEl.style.width = "";
        contentEl.style.minHeight = "";
        contentEl.style.transition = "";
        contentBarEl.style.transition = "";
      }, 100);
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

        dispatch(setToggleInputTextBox(false));
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
    const shadowEl = contentEl.querySelector(".shadow") as HTMLElement;
    const inputBoxInnerEl = inputFormElRef.current!.querySelector(
      ".input-box-inner"
    ) as HTMLElement;
    const utilbarEl = inputBoxInnerEl.querySelector(
      ".utilbar-container"
    ) as HTMLElement;
    const titleEl = contentBarEl.querySelector(".title") as HTMLElement;
    const inputEl = inputElRef.current!;
    const formWidth = inputFormElRef.current!.clientWidth;
    const parentMainBarWidth = parentMainBarInputElRef.current!.clientWidth;
    const borderColumnWidth = 5;
    const inputValue = inputEl.value.trim();
    const inputValueCount = inputValue ? inputValue.split(" ").slice(0, 7) : [];
    contentElHeightRef.current = contentEl.clientHeight;

    inputEl.style.zIndex = "8";
    titleEl.style.opacity = "1";
    contentEl.style.width = `${parentMainBarWidth}px`;
    contentEl.style.height = `${contentElHeightRef.current}px`;
    contentElHeightRef.current += inputValueCount.reduce((acc) => acc + 55, 0);

    reflow();

    utilbarEl.style.opacity = "0";
    inputEl.style.left = "";

    contentEl.style.width = `${formWidth + borderColumnWidth}px`;
    contentEl.style.height = `45px`;
    contentEl.style.minHeight = "unset";
    contentBarEl.style.height = "35px";
    titleEl.style.opacity = "0";
    shadowEl.style.opacity = "0";

    contentBarEl.style.transition = "height 50ms linear";
    contentEl.style.transition = "height 100ms linear, width 100ms linear";
    utilbarEl.style.transition = "opacity 50ms linear";
    titleEl.style.transition = "opacity 50ms linear";
    shadowEl.style.transition = "";

    setTimeout(() => {
      inputEl.style.zIndex = "";
      contentEl.style.height = "";
      contentEl.style.width = "";
      contentEl.style.minHeight = "";
      contentEl.style.transition = "";
      contentBarEl.style.transition = "";
      utilbarEl.style.opacity = "";
      containerElRef.current!.classList.remove("active");
      inputBoxInnerEl.classList.remove("active");
      inputEl.classList.remove("active");

      onCloseEnd();
    }, 100);
  };

  const onFocus = () => {
    dispatch(setToggleInputTextBox(true));
  };

  const onToggleInput = () => {
    if (toggleInputTextBox) {
      onOpenInput();
      return;
    }
    onCloseInput();
  };

  useEffect(() => {
    inputFormElRef.current = document.getElementById("url-input-form");
    parentMainBarInputElRef.current = document.getElementById("main-bar-input");
  }, []);

  useEffect(() => {
    onFocusOutStartRef.current = onFocusOutStart;
    onCloseInputRef.current = onCloseInput;
  });

  useDidMountEffect(() => {
    onToggleInput();
  }, [toggleInputTextBox]);

  return (
    <>
      <input
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        ref={inputElRef}
        onFocus={onFocus}
        // onClick={onOpenInput}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onChange={onChange}
        className={`${isOpenRef.current ? "active" : ""} ${
          displayErrorRef.current ? "submitError" : ""
        }`}
        // can't be type="url" since some soft keyboards exclude Space key, which you need in order to type multiple URLs
        type="text"
        placeholder={"Past URL ..."}
      />
      <style jsx>
        {`
          input[type="text"] {
            -webkit-appearance: none;
            position: relative;
            top: calc(-100% + 5px);
            left: 0;
            display: block;
            height: calc(100% - 10px);
            width: 100%;
            padding: 0 5px;
            border: 0;
            font-size: 16px;
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
