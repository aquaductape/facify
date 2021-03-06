import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import getScrollbarWidth from "../../utils/getScrollWidth";

type THeadProps = {
  id: string;
  mobile?: boolean;
};
const THead = ({ id, mobile }: THeadProps) => {
  const showStickyTHead = useSelector(
    (state: RootState) =>
      state.table.tables.find((item) => item.id === id)!.showStickyTHead.active
  );

  const tHeadContainerElRef = useRef<HTMLDivElement>(null);
  const containerElRef = useRef<HTMLDivElement>(null);

  const thead = ["Face", "Age", "Gender", "Multicultural"];
  return (
    <div
      aria-hidden={!showStickyTHead}
      className={`${
        mobile ? `thead-sticky-mobile-${id}` : `thead-sticky-desktop-${id}`
      } container`}
      ref={containerElRef}
    >
      <div className="thead-container" ref={tHeadContainerElRef}>
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
        `}
      </style>
      {/* dynamic */}
      <style jsx>
        {`
          .container {
            display: ${!mobile ? "none" : "block"};
            top: ${!mobile ? "60px" : "28px"};
            left: ${!mobile ? "0" : "unset"};
            width: ${!mobile
              ? `calc(100% - ${getScrollbarWidth()}px)`
              : "100%"};
             {
              /* opacity: ${showStickyTHead ? "1" : "0"};
            transition: ${showStickyTHead
                ? "opacity 0ms 0ms"
                : "opacity 0ms 250ms"}; */
            }

             {
              /* COOL THING I FOUND!! Since overflow causes problems with sticky children, you can use this clip-path to clip instead of using overflow:hidden to clip. 
              
              Downside: clip-path basic shape NOT supported by Edge Legacy.
              */
            }
            clip-path: ${!mobile
              ? "polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%)"
              : "polygon(0% 100%, 0% 0%, 1300px 0%, 1300px 100%)"};
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
