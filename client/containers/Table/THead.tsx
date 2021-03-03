import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";

type THeadProps = {
  mobile?: boolean;
};
const THead = ({ mobile }: THeadProps) => {
  const showStickyTHead = useSelector(
    (state: RootState) => state.table.showStickyTHead
  );

  const thead = ["Face", "Age", "Gender", "Multicultural"];
  return (
    <div
      className={`${
        mobile ? "thead-sticky-mobile" : "thead-sticky-desktop"
      } container`}
    >
      <div className="thead-container">
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
            margin-bottom: -45px;
            overflow: hidden;
            z-index: 5;
          }

          .thead-container {
            display: grid;
            grid-template-columns: 120px 1fr 1fr 1fr;
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
        `}
      </style>
      {/* dynamic */}
      <style jsx>
        {`
          .container {
            display: ${!mobile ? "none" : "block"};
            top: ${!mobile ? "60px" : "28px"};
          }

          .thead-container {
            transform: ${showStickyTHead
              ? "translateY(0)"
              : "translateY(-125%)"};
          }
          @media (min-width: 1300px) {
            .container {
              display: ${mobile ? "none" : "block"};
            }
          }
        `}
      </style>
    </div>
  );
};

export default THead;
