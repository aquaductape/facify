import { nanoid } from "nanoid";
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import ClientOnly from "../../../components/ClientOnly";
import onFocusOut from "../../../lib/onFocusOut/onFocusOut";
import { reflow } from "../../../utils/reflow";
import { addUrlItem } from "../formSlice";
import InputBoxInner from "./InputBoxInner";
import InputMiniTags from "./InputMiniTags";
import Main from "./Main";

type InputProps = {
  value: string;
  onInputChange: (e: InputEvent) => void;
  // inputValueRef
  placeholder: string;
  error: boolean;
  submitBtnHover: boolean;
};

const Input = ({ placeholder, error, submitBtnHover }: InputProps) => {
  const [inputFocused, setInputFocused] = useState(false);
  const inputFormElRef = useRef<HTMLElement | null>(null);
  const inputElRef = useRef<HTMLInputElement>(null);
  const parentMainBarInputElRef = useRef<HTMLElement | null>(null);
  const contentElRef = useRef<HTMLDivElement | null>(null);
  const containerElRef = useRef<HTMLDivElement | null>(null);
  const contentElHeight = useRef(100);
  const isOpenRef = useRef(false);

  // const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key !== "Tab") return;
  //   setInputFocused(true);
  // };

  // const onBlur = () => {
  //   setInputFocused(false);
  // };

  useEffect(() => {
    inputFormElRef.current = document.getElementById("url-input-form");
    parentMainBarInputElRef.current = document.getElementById("main-bar-input");
  }, []);

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
      contentEl.style.width = `${formWidth + borderColumnWidth}px`;
      contentEl.style.minHeight = "unset";
      contentBarEl.style.height = "35px";
      titleEl.style.opacity = "0";

      reflow();

      inputEl.style.transition = "left 50ms 50ms linear";
      contentBarEl.style.transition = "height 50ms 50ms linear";
      contentEl.style.transition = "height 100ms linear, width 100ms linear";
      titleEl.style.transition = "opacity 100ms 50ms linear";
      inputEl.style.left = "40px";
      titleEl.style.opacity = "1";
      contentBarEl.style.height = "";
      contentEl.style.width = `${parentMainBarWidth}px`;
      contentEl.style.height = `${contentElHeight.current}px`;

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
      onExit: (e) => {
        if (e?.firedByEscape) {
          const input = inputElRef.current as HTMLElement;
          input.blur();
        }

        onCloseInput();
      },
    });

    // const inputWidth = ref
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
    const inputEl = inputElRef.current as HTMLElement;
    const formWidth = inputFormElRef.current!.clientWidth;
    const parentMainBarWidth = parentMainBarInputElRef.current!.clientWidth;
    const borderColumnWidth = 5;
    contentElHeight.current = contentEl.clientHeight;

    titleEl.style.opacity = "1";
    contentEl.style.width = `${parentMainBarWidth}px`;
    contentEl.style.height = `${contentElHeight.current}px`;

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
    }, 150);
  };

  // fake-container is only there for transition animation, otherwise it is not displayed
  return (
    <div
      ref={containerElRef}
      className={`container ${isOpenRef.current ? "active" : ""}`}
    >
      <div ref={contentElRef} className="content">
        {/* to hide during transition */}
        <div className="content-inner">
          <div className="border-bg">
            <div className="gradient blue"></div>
            <div className="gradient black"></div>
            <div className="gradient red-error"></div>
          </div>
          <div className="main-container">
            <ClientOnly>
              <Main onCloseInput={onCloseInput}></Main>
            </ClientOnly>
          </div>
          <div className="mini-tags-container">
            <ClientOnly>
              <InputMiniTags></InputMiniTags>
            </ClientOnly>
          </div>
        </div>
        <InputBoxInner
          ref={inputElRef}
          isOpenRef={isOpenRef}
          onOpenInput={onOpenInput}
          error={error}
          placeholder={placeholder}
        ></InputBoxInner>
      </div>
      <style jsx>
        {`
          .container {
            flex-grow: 1;
          }

          .content,
          .mini-tags-container {
            height: 100%;
          }

          .content-inner {
            position: relative;
            height: 100%;
          }

          .main-container {
            display: none;
            height: 100%;
            overflow: hidden;
          }

          .border-bg {
            position: relative;
            left: -5px;
            width: calc(100% + 5px);
            height: 100%;
            padding: 5px 0;
            padding-left: 5px;
            background: #102466fc;
            overflow: hidden;
          }

          .container.active .gradient.blue,
          .container.animate .gradient.blue {
            transform: translateX(-100%);
          }

          .gradient {
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 100%;
            transition: transform ease-in-out 450ms;
          }

          .blue {
            background: linear-gradient(
              90deg,
              #c6c6c6,
              #102466fc 50%,
              #102466fc
            );
          }

          .black {
            background: linear-gradient(90deg, #102466fc, #000 50%, #000);
          }
          .red-error {
            background: linear-gradient(90deg, #000, red 50%, red);
          }

          .black,
          .red-error {
            transform: translateX(101%);
          }

          .container:hover .blue,
          .container:focus-within .blue {
            transform: translateX(-100%);
          }

          .container:focus {
            background: #000;
          }

          .container.active .content {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: auto;
            height: 45px;
            min-height: 100px;
            max-height: 250px;
          }

          .container.active .content .border-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }

          .container.active .main-container {
            display: block;
          }

          .container.active .content-inner {
            padding: 5px;
          }

          .container.active .mini-tags-container {
            display: none;
          }

          .container.active .content {
            min-height: 100px;
            max-height: 500px;
          }

          @media (min-width: 600px) {
            .container.active .content {
              max-height: calc(100vh - 133px - 45px);
            }
          }
        `}
      </style>
      {/* dynamic */}
      <style jsx>
        {`
          .container {
            ${inputFocused
              ? `
              outline: 3px solid #000;
              outline-offset: 4px;
              z-index: 2;
            `
              : ""}
          }

          .blue {
            transform: ${error ? "translateX(-100%)" : ""};
          }

          .red-error {
            transform: ${error ? "translateX(-45%)" : ""};
          }

          .black {
            transform: ${submitBtnHover ? "translateX(-50%)" : ""};
          }

          .blue {
            transform: ${submitBtnHover ? "translateX(-100%)" : ""};
          }

          .black {
            transform: ${error ? "translateX(101%)" : ""};
          }
        `}
      </style>
    </div>
  );
};

export default Input;
