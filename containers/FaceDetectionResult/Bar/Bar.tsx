import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BarSentinel, ClassifySentinelTop } from "../InfoResult/Table/Sentinel";
import { selectName } from "../ImageResult/demographicsSlice";
import CloseBtn from "./CloseBtn";
import UtilBar from "../InfoResult/UtilBar/UtilBar";
import { useMatchMedia } from "../../../hooks/useMatchMedia";
import store from "../../../store/store";

const Bar = ({ id, idx }: { id: string; idx: number }) => {
  const imageName = useSelector(selectName({ id: idx }));
  const [hasFaces] = useState(
    () => !!store.getState().demographics.parents[idx].childIds.length
  );
  const [displayUtilBar, setDisplayUtilBar] = useState(false);
  const mqlGroup = useMatchMedia();

  useEffect(() => {
    if (!hasFaces) return;

    if (mqlGroup.current!.minWidth_1300.matches) {
      setDisplayUtilBar(true);
    }

    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setDisplayUtilBar(true);
      } else {
        setDisplayUtilBar(false);
      }
    };

    mqlGroup.current!.minWidth_1300.addEventListener("change", onChange);

    return () => {
      mqlGroup.current!.minWidth_1300.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div className="bar">
      {hasFaces ? (
        <>
          <ClassifySentinelTop id={id}></ClassifySentinelTop>
          <BarSentinel id={id}></BarSentinel>
        </>
      ) : null}
      <div className="title">
        <div className="title-number"></div>
        <div className="title-name" title={imageName}>
          {imageName}
        </div>
      </div>
      {displayUtilBar ? (
        <div className="util-bar">
          <UtilBar id={id} parentIdx={idx}></UtilBar>
        </div>
      ) : null}
      <div className="close-btn">
        <CloseBtn id={id} idx={idx}></CloseBtn>
      </div>
      <style jsx>
        {`
          .close-btn {
            flex-shrink: 0;
          }
          .util-bar {
            height: 100%;
            width: 600px;
            margin-left: auto;
            margin-right: 50px;
          }
          .bar {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 45px;
            background: #fff;
          }

          .title {
            display: flex;
            align-items: baseline;
            width: 80%;
          }

          .title-number {
            position: relative;
            counter-increment: demographic-counter;
            color: #888;
            font-size: 28px;
            margin: 0 15px;
            font-weight: bold;
          }

          .title-number::before {
            content: counter(demographic-counter);
            top: 0;
            left: 0;
            color: #888;
            font-size: 28px;
            font-weight: bold;
          }

          .title-name {
            position: relative;
            font-size: 18px;
            width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          .stats {
            position: absolute;
            top: 0;
            left: 50%;
            height: 100%;
            display: none;
          }

          @media (min-width: 1300px) {
            .title {
              width: auto;
            }

            .title-number {
              font-size: 30px;
              margin: 0 20px;
              margin-right: 30px;
            }
            .title-name {
              font-size: 20px;
              max-width: 500px;
              margin-right: 20px;
            }

            .stats {
              display: block;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Bar;
