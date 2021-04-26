import React from "react";

const Seperator = ({ id }: { id: string }) => {
  // https://stackoverflow.com/questions/38391457/linear-gradient-to-transparent-bug-in-latest-safari
  return (
    <div className="seperator">
      <div className="gradient light"></div>
      <div className="gradient dark"></div>
      <div className="border-top">
        <div className="triangle-bottom-right"></div>
        <div className="rectangle"></div>
        <div className="triangle-bottom-left"></div>
        <div data-id-close-btn-shadow={id} className="close-btn-shadow">
          <div className="triangle-top-right"></div>
          <div className="rectangle"></div>
          <div className="triangle-bottom-left"></div>
        </div>
      </div>
      <style jsx>
        {`
          .seperator {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            height: 80px;
          }

          .gradient {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transition: opacity 800ms;
          }

          .dark {
            opacity: 0;
            background: linear-gradient(0deg, #00000066, rgba(0, 0, 0, 0) 100%);
          }

          .light {
            opacity: 1;
            background: linear-gradient(
              0deg,
              var(--blue-3) -8%,
              var(--blue-2) 15%,
              rgba(185, 195, 232, 0) 48%
            );
          }

          .dark.active {
            opacity: 1;
            transition: opacity 250ms;
          }

          .light.active {
            opacity: 0;
            transition: opacity 250ms;
          }

          .border-top {
            position: relative;
            display: flex;
            width: 100%;
          }

          .rectangle {
            width: 100%;
            height: 30px;
            background: var(--blue);
          }

          .triangle-bottom-right {
            width: 0;
            height: 0;
            border-bottom: 30px solid var(--blue);
            border-left: 30px solid transparent;
          }

          .triangle-bottom-left {
            width: 0;
            height: 0;
            border-bottom: 30px solid var(--blue);
            border-right: 30px solid transparent;
          }

          .triangle-top-right {
            width: 0;
            height: 0;
            border-top: 30px solid currentColor;
            border-left: 30px solid transparent;
          }

          .close-btn-shadow {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
          }

          .close-btn-shadow {
            color: var(--blue-100);
            transition: color 250ms;
          }

          .close-btn-shadow .triangle-bottom-left {
            border-bottom: 30px solid currentColor;
            transition: border-color 250ms;
          }

          .close-btn-shadow .triangle-top-right {
            transition: border-color 250ms;
          }

          .close-btn-shadow .rectangle {
            background: currentColor;
            width: 15px;
            transition: background-color 250ms;
          }
        `}
      </style>
    </div>
  );
};

export default Seperator;
