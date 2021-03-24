import React, { useRef, useState } from "react";
import InputBoxInner from "./InputBoxInner/InputBoxInner";
import InputMiniTags from "./InputMiniTags";
import Main from "./Main";

type InputProps = {
  // inputValueRef
  submitHoverRef: React.MutableRefObject<boolean>;
  isOpenRef: React.MutableRefObject<boolean>;
  displayErrorRef: React.MutableRefObject<boolean>;
};

const Input = ({ submitHoverRef, isOpenRef, displayErrorRef }: InputProps) => {
  const [inputFocused, setInputFocused] = useState(false);
  const contentElRef = useRef<HTMLDivElement | null>(null);
  const containerElRef = useRef<HTMLDivElement | null>(null);

  // const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key !== "Tab") return;
  //   setInputFocused(true);
  // };

  // const onBlur = () => {
  //   setInputFocused(false);
  // };

  return (
    <div
      ref={containerElRef}
      id="submit-box"
      className={`container ${isOpenRef.current ? "active" : ""} ${
        submitHoverRef.current ? "submitHover" : ""
      } ${displayErrorRef.current ? "submitError" : ""}`}
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
            {/* <ClientOnly> */}
            <Main></Main>
            {/* </ClientOnly> */}
          </div>
          <div className="mini-tags-container">
            {/* <ClientOnly> */}
            <InputMiniTags></InputMiniTags>
            {/* </ClientOnly> */}
          </div>
        </div>
        <InputBoxInner
          isOpenRef={isOpenRef}
          displayErrorRef={displayErrorRef}
          containerElRef={containerElRef}
          contentElRef={contentElRef}
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

          .mini-tags-container {
            pointer-events: none;
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

          .container.submitError .blue {
            transform: translateX(-100%);
          }

          .container.submitError .red-error {
            transform: translateX(-45%);
          }

          .container.submitHover .black {
            transform: translateX(-50%);
          }

          .container.submitHover .blue {
            transform: translateX(-100%);
          }

          .container.submitError .black {
            transform: translateX(101%);
          }

          @media (min-width: 600px) {
            .container.active .content {
              max-height: calc(100vh - 133px - 45px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Input;
