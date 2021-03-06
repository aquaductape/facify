import React from "react";

const Seperator = () => {
  return (
    <div className="seperator">
      <div className="border-top">
        <div className="triangle-bottom-right"></div>
        <div className="rectangle"></div>
        <div className="triangle-bottom-left"></div>
        <div className="close-btn-shadow">
          <div className="triangle-top-right"></div>
          <div className="rectangle"></div>
          <div className="triangle-bottom-left"></div>
        </div>
      </div>
      <style jsx>
        {`
          .seperator {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            height: 80px;
            background: linear-gradient(
              0deg,
              var(--blue-3) -8%,
              var(--blue-2) 15%,
              transparent 48%
            );
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
            border-top: 30px solid var(--blue-100);
            border-left: 30px solid transparent;
          }

          .close-btn-shadow {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
          }

          .close-btn-shadow .triangle-bottom-left {
            border-bottom: 30px solid var(--blue-100);
          }
          .close-btn-shadow .rectangle {
            background: var(--blue-100);
            width: 15px;
          }
        `}
      </style>
    </div>
  );
};

export default Seperator;
