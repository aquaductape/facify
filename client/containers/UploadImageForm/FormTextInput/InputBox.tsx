import React, { useRef, useState } from "react";
import InputBoxInner from "./InputBoxInner/InputBoxInner";
import InputMiniTags from "./InputMiniTags";
import TagsArea from "./TagsArea/TagsArea";

type InputProps = {
  // inputValueRef
  submitHoverRef: React.MutableRefObject<boolean>;
  isOpenRef: React.MutableRefObject<boolean>;
  displayErrorRef: React.MutableRefObject<boolean>;
};

const Input = ({ submitHoverRef, isOpenRef, displayErrorRef }: InputProps) => {
  const contentElRef = useRef<HTMLDivElement | null>(null);
  const containerElRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerElRef}
      id="submit-box"
      className={`container ${isOpenRef.current ? "active" : ""} ${
        submitHoverRef.current ? "submitHover" : ""
      } ${displayErrorRef.current ? "submitError" : ""}`}
    >
      <div ref={contentElRef} className="content">
        <div className="shadow"></div>
        <div className="content-inner">
          <div className="border-bg">
            <div className="gradient blue"></div>
            <div className="gradient black"></div>
            <div className="gradient red-error"></div>
          </div>
          <div className="main-container">
            {/* <ClientOnly> */}
            <TagsArea></TagsArea>
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

          .shadow {
            display: none;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            opacity: 0;
            transform: scaleX(0.9);
            box-shadow: 0 0px 12px 2px black;
            transition: opacity 50ms ease;
            z-index: -1;
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

          .container.active .shadow {
            display: block;
          }

          .container.active .content-inner {
            padding: 5px;
          }

          .container.active .mini-tags-container {
            display: none;
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
            .shadow {
              transform: scaleX(0.95);
              box-shadow: 0 0px 15px 2px black;
            }
          }

          @media (min-width: 850px) {
            .container.active .content {
              max-height: 400px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Input;
