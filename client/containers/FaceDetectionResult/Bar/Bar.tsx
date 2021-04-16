import React from "react";
import { useSelector } from "react-redux";
import Stats from "../../Stats/Stats";
import { BarSentinel } from "../InfoResult/Table/Sentinel";
import { selectName } from "../ImageResult/demographicsSlice";
import CloseBtn from "./CloseBtn";

const Bar = ({ id, idx }: { id: string; idx: number }) => {
  const imageName = useSelector(selectName({ id: idx }));

  return (
    <div className="bar">
      <div className="bar-sentinel-for-classify"></div>
      <BarSentinel id={id}></BarSentinel>
      <div className="title">
        <div className="title-number"></div>
        <div className="title-name">{imageName}</div>
      </div>
      <div className="stats">
        <Stats id={idx}></Stats>
      </div>
      <CloseBtn id={id} idx={idx}></CloseBtn>
      <style jsx>
        {`
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
            align-items: center;
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
              margin-right: 35px;
            }
            .title-name {
              font-size: 20px;
              max-width: 500px;
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
