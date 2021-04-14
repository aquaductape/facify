import { capitalize } from "lodash";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import getScrollbarWidth from "../../utils/getScrollWidth";
import { sortChildIds } from "../FaceDetectionResult/ImageResult/demographicsSlice";

const THChildEl = ({
  parentIdx,
  idx,
  type,
  item,
}: Omit<THeadProps, "id"> & {
  idx: number;
  item: string;
}) => {
  const dispatch = useDispatch();
  const sort = useSelector(
    (state: RootState) =>
      state.demographics.parents[parentIdx].tableClassify.sort
  );

  const onClick = () => {
    dispatch(
      sortChildIds({
        id: parentIdx,
        action: "ACS",
        category: item as any,
      })
    );
  };
  return (
    <>
      {type === "sticky" ? (
        <div
          className={`th ${idx === 0 ? "thead-image" : ""}`}
          onClick={onClick}
          key={idx}
        >
          {idx !== 0 ? <span className="buffer"></span> : null}
          {idx === 0 ? <span className="bg"></span> : null}
          <span>{capitalize(item)}</span>
          {sort.action && sort.category === item ? (
            <span className={`sort-active ${sort.action.toLowerCase()}`}>
              V
            </span>
          ) : null}
        </div>
      ) : (
        <th
          className={`th ${idx === 0 ? "thead-image" : ""}`}
          onClick={onClick}
          key={idx}
        >
          {idx !== 0 ? <span className="buffer"></span> : null}
          {idx === 0 ? <span className="bg"></span> : null}
          <span>{capitalize(item)}</span>
          {sort.action && sort.category === item ? (
            <span className={`sort-active ${sort.action.toLowerCase()}`}>
              V
            </span>
          ) : null}
        </th>
      )}
      <style jsx>
        {`
          .th {
            position: relative;
            text-align: left;
            padding: 8px 0;
            height: 100%;
            cursor: pointer;
            transition: background-color 250ms;
          }

          .th:hover {
            background: #d8deef;
          }

          .buffer {
            background: #fff;
            position: absolute;
            top: 0;
            left: -10px;
            width: 10px;
            height: 100%;
            transition: background-color 250ms;
          }
          .th:hover .buffer {
            background: #d8deef;
          }

          .sort-active {
            display: inline-block;
            padding-right: 8px;
          }

          .sort-active.acs {
            transform: rotate(180deg);
          }

          .thead-image {
            position: sticky;
            top: 0;
            left: 0;
            width: 120px;
            overflow: hidden;
            z-index: 1;
          }

          .thead-image span {
            display: inline-block;
            position: relative;
            padding: 0 10px;
            padding-right: 20px;
          }

          .thead-image .bg {
            position: absolute;
            top: 0;
            left: 0;
            background: #fff;
            width: 70px;
            height: 100%;
            padding: 0;
            transition: background-color 250ms;
          }

          .th:hover .bg {
            background: #d8deef;
          }
        `}
      </style>
    </>
  );
};

type THeadProps = {
  id: string;
  parentIdx: number;
  type?: "sticky";
};

const THead = ({ id, parentIdx, type }: THeadProps) => {
  const thead = ["face", "age", "gender", "multicultural"];

  if (type !== "sticky") {
    return (
      <thead data-id-static-thead={id} className="thead">
        <tr>
          {thead.map((item, idx) => (
            <THChildEl
              parentIdx={parentIdx}
              idx={idx}
              item={item}
              type={type}
              key={idx}
            ></THChildEl>
          ))}
        </tr>
        <style jsx>
          {`
            .thead {
              border-top: 1px solid #d5d5d5;
            }
          `}
        </style>
      </thead>
    );
  }

  return (
    <div data-id-thead-sticky={id} className={`container`}>
      <div
        className="thead-container"
        data-triggered-by-info-result="false"
        data-triggered-by-thead="false"
      >
        {thead.map((item, idx) => (
          <THChildEl
            parentIdx={parentIdx}
            idx={idx}
            item={item}
            type={type}
            key={idx}
          ></THChildEl>
        ))}
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
            pointer-events: none;
            top: 0;
            z-index: 5;
          }

          .thead-container {
            display: grid;
            grid-template-columns: 120px 1fr 1fr 1fr;
            border-top: 1px solid #d5d5d5;
            height: 38px;
            min-width: 700px;
            font-weight: bold;
            text-align: left;
            background: #fff;
            box-shadow: 0 12px 12px -15px #000;
            pointer-events: all;
            transform: translateY(-125%);
            transition: transform 250ms;
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
