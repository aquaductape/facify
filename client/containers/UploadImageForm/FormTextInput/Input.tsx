import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import ClientOnly from "../../../components/ClientOnly";
import CloseBtn from "../../../components/svg/CloseBtn";
import onFocusOut from "../../../lib/onFocusOut/onFocusOut";
import { reflow } from "../../../utils/reflow";
import Main from "./Main";

type InputProps = {
  value: string;
  onInputChange: (e: InputEvent) => void;
  placeholder: string;
  error: boolean;
  submitBtnHover: boolean;
};

const Input = forwardRef(
  (
    { onInputChange, value, placeholder, error, submitBtnHover }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [inputFocused, setInputFocused] = useState(false);
    const inputFormElRef = useRef<HTMLElement | null>(null);
    const parentMainBarInputElRef = useRef<HTMLElement | null>(null);
    const contentElRef = useRef<HTMLDivElement | null>(null);
    const containerElRef = useRef<HTMLDivElement | null>(null);
    const [active, setActive] = useState(false);
    const isOpenRef = useRef(false);

    // const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //   if (e.key !== "Tab") return;
    //   setInputFocused(true);
    // };

    const onBlur = () => {
      setInputFocused(false);
    };

    useEffect(() => {
      inputFormElRef.current = document.getElementById("url-input-form");
      parentMainBarInputElRef.current = document.getElementById(
        "main-bar-input"
      );
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
        const titleEl = contentBarEl.querySelector(".title") as HTMLElement;
        const formWidth = inputFormElRef.current!.clientWidth;
        const parentMainBarWidth = parentMainBarInputElRef.current!.clientWidth;
        containerElRef.current!.classList.add("active");
        contentEl.style.width = `${formWidth}px`;
        contentEl.style.minHeight = "unset";
        contentBarEl.style.height = "35px";
        titleEl.style.opacity = "0";
        reflow();
        contentBarEl.style.transition = "height 50ms 50ms linear";
        contentEl.style.transition = "height 100ms linear, width 100ms linear";
        titleEl.style.transition = "opacity 100ms 50ms linear";
        titleEl.style.opacity = "1";
        contentBarEl.style.height = "";
        contentEl.style.width = `${parentMainBarWidth}px`;
        contentEl.style.height = "100px";

        setTimeout(() => {
          contentEl.style.width = "";
          contentEl.style.minHeight = "";
          contentEl.style.transition = "";
          contentBarEl.style.transition = "";
        }, 150);
      };

      onFocusOut({
        button: closeBtnEl,
        toggle: false,
        run,
        allow: [containerElRef.current!],
        not: [closeBtnEl],
        onExit: () => {
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
      const titleEl = contentBarEl.querySelector(".title") as HTMLElement;
      const formWidth = inputFormElRef.current!.clientWidth;
      const parentMainBarWidth = parentMainBarInputElRef.current!.clientWidth;

      titleEl.style.opacity = "1";
      contentEl.style.width = `${parentMainBarWidth}px`;
      contentEl.style.height = `${contentEl.clientHeight}px`;

      reflow();

      contentEl.style.width = `${formWidth}px`;
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
      }, 150);
    };

    // fake-container is only there for transition animation, otherwise it is not displayed
    return (
      <div
        ref={containerElRef}
        className={`container ${isOpenRef.current ? "active" : ""}`}
      >
        <div className="fake-container">
          <div className="border-bg">
            <div className="gradient blue"></div>
            <div className="gradient black"></div>
            <div className="gradient red-error"></div>
          </div>
          <div className="fake-white-bg"></div>
          <div className="fake-bar"></div>
        </div>
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
          </div>
          <input
            ref={ref}
            spellCheck="false"
            value={value}
            onClick={onOpenInput}
            onFocus={onOpenInput}
            onChange={onInputChange as any}
            className="input-url"
            type="text"
            placeholder={placeholder}
            // onKeyUp={onKeyUp}
            onBlur={onBlur}
          />
        </div>
        {/* <div className="border-bg">
          <div className="gradient blue"></div>
          <div className="gradient black"></div>
          <div className="gradient red-error"></div>
        </div> */}
        <style jsx>
          {`
            .container {
              flex-grow: 1;
            }

            .content {
              height: 100%;
            }

            .content-inner {
              height: 100%;
            }

            .main-container {
              display: none;
              height: 100%;
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

            .fake-container {
              display: none;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100px;
            }

            .fake-container .border-bg {
              left: 0;
              width: 100%;
            }

            .fake-white-bg {
              display: none;
              position: absolute;
              top: 5px;
              left: 5px;
              height: calc(100% - 10px);
              width: calc(100% - 10px);
              background: #fff;
            }

            .fake-bar {
              display: none;
              position: absolute;
              top: 5px;
              left: 5px;
              width: calc(100% - 10px);
              height: calc(45px - 5px);
              background: #ececec;
            }

            .container.animate .fake-container,
            .container.animate .fake-white-bg,
            .container.animate .fake-bar,
            .container.animate .fake-container .border-bg {
              display: block;
            }

            .container.animate .fake-container .border-bg {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100px;
              background: #102466fc;
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

            input {
              position: relative;
              top: calc(-100% + 5px);
              left: 0;
              display: block;
              height: calc(100% - 10px);
              width: 100%;
              padding: 0 5px;
              border: 0;
              outline: none;
            }

            input:focus::placeholder {
              color: #000;
              font-weight: bold;
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

            .container.active input {
              position: absolute;
              top: unset;
              bottom: 5px;
              left: 5px;
              width: calc(100% - 40px);
              height: 35px;
            }

            @media (min-width: 500px) {
              .container.active .content {
                min-height: 100px;
                max-height: 500px;
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

            input::placeholder {
              color: ${error ? "red !important" : ""};
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
  }
);

export default Input;
