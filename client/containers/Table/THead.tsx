import React, { useRef } from "react";
import getScrollbarWidth from "../../utils/getScrollWidth";

type THeadProps = {
  id: string;
};

const THead = ({ id }: THeadProps) => {
  const thead = ["Face", "Age", "Gender", "Multicultural"];
  return (
    <div data-id-thead-sticky={id} className={`container`}>
      <div
        className="thead-container"
        data-triggered-by-info-result="false"
        data-triggered-by-thead="false"
      >
        {thead.map((item, idx) => {
          return (
            <div className={idx === 0 ? "thead-image" : ""} key={idx}>
              {idx === 0 ? <span className="bg"></span> : null}
              <span>{item}</span>
            </div>
          );
        })}
      </div>

      <style jsx>
        {`
          .container {
            position: sticky;
            top: 0;
            left: 0;
            height: 45px;
            margin-bottom: 80px;
            clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%);
            overflow: hidden;
            top: 0;
            z-index: 5;
          }

          .thead-container {
            display: grid;
            grid-template-columns: 120px 1fr 1fr 1fr;
            border-top: 1px solid #d5d5d5;
            height: 35px;
            min-width: 700px;
            font-weight: bold;
            text-align: left;
            background: #fff;
            padding: 8px 0;
            box-shadow: 0 12px 12px -15px #000;
            transform: translateY(-125%);
            transition: transform 250ms;
          }

          .thead-image {
            position: sticky;
            top: 0;
            left: 0;
            overflow: hidden;
          }

          .thead-image span {
            display: inline-block;
            position: relative;
            background: #fff;
            padding: 0 10px;
            padding-right: 20px;
          }

          .thead-image .bg {
            position: absolute;
            top: 0;
            left: calc(-100% + 5px);
            background: #fff;
            width: 100%;
            height: 100%;
          }

          @media (min-width: 1300px) {
            .container {
              top: 60px;
              clip-path: polygon(0% 100%, 0% 0%, 1300px 0%, 1300px 100%);
            }
          }
        `}
      </style>
      {/* dynamic */}
      <style jsx>
        {`
          @media (min-width: 1300px) {
            .container {
              width: ${`calc(100% - ${getScrollbarWidth()}px)`};
            }
          }
        `}
      </style>
    </div>
  );
};

export default THead;
