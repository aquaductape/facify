import React from "react";
import { useSelector } from "react-redux";
import Stats from "../../Stats/Stats";
import { BarSentinel } from "../../Table/Sentinel";
import { selectName } from "../ImageResult/demographicsSlice";
import CloseBtn from "./CloseBtn";

const Bar = ({ id, _id, idx }: { id: number; _id: string; idx: number }) => {
  const imageName = useSelector(selectName({ id }));

  return (
    <div className="bar">
      <BarSentinel id={id} _id={_id}></BarSentinel>
      <div className="title">
        <div className="title-number">{idx + 1}</div>
        <div className="title-name">{imageName}</div>
      </div>
      <div className="stats">
        <Stats id={id}></Stats>
      </div>
      <CloseBtn id={id} _id={_id} idx={idx}></CloseBtn>
      <style jsx>
        {`
          .bar {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 45px;
          }

          .title {
            display: flex;
            align-items: center;
          }

          .title-number {
            color: #888;
            font-size: 28px;
            margin: 0 15px;
            font-weight: bold;
          }

          .title-name {
            font-size: 18px;
            max-width: 225px;
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
